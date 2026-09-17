const { addBlockToChain } = require('./blockchain');
const { seedUsers, sampleBeekeepers, sampleHives, initialBatch, seedBatches, qualityStandards, processingFacility } = require('./data/seedData');

// In-memory stores used by every route handler
const batches = {}; // batchId -> HoneyBatch details
const hives = {}; // hiveId -> HiveDetails + real-time IoT metrics
const beekeepers = {}; // beekeeperId -> details
const users = {}; // userId -> user details
const reports = [];

// Populate the stores from seed data and record the corresponding chain blocks
function initStore() {
  seedUsers.forEach(u => { users[u.id] = u; });

  sampleBeekeepers.forEach(bk => { beekeepers[bk.id] = bk; });

  sampleHives.forEach(h => { hives[h.hiveId] = h; });

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