const { Router } = require('express');

const authRouter = require('./auth');
const usersRouter = require('./users');
const beekeepersRouter = require('./beekeepers');
const hivesRouter = require('./hives');
const aiRouter = require('./ai');
const harvestRouter = require('./harvest');
const qualityRouter = require('./quality');
const processingRouter = require('./processing');
const batchesRouter = require('./batches');
const reportsRouter = require('./reports');
const qrRouter = require('./qr');
const provenanceRouter = require('./provenance');
const systemRouter = require('./system');

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/beekeepers', beekeepersRouter);
router.use('/iot/hives', hivesRouter);
router.use('/ai', aiRouter);
router.use('/harvest-event', harvestRouter);
router.use('/quality-test', qualityRouter.testRouter);
router.use('/quality', qualityRouter.router);
router.use('/processing-step', processingRouter);
router.use('/batches', batchesRouter);
router.use('/reports', reportsRouter);
router.use('/qr', qrRouter);
router.use('/provenance', provenanceRouter);
router.use('/', systemRouter);

module.exports = router;