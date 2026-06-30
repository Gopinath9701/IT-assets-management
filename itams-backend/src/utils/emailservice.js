const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendOtpEmail(toEmail, otp) {
  const mailOptions = {
    from: `"ITAMS Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your ITAMS Password Reset OTP',
    text: `Your OTP for resetting your ITAMS password is: ${otp}\n\nThis code expires in 10 minutes. If you did not request this, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px;">
        <h2 style="color: #2c3e50;">ITAMS Password Reset</h2>
        <p>Your one-time password (OTP) is:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #2980b9;">${otp}</p>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p style="color: #888; font-size: 12px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOtpEmail };