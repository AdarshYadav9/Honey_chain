const { Router } = require('express');
const QRCode = require('qrcode');
const { batches } = require('../store');
const router = Router();

// QR Code Endpoint (Returns Data URL & Verification URL)
router.get('/:batchId', async (req, res) => {
  const batchId = req.params.batchId;
  const batch = batches[batchId];
  if (!batch) return res.status(404).json({ ok: false, error: 'Batch not found' });

  // Consumer link is opened by a phone scanner — never a loopback/dev address.
  const HOSTED_APP = 'https://honey-chain-ruddy.vercel.app';
  const isLoopback = u => /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?(\/|$)/i.test(u || '');
  const appBase = ([process.env.PUBLIC_APP_URL, process.env.QR_BASE_URL, HOSTED_APP]
    .find(u => u && !isLoopback(u)) || HOSTED_APP).replace(/\/+$/, '');
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