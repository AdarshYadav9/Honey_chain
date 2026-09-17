const { Router } = require('express');
const QRCode = require('qrcode');
const { batches } = require('../store');
const router = Router();

// QR Code Endpoint (Returns Data URL & Verification URL)
router.get('/:batchId', async (req, res) => {
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

module.exports = router;