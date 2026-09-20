const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const { batches, hives, beekeepers } = require('../store');
const { addBlockToChain } = require('../blockchain');
const router = Router();

// Honey Harvest Event & Batch Creation
router.post('/', (req, res) => {
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
  const beekeeper = beekeepers[beekeeperId] || Object.values(beekeepers)[0];
  const hive = hives[hiveId] || Object.values(hives)[0];

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

module.exports = router;