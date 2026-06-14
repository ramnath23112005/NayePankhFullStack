const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.post('/register', [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['volunteer', 'intern', 'admin'])
], validate, register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], validate, login);

router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], validate, forgotPassword);

router.put('/reset-password/:token', [
  body('password').isLength({ min: 6 })
], validate, resetPassword);

router.get('/me', protect, getMe);

module.exports = router;
