const express = require("express");
const rateLimit = require("express-rate-limit");
const { login, sendOtp, verifyOtp, resetPassword } = require("../controllers/authController");

const router = express.Router();

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many attempts. Please try again later." },
});

router.post("/login", login);
router.post("/forgot-password/send-otp", otpLimiter, sendOtp);
router.post("/forgot-password/verify-otp", otpLimiter, verifyOtp);
router.post("/forgot-password/reset", resetPassword);

module.exports = router;
