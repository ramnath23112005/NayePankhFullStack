const express = require('express');
const router = express.Router();
const {
  postMessage,
  getConversationHistory
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.post('/message', protect, postMessage);
router.get('/history', protect, getConversationHistory);

module.exports = router;
