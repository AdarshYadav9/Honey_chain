const { Router } = require('express');
const { reports } = require('../store');
const { addBlockToChain } = require('../blockchain');
const router = Router();

// Consumer Report / Counterfeit Flag
router.post('/', (req, res) => {
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

router.get('/', (req, res) => {
  res.json({ ok: true, reports });
});

module.exports = router;