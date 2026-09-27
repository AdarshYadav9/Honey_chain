const { addBlockToChain } = require('./blockchain');
const { seedUsers, sampleBeekeepers, sampleHives, initialBatch, seedBatches, qualityStandards, processingFacility } = require('./data/seedData');

// In-memory stores used by every route handler
const batches = {}; // batchId -> HoneyBatch details
const hives = {}; // hiveId -> HiveDetails + real-time IoT metrics
const beekeepers = {}; // beekeeperId -> details
const users = {}; // userId -> user details
const reports = [];

// Fill in the IoT metadata every dashboard panel expects, so seeded and
// newly registered hives render in exactly the same format.
function normalizeHive(hive, idx = 0) {
  const coords = hive.coordinates || hive.gps || null;
  hive.gps = hive.gps || coords;
  hive.cluster = hive.cluster || (hive.location ? hive.location.split(',').pop().trim() : 'Unclustered');
  hive.powerSource = hive.powerSource || 'Solar-assisted';
  hive.firmwareVersion = hive.firmwareVersion || 'v2.3.1';
  hive.calibrationDue = hive.calibrationDue || ['02 Jan 2027', '18 Nov 2026', '09 Feb 2027', '14 Mar 2027'][idx % 4];
  hive.weather = hive.weather || 'Live feed connected';
  hive.healthScore = hive.healthScore || (hive.colonyHealth === 'WARNING' ? 64 : 84 + ((idx * 3) % 13));
  hive.swarmRisk = hive.swarmRisk || (hive.colonyHealth === 'WARNING' ? 'Medium' : 'Low');
  hive.diseaseRisk = hive.diseaseRisk || { varroa: 6, foulbrood: 2, nosema: 4 };
  hive.yieldForecastKg = hive.yieldForecastKg || Math.round((24 + idx * 3.5) * 10) / 10;
  hive.alertSeverity = hive.alertSeverity || ((hive.alerts && hive.alerts.length) ? 'medium' : 'none');
  hive.approvalStatus = hive.approvalStatus || 'APPROVED';
  hive.telemetry = hive.telemetry || null;
  return hive;
}

// Populate the stores from seed data and record the corresponding chain blocks
function initStore() {
  seedUsers.forEach(u => { users[u.id] = u; });

  sampleBeekeepers.forEach(bk => { beekeepers[bk.id] = bk; });

  sampleHives.forEach(h => { hives[h.hiveId] = normalizeHive(h); });

  batches[initialBatch.id] = initialBatch;

  // Record initial certified batch on blockchain
  addBlockToChain('BatchCertification', {
    batchId: initialBatch.id,
    beekeeperId: 'KVIC-BK-101',
    purityScore: initialBatch.qualityTest.nmrPurityScore,
    moisturePercent: initialBatch.qualityTest.moisturePercent,
    status: initialBatch.status
  });

  seedBatches.forEach(b => {
    b.smartContractValidations = b.smartContractValidations || {};
    b.transactions = b.transactions || [];
    batches[b.id] = b;
    addBlockToChain('BatchCreated', { batchId: b.id, status: b.status });
  });
}

initStore();

module.exports = { batches, hives, beekeepers, users, reports, qualityStandards, processingFacility };