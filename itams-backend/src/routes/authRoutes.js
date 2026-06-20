const express = require('express');
const router = express.Router();
const { register, login, sendOtp, verifyOtp, resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password/send-otp', sendOtp);
router.post('/forgot-password/verify-otp', verifyOtp);
router.post('/forgot-password/reset', resetPassword);

module.exports = router;
