const { Router } = require('express');
const { hives } = require('../store');
const { addBlockToChain } = require('../blockchain');
const router = Router();

router.get('/', (req, res) => {
  res.json({ ok: true, hives: Object.values(hives) });
});

router.get('/:hiveId', (req, res) => {
  const hive = hives[req.params.hiveId];
  if (!hive) return res.status(404).json({ ok: false, error: 'Hive not found' });
  res.json({ ok: true, hive });
});

router.post('/', (req, res) => {
  const { location, beekeeperName, floralSource, cluster, coordinates } = req.body;
  const hiveCount = Object.keys(hives).length + 1;
  const hiveId = `HIVE-BOX-${String(hiveCount).padStart(2, '0')}`;

  const newHive = {
    hiveId,
    boxNumber: `KVIC-BOX-${8800 + hiveCount}`,
    beekeeperId: null,
    beekeeperName: beekeeperName || 'Unassigned',
    location: location || 'Location TBD',
    coordinates: coordinates || { lat: 0, lon: 0 },
    floralSource: floralSource || 'Mixed Flora',
    installationDate: new Date().toISOString().split('T')[0],
    queenStatus: 'Unknown',
    colonyHealth: 'GOOD',
    weather: 'Awaiting first reading',
    powerSource: 'Solar-assisted',
    firmwareVersion: 'v2.3.1',
    calibrationDue: 'Not scheduled',
    healthScore: 50,
    swarmRisk: 'Low',
    diseaseRisk: { varroa: 5, foulbrood: 2, nosema: 3 },
    yieldForecastKg: 0,
    alertSeverity: 'none',
    cluster: cluster || (location ? location.split(',').pop().trim() : 'New Cluster'),
    gps: coordinates || { lat: 0, lon: 0 },
    beekeeper: beekeeperName || 'Unassigned',
    telemetry: {
      internalTemp: 34.5,
      humidity: 58.0,
      weightKg: 25.0,
      weightDelta24h: '+0.0 kg',
      acousticFreqHz: 240,
      co2Ppm: 500,
      batteryLevel: 100,
      ambientTemp: 28.0,
      lastUpdated: new Date().toISOString()
    },
    alerts: []
  };

  hives[hiveId] = newHive;
  addBlockToChain('HiveRegistered', { hiveId, location: newHive.location, beekeeper: newHive.beekeeperName });
  res.json({ ok: true, hive: newHive });
});

router.post('/:hiveId/telemetry', (req, res) => {
  const hive = hives[req.params.hiveId];
  if (!hive) return res.status(404).json({ ok: false, error: 'Hive not found' });

  const { internalTemp, humidity, weightKg, acousticFreqHz, co2Ppm } = req.body;

  if (internalTemp !== undefined) hive.telemetry.internalTemp = parseFloat(internalTemp);
  if (humidity !== undefined) hive.telemetry.humidity = parseFloat(humidity);
  if (weightKg !== undefined) hive.telemetry.weightKg = parseFloat(weightKg);
  if (acousticFreqHz !== undefined) hive.telemetry.acousticFreqHz = parseFloat(acousticFreqHz);
  if (co2Ppm !== undefined) hive.telemetry.co2Ppm = parseFloat(co2Ppm);
  hive.telemetry.lastUpdated = new Date().toISOString();

  // Evaluate dynamic smart alerts
  const alerts = [];
  if (hive.telemetry.acousticFreqHz > 400) {
    alerts.push('High Acoustic Activity: Queen Piping / Swarm Departure Imminent');
    hive.colonyHealth = 'WARNING';
  } else if (hive.telemetry.internalTemp > 37.5) {
    alerts.push('Brood Heat Stress: Hive ventilation required');
    hive.colonyHealth = 'WARNING';
  } else if (hive.telemetry.internalTemp < 32.0) {
    alerts.push('Brood Chilling Alert: Low temperature risk');
    hive.colonyHealth = 'WARNING';
  } else {
    hive.colonyHealth = 'EXCELLENT';
  }
  hive.alerts = alerts;

  res.json({ ok: true, hive });
});

module.exports = router;