const { hives } = require('./store');

// Live IoT telemetry simulation for approved smart hives.
// Keeps sensor readings moving so the dashboard never looks static.

let timer = null;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const round1 = (v) => Math.round(v * 10) / 10;
const drift = (value, amount, min, max) => clamp(value + (Math.random() - 0.5) * 2 * amount, min, max);

function isActive(hive) {
  // Legacy hives (no approvalStatus) are treated as already approved.
  return !hive.approvalStatus || hive.approvalStatus === 'APPROVED';
}

function evaluateAlerts(hive) {
  const t = hive.telemetry;
  const alerts = [];
  if (t.acousticFreqHz > 400) {
    alerts.push('High Acoustic Activity: Queen Piping / Swarm Departure Imminent');
    hive.colonyHealth = 'WARNING';
  } else if (t.internalTemp > 37.5) {
    alerts.push('Brood Heat Stress: Hive ventilation required');
    hive.colonyHealth = 'WARNING';
  } else if (t.internalTemp < 32.0) {
    alerts.push('Brood Chilling Alert: Low temperature risk');
    hive.colonyHealth = 'WARNING';
  } else {
    hive.colonyHealth = 'EXCELLENT';
  }
  hive.alerts = alerts;
  hive.alertSeverity = alerts.length ? 'medium' : 'none';
  if (hive.healthScore != null) {
    hive.healthScore = Math.round(clamp(hive.healthScore + (alerts.length ? -1 : 1), 45, 98));
  }
  return alerts;
}

function simulateTelemetry(hive) {
  if (!hive || !hive.telemetry) return null;
  const t = hive.telemetry;

  const prevWeight = Number(t.weightKg) || 25;
  const nextWeight = round1(clamp(prevWeight + (Math.random() - 0.42) * 0.06, 4, 90));

  t.internalTemp = round1(drift(Number(t.internalTemp) || 34.6, 0.14, 32.4, 37.2));
  t.humidity = round1(drift(Number(t.humidity) || 58, 0.6, 44, 74));
  t.weightKg = nextWeight;
  t.weightDelta24h = `${nextWeight - prevWeight >= 0 ? '+' : ''}${round1(nextWeight - prevWeight)} kg`;
  t.acousticFreqHz = Math.round(drift(Number(t.acousticFreqHz) || 240, 9, 190, 470));
  t.co2Ppm = Math.round(drift(Number(t.co2Ppm) || 520, 14, 380, 1250));
  t.batteryLevel = round1(clamp((Number(t.batteryLevel) || 95) - Math.random() * 0.03, 4, 100));
  t.ambientTemp = round1(drift(Number(t.ambientTemp) || 28, 0.3, 15, 43));
  t.lastUpdated = new Date().toISOString();

  evaluateAlerts(hive);
  return hive;
}

function tick() {
  Object.values(hives).forEach(hive => {
    if (!isActive(hive)) return;
    simulateTelemetry(hive);
  });
}

function startTelemetrySimulation(intervalMs = 4000) {
  if (timer || process.env.NODE_ENV === 'test') return timer;
  timer = setInterval(tick, intervalMs);
  if (timer.unref) timer.unref();
  return timer;
}

function stopTelemetrySimulation() {
  if (timer) clearInterval(timer);
  timer = null;
}

module.exports = { startTelemetrySimulation, stopTelemetrySimulation, simulateTelemetry, evaluateAlerts, tick };
