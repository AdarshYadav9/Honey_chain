const { Router } = require('express');
const { beekeepers } = require('../store');
const { addBlockToChain } = require('../blockchain');
const router = Router();

router.get('/', (req, res) => {
  res.json({ ok: true, beekeepers: Object.values(beekeepers) });
});

router.post('/', (req, res) => {
  const { name, aadhaar, krishiId, cluster, state, village, boxesAllocated, species, phone } = req.body;
  const beekeeperId = `KVIC-BK-${100 + Object.keys(beekeepers).length + 1}`;
  const newBeekeeper = {
    id: beekeeperId,
    name: name || 'New Beekeeper',
    aadhaar: aadhaar || 'XXXX-XXXX-0000',
    krishiId: krishiId || `KRISHI-${Date.now().toString().slice(-4)}`,
    cluster: cluster || 'Regional Honey Cluster',
    state: state || 'State',
    village: village || 'Village',
    boxesAllocated: parseInt(boxesAllocated, 10) || 5,
    species: species || 'Apis mellifera',
    phone: phone || '+91-00000-00000',
    joinedDate: new Date().toISOString().split('T')[0],
    verified: true
  };
  beekeepers[beekeeperId] = newBeekeeper;

  addBlockToChain('BeekeeperEnrolled', { beekeeperId, name: newBeekeeper.name, cluster: newBeekeeper.cluster });
  res.json({ ok: true, beekeeper: newBeekeeper });
});

module.exports = router;