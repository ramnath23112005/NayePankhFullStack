const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  applyForInternship,
  getApplications,
  getMyApplication,
  getInternDashboard,
  updateApplicationStatus,
  addTask,
  updateTaskStatus
} = require('../controllers/internshipController');
const { protect, authorize } = require('../middleware/auth');

router.post('/apply', protect, authorize('intern'), upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 }
]), applyForInternship);

router.get('/', protect, authorize('admin'), getApplications);
router.get('/my-application', protect, authorize('intern'), getMyApplication);
router.get('/dashboard', protect, authorize('intern'), getInternDashboard);
router.put('/:id/status', protect, authorize('admin'), updateApplicationStatus);
router.post('/:id/tasks', protect, authorize('admin'), addTask);
router.put('/:id/tasks/:taskId', protect, authorize('intern'), updateTaskStatus);

module.exports = router;
