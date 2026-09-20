const { Router } = require('express');
const router = Router();

// Mock Authentication
router.post('/login', (req, res) => {
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

module.exports = router;