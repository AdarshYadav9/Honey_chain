const { Router } = require('express');
const QRCode = require('qrcode');
const { batches } = require('../store');
const router = Router();

// QR Code Endpoint (Returns Data URL & Verification URL)
router.get('/:batchId', async (req, res) => {
  const batchId = req.params.batchId;
  const batch = batches[batchId];
  if (!batch) return res.status(404).json({ ok: false, error: 'Batch not found' });

  // Direct consumer verification link — always point at the hosted app, never a dev tunnel
  const appBase = (process.env.QR_BASE_URL || process.env.PUBLIC_APP_URL || 'https://honey-chain-ruddy.vercel.app').replace(/\/+$/, '');
  const verificationUrl = `${appBase}/#verify/${encodeURIComponent(batchId)}`;
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

module.exports = router;