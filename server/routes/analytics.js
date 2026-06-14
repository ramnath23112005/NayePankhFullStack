const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getMonthlyVolunteerGrowth,
  getEventParticipationTrends,
  getInternshipStatistics,
  getPopularEvents
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/volunteer-growth', protect, authorize('admin'), getMonthlyVolunteerGrowth);
router.get('/event-participation', protect, authorize('admin'), getEventParticipationTrends);
router.get('/internship-stats', protect, authorize('admin'), getInternshipStatistics);
router.get('/popular-events', protect, authorize('admin'), getPopularEvents);

module.exports = router;
