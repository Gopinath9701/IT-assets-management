import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "../App.css";

export default function ForgotPassword({ onLoginClick }) {
  const [emailOrId, setEmailOrId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!emailOrId) {
      alert("Please enter your email or employee ID first.");
      return;
    }
    console.log("Send OTP to:", emailOrId);
    alert(`OTP sent to ${emailOrId}`);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }
    console.log("Verify OTP:", otp);
    alert(`OTP ${otp} verified successfully`);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      alert("Please fill in both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Reset Password for", emailOrId, "New Password:", newPassword);
    alert("Password reset successful!");
    if (onLoginClick) {
      onLoginClick();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div className="forgot-password-card">
        <h2>Forget Password</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>Email or Employee ID</label>
          <input
            type="text"
            placeholder="Enter your email or employee ID"
            value={emailOrId}
            onChange={(e) => setEmailOrId(e.target.value)}
            required
          />
          <button type="button" className="action-btn" onClick={handleSendOTP}>
            Send OTP
          </button>

          <label>Enter OTP</label>
          <input
            type="text"
            placeholder="Enter the OTP sent to your email"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="button" className="action-btn" onClick={handleVerifyOTP}>
            Verify OTP
          </button>

          <label>New Password</label>
          <div className="password-input-container">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          <label>Confirm Password</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          <button type="button" className="action-btn" onClick={handleResetPassword}>
            Reset Password
          </button>
        </form>
      </div>
      <footer style={{ marginTop: "auto" }}>© 2026 ITAMS</footer>
    </div>
  );
}
