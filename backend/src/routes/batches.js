const { Router } = require('express');
const { batches } = require('../store');
const { addBlockToChain } = require('../blockchain');
const router = Router();

// Create Batch (Beekeeper)
router.post('/', (req, res) => {
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
router.get('/', (req, res) => {
  res.json({ ok: true, batches: Object.values(batches) });
});

// Verify Harvest (Quality Officer)
router.post('/:id/verify', (req, res) => {
  const batch = batches[req.params.id];
  if (!batch) return res.status(404).json({ ok: false });

  batch.status = 'HARVEST_VERIFIED';
  batch.transactions.push({ date: new Date().toISOString(), event: 'Harvest verified', actor: 'Quality Officer' });
  addBlockToChain('HARVEST_VERIFIED', batch);

  res.json({ ok: true, batch });
});

// Submit Quality (Quality Officer)
router.post('/:id/quality', (req, res) => {
  const batch = batches[req.params.id];
  if (!batch) return res.status(404).json({ ok: false });

  batch.status = 'QUALITY_VERIFIED';
  batch.quality = req.body;
  batch.transactions.push({ date: new Date().toISOString(), event: 'Quality test passed', actor: 'Quality Officer' });
  addBlockToChain('QUALITY_VERIFIED', batch);

  res.json({ ok: true, batch });
});

// Process Batch (Processor)
router.post('/:id/process', (req, res) => {
  const batch = batches[req.params.id];
  if (!batch) return res.status(404).json({ ok: false });

  batch.status = 'PROCESSED';
  batch.processing = req.body;
  batch.transactions.push({ date: new Date().toISOString(), event: 'Processing completed', actor: 'Processor' });
  addBlockToChain('PROCESSED', batch);

  res.json({ ok: true, batch });
});

// Package Batch & Generate QR (Processor)
router.post('/:id/package', async (req, res) => {
  const batch = batches[req.params.id];
  if (!batch) return res.status(404).json({ ok: false });

  batch.status = 'PACKAGED';
  batch.transactions.push({ date: new Date().toISOString(), event: 'Package registered', actor: 'Processor' });
  batch.transactions.push({ date: new Date().toISOString(), event: 'QR generated', actor: 'System' });

  addBlockToChain('PACKAGED', batch);

  res.json({ ok: true, batch });
});

// Dispatch Batch (Processor)
router.post('/:id/dispatch', (req, res) => {
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

// Packaging endpoint
router.post('/:id/packaging', (req, res) => {
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

module.exports = router;