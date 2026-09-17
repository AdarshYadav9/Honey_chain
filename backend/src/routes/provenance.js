const { Router } = require('express');
const crypto = require('crypto');
const { batches, hives, beekeepers } = require('../store');
const { blockchain } = require('../blockchain');
const router = Router();

// Consumer Provenance View (Full Graph & FHIR/GS1 Traceability)
router.get('/:batchId', (req, res) => {
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

module.exports = router;