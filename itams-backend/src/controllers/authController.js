const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const pool = require('../config/db');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// POST /api/register
// Body (matches Register.js exactly): { employeeName, employeeId, email, department, password, confirmPassword }
async function register(req, res) {
  try {
    const { employeeName, employeeId, email, department, password, confirmPassword } = req.body;

    if (!employeeName || !employeeId || !email || !department || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
    if (!['IT', 'HR', 'Finance'].includes(department)) {
      return res.status(400).json({ message: 'Invalid department.' });
    }

    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }
    const existingEmpId = await User.findByEmployeeId(employeeId);
    if (existingEmpId) {
      return res.status(409).json({ message: 'Employee ID is already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = await User.create({ employeeName, employeeId, email, department, passwordHash });

    return res.status(201).json({
      message: 'Registration successful.',
      user: { userId, employeeName, employeeId, email, department },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
}

// POST /api/login
// Body (matches Login.js on DevopsEngineer branch): { employeeIdOrEmail, password }
async function login(req, res) {
  try {
    const { employeeIdOrEmail, password } = req.body;

    if (!employeeIdOrEmail || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const user = await User.findByEmployeeIdOrEmail(employeeIdOrEmail);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user.user_id, employeeId: user.employee_id, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        userId: user.user_id,
        employeeName: user.employee_name,
        employeeId: user.employee_id,
        email: user.email,
        department: user.department,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
}

// POST /api/forgot-password/send-otp
// Body: { emailOrId }  -- matches ForgotPassword.js "Send OTP" step
async function sendOtp(req, res) {
  try {
    const { emailOrId } = req.body;
    if (!emailOrId) return res.status(400).json({ message: 'Email or Employee ID is required.' });

    const user = await User.findByEmployeeIdOrEmail(emailOrId);
    // Always return success to avoid leaking which accounts exist
    if (!user) {
      return res.status(200).json({ message: 'If that account exists, an OTP has been sent.' });
    }

    const otp = String(crypto.randomInt(100000, 999999));
    const otpHash = await bcrypt.hash(otp, SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await pool.query(
      `INSERT INTO password_resets (user_id, otp_hash, expires_at) VALUES (?, ?, ?)`,
      [user.user_id, otpHash, expiresAt]
    );

    // TODO Sprint 2+: send via real email/SMS service instead of console
    console.log(`OTP for ${emailOrId}: ${otp}`);

    return res.status(200).json({ message: 'If that account exists, an OTP has been sent.' });
  } catch (err) {
    console.error('Send OTP error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// POST /api/forgot-password/verify-otp
// Body: { emailOrId, otp }  -- matches ForgotPassword.js "Verify OTP" step
async function verifyOtp(req, res) {
  try {
    const { emailOrId, otp } = req.body;
    if (!emailOrId || !otp) {
      return res.status(400).json({ message: 'Email/Employee ID and OTP are required.' });
    }

    const user = await User.findByEmployeeIdOrEmail(emailOrId);
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP.' });

    const [rows] = await pool.query(
      `SELECT * FROM password_resets
       WHERE user_id = ? AND used = FALSE AND expires_at > NOW()
       ORDER BY id DESC LIMIT 1`,
      [user.user_id]
    );
    const resetRecord = rows[0];
    if (!resetRecord) return res.status(400).json({ message: 'Invalid or expired OTP.' });

    const otpMatches = await bcrypt.compare(otp, resetRecord.otp_hash);
    if (!otpMatches) return res.status(400).json({ message: 'Invalid or expired OTP.' });

    // Mark as "verified" (still not used) so resetPassword can confirm it was checked first
    return res.status(200).json({ message: 'OTP verified successfully.', resetId: resetRecord.id });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

// POST /api/forgot-password/reset
// Body: { emailOrId, otp, newPassword }  -- matches ForgotPassword.js "Reset Password" step
async function resetPassword(req, res) {
  try {
    const { emailOrId, otp, newPassword } = req.body;
    if (!emailOrId || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email/Employee ID, OTP, and new password are required.' });
    }

    const user = await User.findByEmployeeIdOrEmail(emailOrId);
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP.' });

    const [rows] = await pool.query(
      `SELECT * FROM password_resets
       WHERE user_id = ? AND used = FALSE AND expires_at > NOW()
       ORDER BY id DESC LIMIT 1`,
      [user.user_id]
    );
    const resetRecord = rows[0];
    if (!resetRecord) return res.status(400).json({ message: 'Invalid or expired OTP.' });

    const otpMatches = await bcrypt.compare(otp, resetRecord.otp_hash);
    if (!otpMatches) return res.status(400).json({ message: 'Invalid or expired OTP.' });

    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await User.updatePassword(user.user_id, newHash);
    await pool.query(`UPDATE password_resets SET used = TRUE WHERE id = ?`, [resetRecord.id]);

    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = { register, login, sendOtp, verifyOtp, resetPassword };
