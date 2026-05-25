const express = require('express');
const { createScreening, getScreenings, getStats, getVillageSummary, getWeeklyTrend } = require('../controllers/screening.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.use(protect);
router.post('/', createScreening);
router.get('/stats', getStats);
router.get('/village-summary', getVillageSummary);
router.get('/weekly', getWeeklyTrend);
router.get('/', getScreenings);

module.exports = router;
