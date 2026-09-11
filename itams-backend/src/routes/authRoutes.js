const express = require("express");
const rateLimit = require("express-rate-limit");
const { login, sendOtp, verifyOtp, resetPassword } = require("../controllers/authController");

const router = express.Router();

// Keyed by the account being acted on (emailOrId), not by IP. With the
// default IP-based key, testing several different accounts back to back
// from the same machine/network shared one 5-request budget - trying
// account 001 (worked) then 002 and 003 shortly after got 002/003 blocked
// even though neither of them had actually been touched yet. Rate limiting
// exists to slow down brute-forcing a specific account's OTP, so it should
// track that account, not whoever's IP happens to be making the request.
// Falls back to IP only if the identifier is missing from the request.
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many attempts. Please try again later." },
  keyGenerator: (req) => {
    const identifier = req.body?.emailOrId;
    return identifier ? `id:${identifier}` : req.ip;
  },
});

router.post("/login", login);
router.post("/forgot-password/send-otp", otpLimiter, sendOtp);
router.post("/forgot-password/verify-otp", otpLimiter, verifyOtp);
router.post("/forgot-password/reset", otpLimiter, resetPassword);

module.exports = router;
