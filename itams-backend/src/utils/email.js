const { Resend } = require("resend");
require("dotenv").config();

// Replaces Gmail SMTP — several deployment hosts block outbound SMTP ports
// (465/587) entirely, which no amount of port/timeout tuning can work around.
// Resend sends over plain HTTPS, which isn't blocked the same way.
const resend = new Resend(process.env.RESEND_API_KEY);

// Resend's shared sandbox address (onboarding@resend.dev) only delivers to
// the Resend account's own verified email while no custom domain is set up —
// set RESEND_FROM_EMAIL to an address on a verified domain to send to
// arbitrary recipients (i.e. real OTP delivery to real users).
const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

async function sendOtpEmail(toEmail, otp, name = "") {
  const fromName = process.env.EMAIL_FROM_NAME || "ITAMS Support";

  const { error } = await resend.emails.send({
    from: `${fromName} <${FROM_ADDRESS}>`,
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

  if (error) {
    throw new Error(error.message || "Failed to send OTP email");
  }
}

// Resend is a stateless HTTPS API, not a persistent connection like SMTP —
// there's nothing to "verify" upfront the way transporter.verify() checked a
// live socket. This just confirms the API key is present so a missing one
// fails loudly at startup instead of silently on the first real OTP request.
async function verifyEmailTransport() {
  if (!process.env.RESEND_API_KEY) {
    console.error("⚠️  RESEND_API_KEY is not set — OTP emails will fail.");
    return;
  }
  console.log("✅ Resend configured");
}

module.exports = { sendOtpEmail, verifyEmailTransport };
