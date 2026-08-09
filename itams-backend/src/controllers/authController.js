const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const { sendOtpEmail } = require("../utils/email");
const { generateOtp, otpExpiryDate } = require("../utils/otp");

// Finds a user by their login ID (e.g. HR001) OR email address
async function findUserByIdentifier(identifier) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE login_id = $1 OR email = $1 LIMIT 1",
    [identifier]
  );
  return rows[0] || null;
}

// ---------------- LOGIN ----------------
// POST /api/login  { employeeIdOrEmail, password }  <- field name matches Login.js exactly
async function login(req, res, next) {
  try {
    const { employeeIdOrEmail: identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: "Employee ID/Email and password are required" });
    }

    const user = await findUserByIdentifier(identifier);
    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, loginId: user.login_id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        loginId: user.login_id,
        name: user.name,
        email: user.email,
        role: user.role, // 'HR' or 'AssetManager' -> frontend routes to the right dashboard
        department: user.department,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ---------------- FORGOT PASSWORD: SEND OTP ----------------
// POST /api/forgot-password/send-otp  { emailOrId }  <- field name matches ForgotPassword.js exactly
async function sendOtp(req, res, next) {
  try {
    const { emailOrId: identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, message: "Email or Employee ID is required" });
    }

    const user = await findUserByIdentifier(identifier);
    // Don't reveal whether the account exists — respond the same way either way
    if (!user) {
      return res.json({
        success: true,
        message: "If an account exists for that Email/ID, an OTP has been sent.",
      });
    }

    const otp = generateOtp();
    const expiresAt = otpExpiryDate(10);

    await pool.query(
      "INSERT INTO password_resets (user_id, otp_code, expires_at) VALUES ($1, $2, $3)",
      [user.id, otp, expiresAt]
    );

    await sendOtpEmail(user.email, otp, user.name);

    res.json({ success: true, message: `OTP sent to ${maskEmail(user.email)}` });
  } catch (err) {
    next(err);
  }
}

// ---------------- FORGOT PASSWORD: VERIFY OTP ----------------
// POST /api/forgot-password/verify-otp  { emailOrId, otp }
async function verifyOtp(req, res, next) {
  try {
    const { emailOrId: identifier, otp } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: "Identifier and OTP are required" });
    }

    const user = await findUserByIdentifier(identifier);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const { rows } = await pool.query(
      `SELECT * FROM password_resets
       WHERE user_id = $1 AND otp_code = $2 AND verified = FALSE AND expires_at > NOW()
       ORDER BY id DESC LIMIT 1`,
      [user.id, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    await pool.query("UPDATE password_resets SET verified = TRUE WHERE id = $1", [rows[0].id]);

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    next(err);
  }
}

// ---------------- FORGOT PASSWORD: RESET ----------------
// POST /api/forgot-password/reset  { emailOrId, otp, newPassword }  <- matches ForgotPassword.js exactly
async function resetPassword(req, res, next) {
  try {
    const { emailOrId: identifier, otp, newPassword } = req.body;
    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Identifier, OTP and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const user = await findUserByIdentifier(identifier);
    if (!user) {
      return res.status(400).json({ success: false, message: "Account not found" });
    }

    // Require the exact OTP that was already verified, within the last 15 minutes
    const { rows } = await pool.query(
      `SELECT * FROM password_resets
       WHERE user_id = $1 AND otp_code = $2 AND verified = TRUE AND created_at > (NOW() - INTERVAL '15 minutes')
       ORDER BY id DESC LIMIT 1`,
      [user.id, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Please verify OTP again before resetting password" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hash, user.id]);

    // invalidate used OTPs for this user
    await pool.query("DELETE FROM password_resets WHERE user_id = $1", [user.id]);

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
}

function maskEmail(email) {
  const [name, domain] = email.split("@");
  if (name.length <= 2) return `${name[0]}***@${domain}`;
  return `${name.slice(0, 2)}***@${domain}`;
}

module.exports = { login, sendOtp, verifyOtp, resetPassword };
