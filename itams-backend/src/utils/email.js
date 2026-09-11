const { BrevoClient } = require("@getbrevo/brevo");
require("dotenv").config();

// Replaces Mailgun/Resend — both only let you send to a small fixed set of
// explicitly pre-authorized recipients (or a full verified domain) before
// you can email anyone. Brevo verifies only the SENDER address (a one-time
// email-link click, no domain, no card) and then lets that sender email
// ANY recipient — no per-recipient whitelist to maintain.
const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

async function sendOtpEmail(toEmail, otp, name = "", expiryMinutes = 10) {
  const fromName = process.env.EMAIL_FROM_NAME || "ITAMS Support";
  const fromEmail = process.env.BREVO_FROM_EMAIL;

  await brevo.transactionalEmails.sendTransacEmail({
    sender: { name: fromName, email: fromEmail },
    to: [{ email: toEmail, name: name || undefined }],
    subject: "Your ITAMS Password Reset OTP",
    htmlContent: `
      <div style="font-family:Segoe UI,Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #e4e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:#1d63ff;padding:20px 30px;">
          <h2 style="color:#fff;margin:0;">ITAMS</h2>
          <p style="color:#dce6ff;margin:4px 0 0;font-size:13px;">IT Asset Management System</p>
        </div>
        <div style="padding:30px;">
          <p>Hi ${name || "there"},</p>
          <p>Use the OTP below to reset your ITAMS account password. This code expires in <b>${expiryMinutes} minutes</b>.</p>
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

// Brevo is a stateless HTTPS API, not a persistent connection like SMTP —
// there's nothing to "verify" upfront the way transporter.verify() checked a
// live socket. This just confirms the required config is present so a
// missing one fails loudly at startup instead of silently on the first real
// OTP request.
async function verifyEmailTransport() {
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_FROM_EMAIL) {
    console.error("⚠️  BREVO_API_KEY / BREVO_FROM_EMAIL is not set — OTP emails will fail.");
    return;
  }
  console.log("✅ Brevo configured");
}

module.exports = { sendOtpEmail, verifyEmailTransport };
