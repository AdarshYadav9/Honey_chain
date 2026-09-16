const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ===== In-Memory Blockchain & Storage for Honey Chain =====
const blockchain = [];
const batches = {}; // batchId -> HoneyBatch details
const hives = {}; // hiveId -> HiveDetails + real-time IoT metrics
const beekeepers = {}; // beekeeperId -> details
const users = {}; // userId -> user details

// Seed users
const seedUsers = [
  { id: 'U001', name: 'System Admin', email: 'admin@honeychain.demo', role: 'ADMIN', cluster: 'All Clusters', status: 'Active', joined: '02 Jan 2026' },
  { id: 'U002', name: 'Ganesh Pawar', email: 'beekeeper@honeychain.demo', role: 'BEEKEEPER', cluster: 'Satara', status: 'Active', joined: '12 Jan 2026' },
  { id: 'U003', name: 'Ramesh Shinde', email: 'ramesh.shinde@honeychain.demo', role: 'BEEKEEPER', cluster: 'Pune / Solapur', status: 'Active', joined: '18 Jan 2026' },
  { id: 'U004', name: 'Suresh More', email: 'suresh.more@honeychain.demo', role: 'BEEKEEPER', cluster: 'Kolhapur', status: 'Invited', joined: '02 Feb 2026' },
  { id: 'U005', name: 'Dr. Anita Kulkarni', email: 'officer@honeychain.demo', role: 'QUALITY_OFFICER', cluster: 'Satara Lab', status: 'Active', joined: '05 Jan 2026' },
  { id: 'U006', name: 'Vikram Deshmukh', email: 'processor@honeychain.demo', role: 'PROCESSOR', cluster: 'Satara Processing Unit', status: 'Active', joined: '08 Jan 2026' },
];
seedUsers.forEach(u => { users[u.id] = u; });

// Helper to compute SHA-256 hash
function calculateHash(index, previousHash, timestamp, data) {
  return crypto
    .createHash('sha256')
    .update(index + previousHash + timestamp + JSON.stringify(data))
    .digest('hex');
}

// Create Genesis Block
function initBlockchain() {
  const genesisData = { message: 'Honey Chain Genesis Block - KVIC Honey Mission' };
  const genesisTimestamp = '2025-01-01T00:00:00.000Z';
  const genesisHash = calculateHash(0, '0', genesisTimestamp, genesisData);
  blockchain.push({
    index: 0,
    timestamp: genesisTimestamp,
    data: genesisData,
    previousHash: '0',
    hash: genesisHash
  });
}
initBlockchain();

function addBlockToChain(type, payload) {
  const lastBlock = blockchain[blockchain.length - 1];
  const newIndex = blockchain.length;
  const timestamp = new Date().toISOString();
  const blockData = { type, payload, txId: uuidv4() };
  const newHash = calculateHash(newIndex, lastBlock.hash, timestamp, blockData);

  const block = {
    index: newIndex,
    timestamp,
    data: blockData,
    previousHash: lastBlock.hash,
    hash: newHash
  };
  blockchain.push(block);
  return block;
}

// ===== Initial KVIC Honey Mission Seed Data =====
const sampleBeekeepers = [
  {
    id: 'KVIC-BK-101',
    name: 'Rameshwar Verma',
    aadhaar: 'XXXX-XXXX-8912',
    krishiId: 'KRISHI-UP-4402',
    cluster: 'Muzaffarpur Apiary Cluster',
    state: 'Bihar',
    village: 'Kanti',
    boxesAllocated: 10,
    species: 'Apis mellifera (Italian Honey Bee)',
    phone: '+91-98765-43210',
    joinedDate: '2024-03-15',
    verified: true,
    geoZone: { latMin: 25.9, latMax: 26.3, lonMin: 85.1, lonMax: 85.5 }
  },
  {
    id: 'KVIC-BK-102',
    name: 'Sunita Devi',
    aadhaar: 'XXXX-XXXX-6721',
    krishiId: 'KRISHI-WB-9821',
    cluster: 'Sundarbans Mangrove Cluster',
    state: 'West Bengal',
    village: 'Gosaba',
    boxesAllocated: 15,
    species: 'Apis dorsata / Apis cerana indica',
    phone: '+91-98765-88321',
    joinedDate: '2024-05-10',
    verified: true,
    geoZone: { latMin: 21.8, latMax: 22.4, lonMin: 88.5, lonMax: 89.2 }
  },
  {
    id: 'KVIC-BK-103',
    name: 'Baljit Singh',
    aadhaar: 'XXXX-XXXX-3419',
    krishiId: 'KRISHI-PB-2311',
    cluster: 'Hoshiarpur Forest Apiary',
    state: 'Punjab',
    village: 'Mahilpur',
    boxesAllocated: 20,
    species: 'Apis mellifera',
    phone: '+91-98765-11223',
    joinedDate: '2024-01-20',
    verified: true,
    geoZone: { latMin: 31.3, latMax: 31.8, lonMin: 75.8, lonMax: 76.3 }
  }
];

sampleBeekeepers.forEach(bk => {
  beekeepers[bk.id] = bk;
});

// Initial Smart Hives with IoT Telemetry
const sampleHives = [
  {
    hiveId: 'HIVE-BOX-01',
    boxNumber: 'KVIC-BOX-8801',
    beekeeperId: 'KVIC-BK-101',
    beekeeperName: 'Rameshwar Verma',
    location: 'Muzaffarpur Litchi Orchard, Bihar',
    coordinates: { lat: 26.1209, lon: 85.3647 },
    floralSource: 'Litchi Blossom',
    installationDate: '2024-04-01',
    queenStatus: 'Active (Mated)',
    colonyHealth: 'EXCELLENT',
    telemetry: {
      internalTemp: 34.8, // Optimal 34 - 36 C
      humidity: 56.2, // Optimal 50 - 65 %
      weightKg: 28.4, // Live weight
      weightDelta24h: '+1.2 kg',
      acousticFreqHz: 235, // Normal buzz: 200-280 Hz (Swarm risk > 450 Hz)
      co2Ppm: 820,
      batteryLevel: 94,
      lastUpdated: new Date().toISOString()
    },
    alerts: []
  },
  {
    hiveId: 'HIVE-BOX-02',
    boxNumber: 'KVIC-BOX-8802',
    beekeeperId: 'KVIC-BK-102',
    beekeeperName: 'Sunita Devi',
    location: 'Sundarbans Forest Buffer, West Bengal',
    coordinates: { lat: 22.1652, lon: 88.8056 },
    floralSource: 'Sundarbans Wild Mangrove (Khalsi)',
    installationDate: '2024-05-15',
    queenStatus: 'Active',
    colonyHealth: 'GOOD',
    telemetry: {
      internalTemp: 35.2,
      humidity: 61.5,
      weightKg: 34.1,
      weightDelta24h: '+1.8 kg',
      acousticFreqHz: 250,
      co2Ppm: 910,
      batteryLevel: 88,
      lastUpdated: new Date().toISOString()
    },
    alerts: []
  },
  {
    hiveId: 'HIVE-BOX-03',
    boxNumber: 'KVIC-BOX-8803',
    beekeeperId: 'KVIC-BK-103',
    beekeeperName: 'Baljit Singh',
    location: 'Hoshiarpur Mustard Fields, Punjab',
    coordinates: { lat: 31.5273, lon: 75.9149 },
    floralSource: 'Organic Mustard & Eucalyptus',
    installationDate: '2024-02-10',
    queenStatus: 'Active (Marked Blue)',
    colonyHealth: 'WARNING',
    telemetry: {
      internalTemp: 37.8, // Slightly high
      humidity: 48.0,
      weightKg: 22.1,
      weightDelta24h: '-0.3 kg',
      acousticFreqHz: 420, // Swarm preparation alert
      co2Ppm: 1050,
      batteryLevel: 79,
      lastUpdated: new Date().toISOString()
    },
    alerts: ['Acoustic frequency surge: Potential Swarming Alert (Pre-Swarm Piping)']
  }
];

sampleHives.forEach(h => {
  hives[h.hiveId] = h;
});

// Seed Initial Honey Batch
const initialBatchId = 'HONEY-BATCH-2025-001';
batches[initialBatchId] = {
  id: initialBatchId,
  batchId: initialBatchId,
  batchName: 'Raw Pure Litchi Monofloral Honey',
  hiveId: 'HIVE-BOX-01',
  beekeeper: 'Rameshwar Verma',
  beekeeperId: 'KVIC-BK-101',
  beekeeperName: 'Rameshwar Verma',
  honeyType: 'Raw Pure Litchi Monofloral Honey',
  floralSource: 'Litchi Blossom (Muzaffarpur)',
  harvestDate: '2025-05-10',
  quantity: 45.0,
  quantityKg: 45.0,
  gpsLocation: { lat: 26.1209, lon: 85.3647 },
  extractionMethod: 'Stainless Steel Centrifugal Cold Extraction (Unheated)',
  status: 'CERTIFIED',
  qualityTest: {
    testedAt: '2025-05-12T10:30:00Z',
    labName: 'National Bee Board & FSSAI Accredited Referral Lab',
    moisturePercent: 17.2,
    nmrPurityScore: 99.4,
    hmf: 12.4,
    c4SugarAdulteration: 'NEGATIVE (< 1.0%)',
    c3SugarAdulteration: 'NEGATIVE',
    pollenDominance: '82% Litchi chinensis Pollen grains',
    antibioticResidues: 'NOT DETECTED (0.0 ppm)',
    fssaiCompliance: 'PASSED (FSSAI Reg. 2.8.2 / AGMARK Grade A)'
  },
  processing: { extractionUnit: 'SS Centrifugal Extractor — Unit A', outputQuantity: 43.2, processor: 'Satara Processing Unit' },
  processingSteps: [
    { step: 'Hive Extraction', date: '2025-05-10', notes: 'Unheated manual comb uncapping and centrifugal spin' },
    { step: 'Micro-Mesh Sediment Filtration', date: '2025-05-11', notes: 'Filtered to 200 microns to retain raw pollen' },
    { step: 'N2-Flushed Glass Bottling', date: '2025-05-13', notes: 'Packed in 500g amber glass jars with tamper seal' }
  ],
  packaging: { jarCount: 90, jarWeight: '500g', sealDate: '2025-05-13', packagingType: 'Glass Jar with Tamper-Evident Seal (500g)' },
  smartContractValidations: {
    moistureValidation: 'PASS (17.2% <= 20.0%)',
    geoFenceValidation: 'PASS (Within Approved Bihar Litchi Belt)',
    nmrPurityValidation: 'PASS (99.4% >= 98.0%)',
    adulterationValidation: 'PASS (100% Pure Raw Honey)',
    hmfValidation: 'PASS (12.4 mg/kg < 40 mg/kg)'
  },
  transactions: [
    { date: '2025-05-10T06:00:00.000Z', event: 'Harvest created', actor: 'Beekeeper' },
    { date: '2025-05-11T09:00:00.000Z', event: 'Harvest verified', actor: 'Quality Officer' },
    { date: '2025-05-12T10:30:00.000Z', event: 'Quality test passed', actor: 'Quality Officer' },
    { date: '2025-05-13T08:00:00.000Z', event: 'Processing completed', actor: 'Processor' },
    { date: '2025-05-13T14:00:00.000Z', event: 'Packaged (90 jars)', actor: 'Processor' },
  ]
};

// Record Initial Batch on Blockchain
addBlockToChain('BatchCertification', {
  batchId: initialBatchId,
  beekeeperId: 'KVIC-BK-101',
  purityScore: 99.4,
  moisturePercent: 17.2,
  status: 'CERTIFIED'
});

// Additional seed batches for dashboard data
const seedBatches = [
  {
    id: 'HC-MH-2026-00101', hiveId: 'HIVE-BOX-02', beekeeper: 'Sunita Devi', honeyType: 'Raw Pure Mustard Monofloral Honey',
    floralSource: 'Mustard Field (Sundarbans)', harvestDate: '2026-07-15', quantity: 38.5, extractionMethod: 'Stainless Steel Centrifugal Cold Extraction',
    status: 'PACKAGED', qualityTest: { testedAt: '2026-07-17T10:00:00Z', moisturePercent: 16.8, nmrPurityScore: 99.1, hmf: 11.2, c4SugarAdulteration: 'NEGATIVE' },
    processing: { extractionUnit: 'SS Centrifugal Extractor — Unit A', outputQuantity: 37.0 },
    packaging: { jarCount: 74, jarWeight: '500g', sealDate: '2026-07-18' },
    transactions: [
      { date: '2026-07-15T06:00:00.000Z', event: 'Harvest created', actor: 'Beekeeper' },
      { date: '2026-07-16T09:00:00.000Z', event: 'Harvest verified', actor: 'Quality Officer' },
      { date: '2026-07-17T10:00:00.000Z', event: 'Quality test passed', actor: 'Quality Officer' },
      { date: '2026-07-18T08:00:00.000Z', event: 'Packaged (74 jars)', actor: 'Processor' },
    ]
  },
  {
    id: 'HC-MH-2026-00112', hiveId: 'HIVE-BOX-03', beekeeper: 'Ganesh Pawar', honeyType: 'Raw Pure Forest Honey',
    floralSource: 'Mixed Forest (Satara)', harvestDate: '2026-08-02', quantity: 22.0, extractionMethod: 'Manual Crush & Strain',
    status: 'CERTIFIED', qualityTest: { testedAt: '2026-08-04T11:00:00Z', moisturePercent: 18.5, nmrPurityScore: 98.8, hmf: 15.0, c4SugarAdulteration: 'NEGATIVE' },
    transactions: [
      { date: '2026-08-02T06:30:00.000Z', event: 'Harvest created', actor: 'Beekeeper' },
      { date: '2026-08-03T09:00:00.000Z', event: 'Harvest verified', actor: 'Quality Officer' },
      { date: '2026-08-04T11:00:00.000Z', event: 'Quality test passed', actor: 'Quality Officer' },
    ]
  },
  {
    id: 'HC-MH-2026-00118', hiveId: 'HIVE-BOX-05', beekeeper: 'Harpreet Singh', honeyType: 'Raw Pure Mustard Monofloral Honey',
    floralSource: 'Mustard Field (Hoshiarpur)', harvestDate: '2026-08-20', quantity: 52.0, extractionMethod: 'Stainless Steel Centrifugal Cold Extraction',
    status: 'PROCESSED', qualityTest: { testedAt: '2026-08-22T10:00:00Z', moisturePercent: 17.0, nmrPurityScore: 99.3, hmf: 10.5, c4SugarAdulteration: 'NEGATIVE' },
    processing: { extractionUnit: 'SS Centrifugal Extractor — Unit B', outputQuantity: 50.5 },
    transactions: [
      { date: '2026-08-20T05:45:00.000Z', event: 'Harvest created', actor: 'Beekeeper' },
      { date: '2026-08-21T09:00:00.000Z', event: 'Harvest verified', actor: 'Quality Officer' },
      { date: '2026-08-22T10:00:00.000Z', event: 'Quality test passed', actor: 'Quality Officer' },
      { date: '2026-08-23T08:00:00.000Z', event: 'Processing completed', actor: 'Processor' },
    ]
  },
  {
    id: 'HC-MH-2026-00125', hiveId: 'HIVE-BOX-04', beekeeper: 'Ravi Kumar', honeyType: 'Raw Pure Eucalyptus Honey',
    floralSource: 'Eucalyptus Grove (Muzaffarpur)', harvestDate: '2026-09-01', quantity: 31.0, extractionMethod: 'Stainless Steel Centrifugal Cold Extraction',
    status: 'HARVEST_CREATED',
    transactions: [
      { date: '2026-09-01T07:00:00.000Z', event: 'Harvest created', actor: 'Beekeeper' },
    ]
  },
  {
    id: 'HC-MH-2026-00130', hiveId: 'HIVE-BOX-01', beekeeper: 'Rameshwar Verma', honeyType: 'Raw Pure Sunflower Honey',
    floralSource: 'Sunflower Belt (Bihar)', harvestDate: '2026-09-10', quantity: 28.5, extractionMethod: 'Stainless Steel Centrifugal Cold Extraction',
    status: 'HARVEST_VERIFIED',
    transactions: [
      { date: '2026-09-10T06:00:00.000Z', event: 'Harvest created', actor: 'Beekeeper' },
      { date: '2026-09-11T09:00:00.000Z', event: 'Harvest verified', actor: 'Quality Officer' },
    ]
  },
];

seedBatches.forEach(b => {
  b.smartContractValidations = b.smartContractValidations || {};
  b.transactions = b.transactions || [];
  batches[b.id] = b;
  addBlockToChain('BatchCreated', { batchId: b.id, status: b.status });
});

// ===== REST API Endpoints =====

// 1. Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Honey Chain - KVIC Honey Mission Blockchain & IoT Platform',
    blocksCount: blockchain.length,
    activeHives: Object.keys(hives).length,
    batchesCount: Object.keys(batches).length,
    timestamp: new Date().toISOString()
  });
});

// 2. Beekeepers
app.get('/api/beekeepers', (req, res) => {
  res.json({ ok: true, beekeepers: Object.values(beekeepers) });
});

app.post('/api/beekeepers', (req, res) => {
  const { name, aadhaar, krishiId, cluster, state, village, boxesAllocated, species, phone } = req.body;
  const beekeeperId = `KVIC-BK-${100 + Object.keys(beekeepers).length + 1}`;
  const newBeekeeper = {
    id: beekeeperId,
    name: name || 'New Beekeeper',
    aadhaar: aadhaar || 'XXXX-XXXX-0000',
    krishiId: krishiId || `KRISHI-${Date.now().toString().slice(-4)}`,
    cluster: cluster || 'Regional Honey Cluster',
    state: state || 'State',
    village: village || 'Village',
    boxesAllocated: parseInt(boxesAllocated, 10) || 5,
    species: species || 'Apis mellifera',
    phone: phone || '+91-00000-00000',
    joinedDate: new Date().toISOString().split('T')[0],
    verified: true
  };
  beekeepers[beekeeperId] = newBeekeeper;

  addBlockToChain('BeekeeperEnrolled', { beekeeperId, name: newBeekeeper.name, cluster: newBeekeeper.cluster });
  res.json({ ok: true, beekeeper: newBeekeeper });
});

// 3. IoT Hives & Real-Time Monitoring
app.get('/api/iot/hives', (req, res) => {
  res.json({ ok: true, hives: Object.values(hives) });
});

app.get('/api/iot/hives/:hiveId', (req, res) => {
  const hive = hives[req.params.hiveId];
  if (!hive) return res.status(404).json({ ok: false, error: 'Hive not found' });
  res.json({ ok: true, hive });
});

app.post('/api/iot/hives', (req, res) => {
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

app.post('/api/iot/hives/:hiveId/telemetry', (req, res) => {
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

// 4. AI Disease Diagnostic Engine
app.post('/api/ai/diagnose', (req, res) => {
  const { symptomTags = [], acousticFreq, visualObservations = '', broodPattern = 'solid' } = req.body;

  let disease = 'Healthy Colony';
  let riskLevel = 'LOW';
  let confidence = 96.5;
  let treatment = 'Continue normal seasonal feeding and supers inspection.';
  const detectedBiomarkers = [];

  const lowerObs = (visualObservations + ' ' + symptomTags.join(' ')).toLowerCase();

  if (lowerObs.includes('mite') || lowerObs.includes('spot') || lowerObs.includes('deformed wing')) {
    disease = 'Varroa Mite Infestation (Varroosis)';
    riskLevel = 'HIGH';
    confidence = 94.8;
    treatment = 'Apply organic Formic Acid / Thymol pads or Oxalic Acid sublimation immediately. Screen bottom board monitoring.';
    detectedBiomarkers.push('Visible ectoparasitic mites on adult worker thorax', 'Deformed Wing Virus (DWV) symptom match');
  } else if (lowerObs.includes('foul') || lowerObs.includes('sunken') || lowerObs.includes('slimy') || lowerObs.includes('sulfur')) {
    disease = 'American / European Foulbrood (AFB/EFB)';
    riskLevel = 'CRITICAL';
    confidence = 91.2;
    treatment = 'Isolate hive immediately. Notify KVIC cluster apiary officer. Organic antibiotic protocol or comb shook-swarm procedure.';
    detectedBiomarkers.push('Sunken perforated cappings', 'Ropy brown larval residue');
  } else if (lowerObs.includes('chalk') || lowerObs.includes('mummy') || lowerObs.includes('white hard')) {
    disease = 'Chalkbrood (Ascosphaera apis fungal infection)';
    riskLevel = 'MEDIUM';
    confidence = 89.0;
    treatment = 'Improve hive ventilation, reduce internal moisture, requeen with hygienic bee stock.';
    detectedBiomarkers.push('Mummified calcified larvae in cells and entrance');
  } else if (acousticFreq && parseFloat(acousticFreq) > 420) {
    disease = 'Swarming Frenzy (Pre-Swarm Queen Piping)';
    riskLevel = 'HIGH';
    confidence = 95.3;
    treatment = 'Perform artificial hive split (colony division) and install new super box to prevent loss of flying bees.';
    detectedBiomarkers.push('Acoustic spike in 420-500 Hz vibration spectrum');
  }

  res.json({
    ok: true,
    diagnosis: {
      disease,
      riskLevel,
      confidence,
      treatment,
      detectedBiomarkers,
      diagnosedAt: new Date().toISOString()
    }
  });
});

// 5. AI Honey Yield & Harvest Forecast
app.post('/api/ai/predict-yield', (req, res) => {
  const { floralSource, hiveCount = 10, season = 'Peak Bloom', colonyStrength = 8.5 } = req.body;
  
  let baseYieldPerHive = 12.0; // kg
  if (floralSource?.toLowerCase().includes('litchi')) baseYieldPerHive = 15.5;
  else if (floralSource?.toLowerCase().includes('mustard')) baseYieldPerHive = 18.0;
  else if (floralSource?.toLowerCase().includes('mangrove') || floralSource?.toLowerCase().includes('sundarbans')) baseYieldPerHive = 22.0;
  else if (floralSource?.toLowerCase().includes('acacia')) baseYieldPerHive = 14.0;
  else if (floralSource?.toLowerCase().includes('sidr')) baseYieldPerHive = 16.5;

  const strengthFactor = (parseFloat(colonyStrength) || 8.0) / 10.0;
  const count = parseInt(hiveCount, 10) || 10;
  const predictedTotalKg = Math.round(count * baseYieldPerHive * strengthFactor * 10) / 10;
  const estimatedRevenueInr = Math.round(predictedTotalKg * 450); // Avg raw pure honey rate Rs. 450/kg

  res.json({
    ok: true,
    forecast: {
      floralSource: floralSource || 'Forest Multifloral',
      hiveCount: count,
      predictedTotalKg,
      yieldPerHiveKg: Math.round((predictedTotalKg / count) * 10) / 10,
      estimatedRevenueInr,
      optimalHarvestWindow: 'Next 10-14 days during peak nectar flow',
      foragingFlightEfficiency: '92% (High Pollen Flow)'
    }
  });
});

// 6. Honey Harvest Event & Batch Creation
app.post('/api/harvest-event', (req, res) => {
  const {
    hiveId,
    beekeeperId,
    floralSource,
    quantityKg,
    latitude,
    longitude,
    extractionMethod,
    batchName
  } = req.body;

  const batchId = `HONEY-BATCH-${new Date().getFullYear()}-${uuidv4().slice(0, 6).toUpperCase()}`;
  const beekeeper = beekeepers[beekeeperId] || sampleBeekeepers[0];
  const hive = hives[hiveId] || sampleHives[0];

  const newBatch = {
    batchId,
    batchName: batchName || `${floralSource || 'Raw'} Artisan Honey Batch`,
    hiveId: hive.hiveId,
    beekeeperId: beekeeper.id,
    beekeeperName: beekeeper.name,
    floralSource: floralSource || hive.floralSource || 'Raw Forest Multifloral',
    harvestDate: new Date().toISOString().split('T')[0],
    quantityKg: parseFloat(quantityKg) || 25.0,
    gpsLocation: {
      lat: parseFloat(latitude) || hive.coordinates.lat,
      lon: parseFloat(longitude) || hive.coordinates.lon
    },
    extractionMethod: extractionMethod || 'Cold Centrifugal Extraction (Raw & Unheated)',
    status: 'HARVESTED',
    qualityTest: null,
    processingSteps: [
      {
        step: 'Harvest & Extraction',
        date: new Date().toISOString().split('T')[0],
        notes: `Extracted from ${hive.boxNumber} under KVIC Honey Mission guidelines`
      }
    ],
    smartContractValidations: {
      geoFenceValidation: 'PASS (Verified within registered KVIC Apiary radius)',
      moistureValidation: 'PENDING LAB TEST',
      nmrPurityValidation: 'PENDING LAB TEST'
    }
  };

  batches[batchId] = newBatch;

  // Add harvest event block
  const block = addBlockToChain('HarvestEvent', {
    batchId,
    beekeeperId: newBatch.beekeeperId,
    quantityKg: newBatch.quantityKg,
    floralSource: newBatch.floralSource,
    gpsLocation: newBatch.gpsLocation
  });

  res.json({ ok: true, batch: newBatch, block });
});

// 7. Lab Quality Test & Smart Contract Gateways
app.post('/api/quality-test', (req, res) => {
  const {
    batchId,
    labName,
    moisturePercent,
    nmrPurityScore,
    c4SugarAdulteration,
    hmf,
    pollenDominance,
    antibioticResidues,
  } = req.body;

  const batch = batches[batchId];
  if (!batch) return res.status(404).json({ ok: false, error: 'Batch not found' });

  const moisture = parseFloat(moisturePercent) || 18.0;
  const nmrScore = parseFloat(nmrPurityScore) || 99.2;
  const hmfVal = parseFloat(hmf) || 14.0;
  const isC4Negative = (c4SugarAdulteration || 'NEGATIVE').toUpperCase().includes('NEGATIVE') || c4SugarAdulteration === false;

  // Smart contract rules: FSSAI standard (Moisture <= 20%, NMR >= 98%, C4 Sugar NEGATIVE)
  const moisturePass = moisture <= 20.0;
  const nmrPass = nmrScore >= 98.0;
  const hmfPass = hmfVal < 40.0;
  const overallPass = moisturePass && nmrPass && isC4Negative && hmfPass;

  batch.qualityTest = {
    testedAt: new Date().toISOString(),
    labName: labName || 'National Bee Board Referral & FSSAI Accredited Honey Lab',
    moisturePercent: moisture,
    nmrPurityScore: nmrScore,
    hmf: hmfVal,
    c4SugarAdulteration: isC4Negative ? 'NEGATIVE (< 1.0% C4 Sugar)' : 'POSITIVE (ADULTERATED)',
    c3SugarAdulteration: 'NEGATIVE',
    pollenDominance: pollenDominance || `${batch.honeyType || 'Multifloral'} Pollen Grains`,
    antibioticResidues: antibioticResidues || 'NOT DETECTED (0.0 ppm)',
    fssaiCompliance: overallPass ? 'PASSED (FSSAI Reg. 2.8.2 / AGMARK Grade A)' : 'FAILED (Non-compliant)'
  };

  batch.smartContractValidations = batch.smartContractValidations || {};
  batch.smartContractValidations.moistureValidation = moisturePass
    ? `PASS (${moisture}% <= 20.0%)`
    : `FAIL (${moisture}% > 20.0% Fermentation Risk)`;
  batch.smartContractValidations.nmrPurityValidation = nmrPass
    ? `PASS (${nmrScore}% >= 98.0%)`
    : `FAIL (${nmrScore}% < 98.0%)`;
  batch.smartContractValidations.adulterationValidation = isC4Negative
    ? 'PASS (100% Pure Raw Honey)'
    : 'FAIL (C4 Foreign Sugar Detected)';
  batch.smartContractValidations.hmfValidation = hmfPass
    ? `PASS (${hmfVal} mg/kg < 40 mg/kg)`
    : `FAIL (${hmfVal} mg/kg >= 40 mg/kg)`;

  batch.status = overallPass ? 'CERTIFIED' : 'REJECTED';

  // Add quality block
  const block = addBlockToChain('QualityCertification', {
    batchId,
    moisturePercent: moisture,
    nmrPurityScore: nmrScore,
    hmf: hmfVal,
    overallPass,
    status: batch.status
  });

  res.json({ ok: true, batch, block });
});

// 8. Processing & Packaging Step
app.post('/api/processing-step', (req, res) => {
  const { batchId, step, notes } = req.body;
  const batch = batches[batchId];
  if (!batch) return res.status(404).json({ ok: false, error: 'Batch not found' });

  const newStep = {
    step: step || 'Processing / Filtration',
    date: new Date().toISOString().split('T')[0],
    notes: notes || 'Raw unheated processing compliant with KVIC purity norms'
  };
  batch.processingSteps.push(newStep);

  if (step?.toLowerCase().includes('packag') || step?.toLowerCase().includes('bottl')) {
    if (batch.status === 'CERTIFIED') batch.status = 'PACKAGED';
  }

  const block = addBlockToChain('ProcessingStep', { batchId, step: newStep.step });
  res.json({ ok: true, batch, block });
});

// 9. QR Code Endpoint (Returns Data URL & Verification URL)
app.get('/api/qr/:batchId', async (req, res) => {
  const batchId = req.params.batchId;
  const batch = batches[batchId];
  if (!batch) return res.status(404).json({ ok: false, error: 'Batch not found' });

  // Direct consumer verification link — use ngrok for external access
  const verificationUrl = `https://certified-overfaintly-vivian.ngrok-free.dev/#verify/${encodeURIComponent(batchId)}`;
  try {
    const dataUrl = await QRCode.toDataURL(verificationUrl, {
      color: {
        dark: '#B45309', // Amber-700
        light: '#FFFFFF'
      },
      width: 320,
      margin: 2
    });
    res.json({ ok: true, batchId, dataUrl, verificationUrl });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 10. Consumer Provenance View (Full Graph & FHIR/GS1 Traceability)
app.get('/api/provenance/:batchId', (req, res) => {
  const batchId = req.params.batchId;
  const batch = batches[batchId];
  if (!batch) return res.status(404).json({ ok: false, error: 'Batch not found' });

  const beekeeper = beekeepers[batch.beekeeperId] || {};
  const hive = hives[batch.hiveId] || {};

  // Find all blockchain blocks linked to this batch
  const linkedBlocks = blockchain.filter(
    b => b.data && (b.data.payload?.batchId === batchId || b.data.payload?.beekeeperId === batch.beekeeperId)
  );

  const provenanceBundle = {
    resourceType: 'HoneyTraceabilityBundle',
    id: batchId,
    batchName: batch.batchName,
    floralSource: batch.floralSource,
    harvestDate: batch.harvestDate,
    status: batch.status,
    origin: {
      beekeeperName: batch.beekeeperName,
      aadhaarMasked: beekeeper.aadhaar || 'XXXX-XXXX-8912',
      krishiId: beekeeper.krishiId || 'KVIC-KRISHI-001',
      cluster: beekeeper.cluster || 'KVIC Apiary Cluster',
      state: beekeeper.state || 'India',
      village: beekeeper.village || 'Apiary Farm',
      hiveBoxNumber: hive.boxNumber || 'KVIC-BOX-01',
      gpsLocation: batch.gpsLocation
    },
    qualityCertificates: batch.qualityTest,
    smartContractValidations: batch.smartContractValidations,
    journeyTimeline: batch.processingSteps,
    blockchainProof: {
      blocksCount: linkedBlocks.length,
      latestHash: linkedBlocks.length > 0 ? linkedBlocks[linkedBlocks.length - 1].hash : blockchain[blockchain.length - 1].hash,
      merkleRoot: '0x' + crypto.createHash('sha256').update(batchId + JSON.stringify(batch.qualityTest)).digest('hex')
    }
  };

  res.json({ ok: true, provenance: provenanceBundle });
});

// 11. Blockchain Ledger Explorer
app.get('/api/ledger', (req, res) => {
  res.json({
    ok: true,
    chainLength: blockchain.length,
    blockchain
  });
});

// 12. KVIC Cluster Aggregated Analytics
app.get('/api/kvic/dashboard', (req, res) => {
  const allBatches = Object.values(batches);
  const totalHarvestKg = allBatches.reduce((sum, b) => sum + (b.quantityKg || 0), 0);
  const certifiedCount = allBatches.filter(b => b.status === 'CERTIFIED' || b.status === 'PACKAGED').length;

  res.json({
    ok: true,
    stats: {
      totalBeekeepers: Object.keys(beekeepers).length,
      totalBoxesDistributed: Object.values(beekeepers).reduce((sum, bk) => sum + (bk.boxesAllocated || 0), 0),
      activeSmartHives: Object.keys(hives).length,
      totalHoneyHarvestedKg: totalHarvestKg,
      certifiedPurityBatches: certifiedCount,
      adulterationFailures: allBatches.filter(b => b.status === 'REJECTED').length,
      avgNMRPurityScore: '99.3%',
      avgMoistureContent: '17.4%',
      ruralRevenueGeneratedInr: Math.round(totalHarvestKg * 450)
    }
  });
});

// ==========================================
// ROLE-BASED PROTOTYPE ENDPOINTS
// ==========================================

// Mock Authentication
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  let role = '';
  let name = '';

  if (email === 'admin@honeychain.demo') { role = 'ADMIN'; name = 'Admin User'; }
  else if (email === 'beekeeper@honeychain.demo') { role = 'BEEKEEPER'; name = 'Rameshwar Verma'; }
  else if (email === 'officer@honeychain.demo') { role = 'QUALITY_OFFICER'; name = 'Dr. Sharma'; }
  else if (email === 'processor@honeychain.demo') { role = 'PROCESSOR'; name = 'Satara Processing Unit'; }
  else return res.status(401).json({ ok: false, error: 'Invalid mock credentials' });

  res.json({ ok: true, user: { email, role, name } });
});

// Users Management
app.get('/api/users', (req, res) => {
  res.json({ ok: true, users: Object.values(users) });
});

app.post('/api/users', (req, res) => {
  const { name, email, role, cluster } = req.body;
  if (!name || !email || !role) return res.status(400).json({ ok: false, error: 'Name, email and role required' });
  const id = 'U' + String(Object.keys(users).length + 1).padStart(3, '0');
  const user = { id, name, email, role, cluster: cluster || '—', status: 'Invited', joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) };
  users[id] = user;
  res.json({ ok: true, user });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  if (!users[id]) return res.status(404).json({ ok: false, error: 'User not found' });
  if (users[id].role === 'ADMIN' && Object.values(users).filter(u => u.role === 'ADMIN').length <= 1) {
    return res.status(400).json({ ok: false, error: 'Cannot remove the last admin' });
  }
  delete users[id];
  res.json({ ok: true });
});

// Create Batch (Beekeeper)
app.post('/api/batches', (req, res) => {
  const { hiveId, honeyType, extractionMethod, quantity, harvestDate, moisture, floralSource, notes, beekeeper } = req.body;
  const batchId = `HC-MH-2026-00${Math.floor(100 + Math.random() * 900)}`;
  
  batches[batchId] = {
    id: batchId,
    hiveId,
    beekeeper: beekeeper || 'KVIC-BK-101',
    honeyType,
    extractionMethod: extractionMethod || 'Centrifugal Cold Extraction',
    quantity,
    moisture: moisture || null,
    floralSource: floralSource || '',
    notes: notes || '',
    harvestDate: harvestDate || new Date().toISOString(),
    status: 'HARVEST_CREATED',
    transactions: [
      { date: new Date().toISOString(), event: 'Harvest created', actor: beekeeper || 'Beekeeper' }
    ]
  };

  addBlockToChain('HARVEST_CREATED', batches[batchId]);
  res.json({ ok: true, batch: batches[batchId] });
});

// Get all batches
app.get('/api/batches', (req, res) => {
  res.json({ ok: true, batches: Object.values(batches) });
});

// Verify Harvest (Quality Officer)
app.post('/api/batches/:id/verify', (req, res) => {
  const batch = batches[req.params.id];
  if (!batch) return res.status(404).json({ ok: false });
  
  batch.status = 'HARVEST_VERIFIED';
  batch.transactions.push({ date: new Date().toISOString(), event: 'Harvest verified', actor: 'Quality Officer' });
  addBlockToChain('HARVEST_VERIFIED', batch);
  
  res.json({ ok: true, batch });
});

// Submit Quality (Quality Officer)
app.post('/api/batches/:id/quality', (req, res) => {
  const batch = batches[req.params.id];
  if (!batch) return res.status(404).json({ ok: false });
  
  batch.status = 'QUALITY_VERIFIED';
  batch.quality = req.body;
  batch.transactions.push({ date: new Date().toISOString(), event: 'Quality test passed', actor: 'Quality Officer' });
  addBlockToChain('QUALITY_VERIFIED', batch);
  
  res.json({ ok: true, batch });
});

// Process Batch (Processor)
app.post('/api/batches/:id/process', (req, res) => {
  const batch = batches[req.params.id];
  if (!batch) return res.status(404).json({ ok: false });
  
  batch.status = 'PROCESSED';
  batch.processing = req.body;
  batch.transactions.push({ date: new Date().toISOString(), event: 'Processing completed', actor: 'Processor' });
  addBlockToChain('PROCESSED', batch);
  
  res.json({ ok: true, batch });
});

// Package Batch & Generate QR (Processor)
app.post('/api/batches/:id/package', async (req, res) => {
  const batch = batches[req.params.id];
  if (!batch) return res.status(404).json({ ok: false });
  
  batch.status = 'PACKAGED';
  batch.transactions.push({ date: new Date().toISOString(), event: 'Package registered', actor: 'Processor' });
  batch.transactions.push({ date: new Date().toISOString(), event: 'QR generated', actor: 'System' });
  
  addBlockToChain('PACKAGED', batch);
  
  res.json({ ok: true, batch });
});

// 13. Consumer Report / Counterfeit Flag
const reports = [];
app.post('/api/reports', (req, res) => {
  const { batchId, reason, description, reporterName, reporterContact } = req.body;
  const report = {
    id: `RPT-${Date.now()}`,
    batchId: batchId || 'UNKNOWN',
    reason: reason || 'Suspected counterfeit',
    description: description || '',
    reporterName: reporterName || 'Anonymous',
    reporterContact: reporterContact || '',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
  reports.push(report);
  addBlockToChain('COUNTERFEIT_REPORT', { reportId: report.id, batchId: report.batchId, reason: report.reason });
  res.json({ ok: true, report });
});

app.get('/api/reports', (req, res) => {
  res.json({ ok: true, reports });
});

// Serve React frontend build
const frontendBuild = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(frontendBuild));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuild, 'index.html'));
});

// Start Server
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`🍯 Honey Chain Backend API listening on http://localhost:${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Port ${port} is already in use by another process. Please free port ${port} or specify PORT=<another_port>.`);
  } else {
    console.error('Server error:', err);
  }
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Honey Chain Server closed gracefully');
  });
});

// ===== Quality Standards & Thresholds =====
let qualityStandards = {
  fssai: { label: 'FSSAI', version: '2.8.2', moistureMax: 20.0, nmrPurityMin: 98.0, c4SugarMax: 7.0, hmfMax: 40.0, antibioticMax: 0.0, description: 'Food Safety and Standards Authority of India - Honey Standard' },
  agmark: { label: 'AGMARK Grade A', version: '2024', moistureMax: 20.0, nmrPurityMin: 98.0, c4SugarMax: 5.0, hmfMax: 40.0, antibioticMax: 0.0, description: 'Agricultural Marketing Department - Grade A Honey Certification' },
  nices: { label: 'NICES Organic', version: '2023', moistureMax: 18.0, nmrPurityMin: 99.0, c4SugarMax: 3.0, hmfMax: 30.0, antibioticMax: 0.0, description: 'National Programme for Organic Production - Organic Honey Standard' },
  eu: { label: 'EU Codex', version: 'Codex Alimentarius', moistureMax: 20.0, nmrPurityMin: 98.0, c4SugarMax: 7.0, hmfMax: 40.0, antibioticMax: 0.0, description: 'Codex Alimentarius International Standard for Honey (CXS 12-1981)' },
  internal: { label: 'Internal QC', version: 'HC-2026', moistureMax: 18.0, nmrPurityMin: 99.0, c4SugarMax: 5.0, hmfMax: 35.0, antibioticMax: 0.0, description: 'Honey Chain internal quality control - stricter than FSSAI minimums' },
};

app.get('/api/quality/standards', (req, res) => {
  res.json({ ok: true, standards: qualityStandards });
});

app.post('/api/quality/standards', (req, res) => {
  const { key, ...updates } = req.body;
  if (!key || !qualityStandards[key]) return res.status(400).json({ ok: false, error: 'Invalid standard key' });
  qualityStandards[key] = { ...qualityStandards[key], ...updates };
  res.json({ ok: true, standard: qualityStandards[key] });
});

// ===== Quality Trends & Analytics =====
app.get('/api/quality/trends', (req, res) => {
  const allBatches = Object.values(batches);
  const tested = allBatches.filter(b => b.qualityTest || b.quality);

  const byMonth = {};
  const byCluster = {};
  const bySeason = {};
  let totalPass = 0, totalFail = 0;

  tested.forEach(batch => {
    const qt = batch.qualityTest || batch.quality || {};
    const d = batch.harvestDate || qt.testedAt || new Date().toISOString();
    const month = d.slice(0, 7);
    const cluster = batch.hiveId ? batch.hiveId.replace(/-\d+$/, '') : 'Unknown';
    const monthNum = parseInt(d.slice(5, 7));
    const season = monthNum >= 3 && monthNum <= 5 ? 'Spring' : monthNum >= 6 && monthNum <= 9 ? 'Monsoon' : 'Winter';

    if (!byMonth[month]) byMonth[month] = { pass: 0, fail: 0, avgPurity: [], avgMoisture: [] };
    if (!byCluster[cluster]) byCluster[cluster] = { pass: 0, fail: 0, total: 0, avgPurity: [] };
    if (!bySeason[season]) bySeason[season] = { pass: 0, fail: 0, total: 0 };

    const purity = parseFloat(qt.nmrPurityScore || qt.purity) || 0;
    const moisture = parseFloat(qt.moisturePercent || qt.moisture) || 0;
    const pass = batch.status !== 'REJECTED';

    if (pass) { totalPass++; byMonth[month].pass++; byCluster[cluster].pass++; bySeason[season].pass++; }
    else { totalFail++; byMonth[month].fail++; byCluster[cluster].fail++; bySeason[season].fail++; }

    if (purity > 0) { byMonth[month].avgPurity.push(purity); byCluster[cluster].avgPurity.push(purity); }
    if (moisture > 0) byMonth[month].avgMoisture.push(moisture);
    byCluster[cluster].total++;
    bySeason[season].total++;
  });

  const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0;

  const trends = {
    summary: { total: tested.length, pass: totalPass, fail: totalFail, passRate: tested.length ? ((totalPass / tested.length) * 100).toFixed(1) : 0 },
    byMonth: Object.entries(byMonth).sort((a, b) => a[0].localeCompare(b[0])).map(([m, v]) => ({ month: m, pass: v.pass, fail: v.fail, avgPurity: avg(v.avgPurity), avgMoisture: avg(v.avgMoisture) })),
    byCluster: Object.entries(byCluster).map(([c, v]) => ({ cluster: c, pass: v.pass, fail: v.fail, total: v.total, avgPurity: avg(v.avgPurity), passRate: v.total ? ((v.pass / v.total) * 100).toFixed(1) : 0 })),
    bySeason: Object.entries(bySeason).map(([s, v]) => ({ season: s, pass: v.pass, fail: v.fail, total: v.total, passRate: v.total ? ((v.pass / v.total) * 100).toFixed(1) : 0 })),
  };

  res.json({ ok: true, trends });
});

// ===== Rejected Batches =====
app.get('/api/quality/rejected', (req, res) => {
  const rejected = Object.values(batches).filter(b => b.status === 'REJECTED');
  const withReasons = rejected.map(b => {
    const reasons = [];
    const qt = b.qualityTest || b.quality || {};
    const moisture = parseFloat(qt.moisturePercent || qt.moisture) || 0;
    const purity = parseFloat(qt.nmrPurityScore || qt.purity) || 0;
    const c4 = (qt.c4SugarAdulteration || '').toUpperCase();
    const hmf = parseFloat(qt.hmf) || 0;

    if (moisture > 20.0) reasons.push({ param: 'Moisture', value: moisture + '%', threshold: '<= 20.0%', severity: 'critical' });
    if (purity > 0 && purity < 98.0) reasons.push({ param: 'NMR Purity', value: purity + '%', threshold: '>= 98.0%', severity: 'critical' });
    if (c4.includes('POSITIVE') || c4.includes('ADULTERATED')) reasons.push({ param: 'C4 Sugar', value: c4, threshold: 'NEGATIVE (< 7.0%)', severity: 'critical' });
    if (hmf > 40) reasons.push({ param: 'HMF Level', value: hmf + ' mg/kg', threshold: '< 40 mg/kg', severity: 'warning' });

    if (reasons.length === 0) reasons.push({ param: 'General', value: 'Failed QC', threshold: 'All criteria must pass', severity: 'critical' });

    return { ...b, rejectionReasons: reasons };
  });

  res.json({ ok: true, batches: withReasons });
});

// ===== Quality History (all tested batches) =====
app.get('/api/quality/history', (req, res) => {
  const allBatches = Object.values(batches);
  const tested = allBatches
    .filter(b => b.qualityTest || b.quality)
    .map(b => {
      const qt = b.qualityTest || b.quality || {};
      return {
        batchId: b.id,
        hiveId: b.hiveId,
        beekeeper: b.beekeeper || 'Unknown',
        honeyType: b.honeyType,
        moisture: parseFloat(qt.moisturePercent || qt.moisture) || null,
        purity: parseFloat(qt.nmrPurityScore || qt.purity) || null,
        hmf: parseFloat(qt.hmf) || null,
        c4Sugar: qt.c4SugarAdulteration || null,
        result: b.status === 'REJECTED' ? 'FAIL' : 'PASS',
        testedBy: qt.labName || 'Lab Officer',
        date: qt.testedAt || b.harvestDate || 'Unknown',
        status: b.status,
      };
    })
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  res.json({ ok: true, history: tested });
});

// ===== Processor: Dispatch / Inventory / Facility =====
app.post('/api/batches/:id/dispatch', (req, res) => {
  const batch = batches[req.params.id];
  if (!batch) return res.status(404).json({ ok: false, error: 'Batch not found' });

  const { logisticsPartner, destination, dispatchDate, jarCount, trackingId } = req.body;
  batch.status = 'DISPATCHED';
  batch.dispatch = {
    logisticsPartner: logisticsPartner || 'BlueDart Cold Chain',
    destination: destination || 'Mumbai Retail Hub',
    dispatchDate: dispatchDate || new Date().toISOString(),
    jarCount: jarCount || 0,
    trackingId: trackingId || 'TRK-' + Date.now(),
  };
  batch.transactions.push({ date: new Date().toISOString(), event: 'Dispatched to ' + (logisticsPartner || 'logistics'), actor: 'Processor' });
  addBlockToChain('DISPATCHED', { batchId: batch.id, logisticsPartner, destination, trackingId: batch.dispatch.trackingId });
  res.json({ ok: true, batch });
});

app.get('/api/inventory', (req, res) => {
  const inventory = Object.values(batches)
    .filter(b => ['PACKAGED', 'DISPATCHED'].includes(b.status))
    .map(b => ({
      id: b.id,
      hiveId: b.hiveId,
      honeyType: b.honeyType,
      quantity: b.quantity,
      status: b.status,
      processing: b.processing || null,
      packaging: b.packaging || null,
      dispatch: b.dispatch || null,
      beekeeper: b.beekeeper || 'Unknown',
      createdAt: b.transactions?.[0]?.date || null,
    }))
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  res.json({ ok: true, inventory });
});

const processingFacility = {
  id: 'PU-MAH-001',
  name: 'Satara Honey Processing Unit',
  type: 'Cold Extraction & Packaging Facility',
  address: 'Plot 12, Agro-Industrial Area, Satara, Maharashtra 415001',
  gps: '17.6866°N, 73.9936°E',
  capacity: '500 kg/day',
  certifications: ['FSSAI License #MH-12345678', 'AGMARK Grade A', 'ISO 22000:2018', 'Organic NPOP (Applied)'],
  equipment: [
    { name: 'Stainless Steel Centrifugal Extractor', capacity: '100 kg/batch', status: 'Operational', lastServiced: '2026-08-15' },
    { name: 'Settling Tank (SS304)', capacity: '200L', status: 'Operational', lastServiced: '2026-08-20' },
    { name: 'Micro-Filter System (200 micron)', capacity: '300 kg/hr', status: 'Operational', lastServiced: '2026-07-30' },
    { name: '自动 Filling & Capping Machine', capacity: '60 jars/min', status: 'Operational', lastServiced: '2026-09-01' },
    { name: 'QR Code Labeling Unit', capacity: '80 labels/min', status: 'Operational', lastServiced: '2026-09-05' },
    { name: 'Cold Storage Room', capacity: '5000 kg', status: 'Active, 18°C', lastServiced: '2026-09-10' },
  ],
  blockchainNode: {
    network: 'Polygon Mainnet',
    nodeEndpoint: 'https://polygon-rpc.com',
    contractAddress: '0x7a3B...4f2E',
    lastSync: new Date().toISOString(),
    blocksAnchored: Object.keys(batches).length + 10,
  },
  operators: [
    { name: 'Suresh Patil', role: 'Plant Manager', badge: 'PU-OPS-001' },
    { name: 'Anita Jadhav', role: 'Quality Controller', badge: 'PU-OPS-002' },
    { name: 'Vikram Deshmukh', role: 'Machine Operator', badge: 'PU-OPS-003' },
  ],
};

app.get('/api/facility', (req, res) => {
  processingFacility.blockchainNode.lastSync = new Date().toISOString();
  processingFacility.blockchainNode.blocksAnchored = blockchain.length;
  res.json({ ok: true, facility: processingFacility });
});

// ===== Packaging endpoint =====
app.post('/api/batches/:id/packaging', (req, res) => {
  const batch = batches[req.params.id];
  if (!batch) return res.status(404).json({ ok: false, error: 'Batch not found' });

  const { packagedBatchId, jarCount, jarWeight, sealDate, bestBefore, packagingType } = req.body;
  batch.status = 'PACKAGED';
  batch.packaging = {
    packagedBatchId: packagedBatchId || 'PKG-' + batch.id,
    jarCount: jarCount || 0,
    jarWeight: jarWeight || '500g',
    sealDate: sealDate || new Date().toISOString(),
    bestBefore: bestBefore || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    packagingType: packagingType || 'Glass Jar with Tamper-Evident Seal',
  };
  batch.transactions.push({ date: new Date().toISOString(), event: 'Packaged (' + (jarCount || 0) + ' jars)', actor: 'Processor' });
  addBlockToChain('PACKAGED', { batchId: batch.id, jarCount, sealDate: batch.packaging.sealDate });
  res.json({ ok: true, batch });
});
