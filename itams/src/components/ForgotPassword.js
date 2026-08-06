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

  // ===============================
  // Email / Employee ID Validation
  // ===============================
  const validateEmailOrId = (value) => {

    value = value.trim();

    if (value === "") {
      return "Please enter your Email or Employee ID.";
    }

    if (value.includes(" ")) {
      return "Spaces are not allowed.";
    }

    if (value.length > 50) {
      return "Input is too long.";
    }

    // Employee ID Validation
    if (value.startsWith("EMP")) {

      if (value.length < 6) {
        return "Employee ID must be exactly 6 characters.";
      }

      if (value.length > 6) {
        return "Employee ID cannot exceed 6 characters.";
      }

      if (!/^EMP[A-Za-z0-9]{3}$/.test(value)) {
        return "Please enter a valid Employee ID.";
      }

      return "";
    }

    // Lowercase emp
    if (value.toLowerCase().startsWith("emp")) {
      return "Employee ID must start with 'EMP' in uppercase.";
    }

    // Email Validation

    if (!value.endsWith("@gmail.com")) {
      return "Please enter a valid Gmail address.";
    }

    const username = value.split("@")[0];

    if (username.length < 3) {
      return "Email username must contain at least 3 characters.";
    }

    if (!/^[A-Za-z0-9._]+@gmail\.com$/.test(value)) {
      return "Invalid characters are not allowed.";
    }

    return "";
  };

  // =====================
  // OTP Validation
  // =====================

  const validateOTP = (value) => {

    if (value.trim() === "") {
      return "Please enter OTP.";
    }

    if (!/^\d{6}$/.test(value)) {
      return "OTP must be exactly 6 digits.";
    }

    return "";
  };

  // ======================
  // Password Validation
  // ======================

  const validatePassword = (password, confirmPassword) => {

    if (!password || !confirmPassword) {
      return "Please fill all password fields.";
    }

    if (password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    if (password.length > 20) {
      return "Password cannot exceed 20 characters.";
    }

    if (password.includes(" ")) {
      return "Password cannot contain spaces.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  // =====================
  // Send OTP
  // =====================

  const handleSendOTP = async (e) => {

    e.preventDefault();

    const validationError = validateEmailOrId(emailOrId);

    if (validationError) {
      alert(validationError);
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:5000/api/forgot-password/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailOrId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message);
      }

    } catch (error) {

      console.error(error);
      alert("Unable to connect to server.");

    }

  };
  // =====================
// Verify OTP
// =====================

const handleVerifyOTP = async (e) => {

  e.preventDefault();

  const otpError = validateOTP(otp);

  if (otpError) {
    alert(otpError);
    return;
  }

  try {

    const response = await fetch(
      "http://localhost:5000/api/forgot-password/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrId,
          otp,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
    } else {
      alert(data.message);
    }

  } catch (error) {

    console.error(error);
    alert("Unable to connect to server.");

  }

};

// =====================
// Reset Password
// =====================

const handleResetPassword = async (e) => {

  e.preventDefault();

  // Validate Email / Employee ID
  const emailError = validateEmailOrId(emailOrId);

  if (emailError) {
    alert(emailError);
    return;
  }

  // Validate OTP
  const otpError = validateOTP(otp);

  if (otpError) {
    alert(otpError);
    return;
  }

  // Validate Password
  const passwordError = validatePassword(
    newPassword,
    confirmPassword
  );

  if (passwordError) {
    alert(passwordError);
    return;
  }

  try {

    const response = await fetch(
      "http://localhost:5000/api/forgot-password/reset",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrId,
          otp,
          newPassword,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {

      alert(data.message);

      // Clear all fields
      setEmailOrId("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");

      // Navigate back to Login page
      if (onLoginClick) {
        onLoginClick();
      }

    } else {

      alert(data.message);

    }

  } catch (error) {

    console.error(error);
    alert("Unable to connect to server.");

  }

};
return (
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <div className="forgot-password-card">

      <h2>Forgot Password</h2>

      <form>

        {/* Email / Employee ID */}

        <label>Email or Employee ID</label>

        <input
          type="text"
          placeholder="Enter your Email or Employee ID"
          value={emailOrId}
          onChange={(e) => setEmailOrId(e.target.value)}
        />

        <button
          type="button"
          className="action-btn"
          onClick={handleSendOTP}
        >
          Send OTP
        </button>

        {/* OTP */}

        <label>Enter OTP</label>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
        />

        <button
          type="button"
          className="action-btn"
          onClick={handleVerifyOTP}
        >
          Verify OTP
        </button>

        {/* New Password */}

        <label>New Password</label>

        <div className="password-input-container">

          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowNewPassword(!showNewPassword)}
            aria-label={
              showNewPassword ? "Hide Password" : "Show Password"
            }
          >
            {showNewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>

        </div>

        {/* Confirm Password */}

        <label>Confirm Password</label>

        <div className="password-input-container">

          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="button"
            className="password-toggle-btn"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            aria-label={
              showConfirmPassword ? "Hide Password" : "Show Password"
            }
          >
            {showConfirmPassword ? (
              <FaRegEyeSlash />
            ) : (
              <FaRegEye />
            )}
          </button>

        </div>

        {/* Reset Button */}

        <button
          type="button"
          className="action-btn"
          onClick={handleResetPassword}
        >
          Reset Password
        </button>

      </form>

    </div>

    <footer style={{ marginTop: "auto" }}>
      © 2026 ITAMS
    </footer>

  </div>
);

}
