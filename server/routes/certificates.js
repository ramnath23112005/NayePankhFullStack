const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  getCertificates,
  getMyCertificates,
  downloadCertificate,
  sendCertificateEmail
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

router.post('/generate', protect, authorize('admin'), generateCertificate);
router.get('/', protect, authorize('admin'), getCertificates);
router.get('/my-certificates', protect, getMyCertificates);
router.get('/:id/download', protect, downloadCertificate);
router.post('/:id/send-email', protect, authorize('admin'), sendCertificateEmail);

module.exports = router;
