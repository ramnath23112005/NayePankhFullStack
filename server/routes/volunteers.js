const express = require('express');
const router = express.Router();
const {
  getVolunteers,
  exportVolunteers,
  getVolunteerDashboard,
  getVolunteerById,
  updateProfile,
  approveVolunteer,
  rejectVolunteer
} = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getVolunteers);
router.get('/export', protect, authorize('admin'), exportVolunteers);
router.get('/dashboard', protect, authorize('volunteer'), getVolunteerDashboard);
router.get('/:id', protect, authorize('admin'), getVolunteerById);
router.put('/profile', protect, updateProfile);
router.put('/:id/approve', protect, authorize('admin'), approveVolunteer);
router.put('/:id/reject', protect, authorize('admin'), rejectVolunteer);

module.exports = router;
