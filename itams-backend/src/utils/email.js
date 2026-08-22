const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

async function sendOtpEmail(toEmail, otp, name = "") {
  const fromName = process.env.EMAIL_FROM_NAME || "ITAMS Support";

  await transporter.sendMail({
    from: `"${fromName}" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Your ITAMS Password Reset OTP",
    html: `
      <div style="font-family:Segoe UI,Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #e4e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:#1d63ff;padding:20px 30px;">
          <h2 style="color:#fff;margin:0;">ITAMS</h2>
          <p style="color:#dce6ff;margin:4px 0 0;font-size:13px;">IT Asset Management System</p>
        </div>
        <div style="padding:30px;">
          <p>Hi ${name || "there"},</p>
          <p>Use the OTP below to reset your ITAMS account password. This code expires in <b>10 minutes</b>.</p>
          <div style="text-align:center;margin:30px 0;">
            <span style="font-size:32px;letter-spacing:8px;font-weight:700;color:#1d63ff;">${otp}</span>
          </div>
          <p style="color:#777;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div style="background:#f5f7fb;padding:15px 30px;text-align:center;color:#999;font-size:12px;">
          © ${new Date().getFullYear()} ITAMS
        </div>
      </div>
    `,
  });
}

async function verifyEmailTransport() {
  try {
    await transporter.verify();
    console.log("✅ Gmail SMTP transporter ready");
  } catch (err) {
    console.error("⚠️  Gmail SMTP verification failed:", err.message);
  }
}

module.exports = { sendOtpEmail, verifyEmailTransport };
