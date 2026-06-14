const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  markAttendance
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), createEvent);
router.get('/', getEvents);
router.get('/my-events', protect, getMyEvents);
router.get('/:id', getEventById);
router.put('/:id', protect, authorize('admin'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);
router.post('/:id/register', protect, registerForEvent);
router.post('/:id/cancel', protect, cancelRegistration);
router.post('/:id/attendance', protect, authorize('admin'), markAttendance);

module.exports = router;
