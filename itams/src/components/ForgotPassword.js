import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "../App.css";

// =====================================================
// VALIDATE EMPLOYEE ID
// =====================================================
//
// Format:
// YYMMDD + 3-digit employee number
//
// Example:
// 260821001
//
// YY = 26
// MM = 08
// DD = 21
// Employee number = 001
//
// Rules:
// - Past dates are allowed
// - Today is allowed
// - Future dates are NOT allowed
// - Exactly 9 digits
// - No spaces
// - Employee number cannot be 000
// =====================================================

const validateEmployeeId = (value) => {
  // Empty
  if (value.length === 0) {
    return "Please enter Employee ID.";
  }

  // Spaces
  if (/\s/.test(value)) {
    return "Spaces are not allowed.";
  }

  // Numbers only
  if (!/^[0-9]+$/.test(value)) {
    return "Employee ID must contain numbers only.";
  }

  // Exactly 9 digits
  if (!/^[0-9]{9}$/.test(value)) {
    return "Employee ID must be exactly 9 digits.";
  }

  // ----------------------------------------
  // YYMMDD + 3 digits
  // ----------------------------------------

  const year  = Number(value.substring(0, 2));
  const month = Number(value.substring(2, 4));
  const day   = Number(value.substring(4, 6));

  // Month validation
  if (month < 1 || month > 12) {
    return "Invalid month in Employee ID.";
  }

  // Day validation
  if (day < 1 || day > 31) {
    return "Invalid day in Employee ID.";
  }

  // Validate actual calendar date
  const fullYear = 2000 + year;

  const employeeDate = new Date(fullYear, month - 1, day);

  if (
    employeeDate.getFullYear() !== fullYear ||
    employeeDate.getMonth() !== month - 1 ||
    employeeDate.getDate() !== day
  ) {
    return "Invalid date in Employee ID.";
  }

  // Future date validation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  employeeDate.setHours(0, 0, 0, 0);

  if (employeeDate > today) {
    return "Future date Employee IDs are not allowed.";
  }

  // Employee number (last 3 digits)
  const employeeNumber = value.substring(6);

  if (!/^[0-9]{3}$/.test(employeeNumber)) {
    return "Last 3 digits must be the employee number.";
  }

  if (employeeNumber === "000") {
    return "Employee number cannot be 000.";
  }

  return "";
};

// =====================================================
// VALIDATE EMAIL
// =====================================================
//
// Email MUST match the Employee ID with 'a' suffix.
//
// Example:
//
// Employee ID:
// 260821001
//
// Email:
// 260821001a@gmail.com
//
// These are NOT allowed:
//
// 260821001@gmail.com   (missing 'a')
// shravan@gmail.com
// abc260821001a@gmail.com
// 260821001a@yahoo.com
// =====================================================

const validateEmail = (value) => {
  // Empty
  if (value.length === 0) {
    return "Please enter your Email.";
  }

  // Spaces
  if (/\s/.test(value)) {
    return "Spaces are not allowed.";
  }

  // Maximum length
  if (value.length > 50) {
    return "Email is too long.";
  }

  // Exactly 9 digits + a + @gmail.com
  const emailPattern = /^([0-9]{9})a@gmail\.com$/;

  const match = value.match(emailPattern);

  if (!match) {
    return "Email must be in this format: 260821001a@gmail.com";
  }

  // Get Employee ID from email
  const employeeId = match[1];

  // Validate Employee ID
  const employeeIdError =
    validateEmployeeId(employeeId);

  if (employeeIdError) {
    return employeeIdError;
  }

  return "";
};

// =====================================================
// OTP VALIDATION
// =====================================================

const validateOTP = (value) => {
  if (value === "") {
    return "Please enter OTP.";
  }

  if (/\s/.test(value)) {
    return "OTP cannot contain spaces.";
  }

  if (!/^\d{6}$/.test(value)) {
    return "OTP must be exactly 6 digits.";
  }

  return "";
};

// =====================================================
// PASSWORD REQUIREMENTS
// =====================================================

const getPasswordRequirements = (password) => {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_\-+=;'/`~[\]\\]/.test(
      password
    ),
    noSpaces: !/\s/.test(password),
  };
};

// =====================================================
// PASSWORD VALIDATION
// =====================================================

const validatePassword = (
  password,
  confirmPassword
) => {
  // Empty
  if (password.length === 0) {
    return "Please enter a new password.";
  }

  // Maximum 20 characters
  if (password.length > 20) {
    return "Password cannot exceed 20 characters.";
  }

  const requirements =
    getPasswordRequirements(password);

  // No spaces
  if (!requirements.noSpaces) {
    return "Password cannot contain spaces.";
  }

  // Minimum 8 characters
  if (!requirements.minLength) {
    return "Password must contain at least 8 characters.";
  }

  // Uppercase
  if (!requirements.uppercase) {
    return "Password must contain at least one uppercase letter.";
  }

  // Lowercase
  if (!requirements.lowercase) {
    return "Password must contain at least one lowercase letter.";
  }

  // Number
  if (!requirements.number) {
    return "Password must contain at least one number.";
  }

  // Special character
  if (!requirements.special) {
    return "Password must contain at least one special character.";
  }

  // Confirm password
  if (confirmPassword.length === 0) {
    return "Please confirm your password.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
};

// =====================================================
// PASSWORD REQUIREMENT ITEM
// =====================================================

const PasswordRequirement = ({
  valid,
  children,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        fontSize: "13px",
        marginTop: "4px",
        color: valid ? "#188038" : "#5f6368",
      }}
    >
      <span
        style={{
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        {valid ? "✓" : "○"}
      </span>

      <span>{children}</span>
    </div>
  );
};

// =====================================================
// LOGIN COMPONENT
// =====================================================

export default function ForgotPassword({
  onLoginClick,
}) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  // Validation states
  const [emailError, setEmailError] =
    useState("");

  const [otpError, setOtpError] =
    useState("");

  const [
    confirmPasswordError,
    setConfirmPasswordError,
  ] = useState("");

  // =====================================================
  // PASSWORD REQUIREMENTS
  // =====================================================

  const passwordRequirements =
    getPasswordRequirements(newPassword);

  // =====================================================
  // EMAIL CHANGE
  // =====================================================

  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    if (value === "") {
      setEmailError("");
      return;
    }

    const error = validateEmail(value);

    setEmailError(error);
  };

  // =====================================================
  // OTP CHANGE
  // =====================================================

  const handleOTPChange = (e) => {
    const value = e.target.value;

    setOtp(value);

    if (value === "") {
      setOtpError("");
      return;
    }

    const error = validateOTP(value);

    setOtpError(error);
  };

  // =====================================================
  // NEW PASSWORD CHANGE
  // =====================================================

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;

    setNewPassword(value);

    // Validate confirm password if already entered
    if (
      confirmPassword.length > 0 &&
      value !== confirmPassword
    ) {
      setConfirmPasswordError(
        "Passwords do not match."
      );
    } else {
      setConfirmPasswordError("");
    }
  };

  // =====================================================
  // CONFIRM PASSWORD CHANGE
  // =====================================================

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;

    setConfirmPassword(value);

    if (value === "") {
      setConfirmPasswordError("");
      return;
    }

    if (value !== newPassword) {
      setConfirmPasswordError(
        "Passwords do not match."
      );
    } else {
      setConfirmPasswordError("");
    }
  };

  // =====================================================
  // SEND OTP
  // =====================================================

  const handleSendOTP = async (e) => {
    e.preventDefault();

    const emailValidation =
      validateEmail(email);

    if (emailValidation) {
      setEmailError(emailValidation);
      alert(emailValidation);
      return;
    }

    setEmailError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/forgot-password/send-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,

            // Compatibility with old backend
            emailOrId: email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          data.message ||
            "OTP sent successfully."
        );
      } else {
        alert(
          data.message ||
            "Unable to send OTP."
        );
      }
    } catch (error) {
      console.error(
        "Send OTP error:",
        error
      );

      alert(
        "Unable to connect to server. Please make sure the backend is running."
      );
    }
  };

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const emailValidation =
      validateEmail(email);

    if (emailValidation) {
      setEmailError(emailValidation);
      alert(emailValidation);
      return;
    }

    const otpValidation =
      validateOTP(otp);

    if (otpValidation) {
      setOtpError(otpValidation);
      alert(otpValidation);
      return;
    }

    setEmailError("");
    setOtpError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/forgot-password/verify-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            otp: otp,

            // Compatibility with old backend
            emailOrId: email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          data.message ||
            "OTP verified successfully."
        );
      } else {
        alert(
          data.message ||
            "Invalid OTP."
        );
      }
    } catch (error) {
      console.error(
        "Verify OTP error:",
        error
      );

      alert(
        "Unable to connect to server. Please make sure the backend is running."
      );
    }
  };

  // =====================================================
  // RESET PASSWORD
  // =====================================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Email validation
    const emailValidation =
      validateEmail(email);

    if (emailValidation) {
      setEmailError(emailValidation);
      alert(emailValidation);
      return;
    }

    // OTP validation
    const otpValidation =
      validateOTP(otp);

    if (otpValidation) {
      setOtpError(otpValidation);
      alert(otpValidation);
      return;
    }

    // Password validation
    const passwordValidation =
      validatePassword(
        newPassword,
        confirmPassword
      );

    if (passwordValidation) {
      if (
        passwordValidation ===
        "Passwords do not match."
      ) {
        setConfirmPasswordError(
          passwordValidation
        );
      }

      alert(passwordValidation);
      return;
    }

    setEmailError("");
    setOtpError("");
    setConfirmPasswordError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/forgot-password/reset",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            otp: otp,
            newPassword: newPassword,

            // Compatibility with old backend
            emailOrId: email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          data.message ||
            "Password reset successfully."
        );

        // Clear fields
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");

        setEmailError("");
        setOtpError("");
        setConfirmPasswordError("");

        // Return to Login
        if (onLoginClick) {
          onLoginClick();
        }
      } else {
        alert(
          data.message ||
            "Unable to reset password."
        );
      }
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      alert(
        "Unable to connect to server. Please make sure the backend is running."
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <div className="forgot-password-card">

        <h2>Forgot Password</h2>

        <form>

          {/* ==========================================
              EMAIL
          ========================================== */}

          <label>Email</label>

          <input
            type="text"
            placeholder="Enter your Email (e.g. 260821001a@gmail.com)"
            value={email}
            onChange={handleEmailChange}
            autoComplete="email"
            maxLength={50}
            className={
              emailError
                ? "input-error"
                : ""
            }
          />

          {emailError && (
            <div
              style={{
                color: "#d93025",
                fontSize: "12px",
                marginTop: "5px",
              }}
            >
              ⚠️ {emailError}
            </div>
          )}

          {!emailError &&
            email.length > 0 && (
              <div
                style={{
                  color: "#188038",
                  fontSize: "12px",
                  marginTop: "5px",
                }}
              >
                ✓ Valid Employee Email
              </div>
            )}

          <button
            type="button"
            className="action-btn"
            onClick={handleSendOTP}
          >
            Send OTP
          </button>

          {/* ==========================================
              OTP
          ========================================== */}

          <label>Enter OTP</label>

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={handleOTPChange}
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
            className={
              otpError
                ? "input-error"
                : ""
            }
          />

          {otpError && (
            <div
              style={{
                color: "#d93025",
                fontSize: "12px",
                marginTop: "5px",
              }}
            >
              ⚠️ {otpError}
            </div>
          )}

          <button
            type="button"
            className="action-btn"
            onClick={handleVerifyOTP}
          >
            Verify OTP
          </button>

          {/* ==========================================
              NEW PASSWORD
          ========================================== */}

          <label>New Password</label>

          <div className="password-input-container">

            <input
              type={
                showNewPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter New Password"
              value={newPassword}
              onChange={
                handleNewPasswordChange
              }
              maxLength={20}
              autoComplete="new-password"
            />

            <button
              type="button"
              className="password-toggle-btn"
              onClick={() =>
                setShowNewPassword(
                  !showNewPassword
                )
              }
              aria-label={
                showNewPassword
                  ? "Hide Password"
                  : "Show Password"
              }
            >
              {showNewPassword ? (
                <FaRegEyeSlash />
              ) : (
                <FaRegEye />
              )}
            </button>

          </div>

          {/* ==========================================
              GOOGLE-STYLE PASSWORD REQUIREMENTS
          ========================================== */}

          {newPassword.length > 0 && (
            <div
              style={{
                marginTop: "8px",
                marginBottom: "10px",
              }}
            >

              <PasswordRequirement
                valid={
                  passwordRequirements.minLength
                }
              >
                Use 8 characters or more
              </PasswordRequirement>

              <PasswordRequirement
                valid={
                  passwordRequirements.uppercase
                }
              >
                Include at least one uppercase letter
              </PasswordRequirement>

              <PasswordRequirement
                valid={
                  passwordRequirements.lowercase
                }
              >
                Include at least one lowercase letter
              </PasswordRequirement>

              <PasswordRequirement
                valid={
                  passwordRequirements.number
                }
              >
                Include at least one number
              </PasswordRequirement>

              <PasswordRequirement
                valid={
                  passwordRequirements.special
                }
              >
                Include at least one special character
              </PasswordRequirement>

              <PasswordRequirement
                valid={
                  passwordRequirements.noSpaces
                }
              >
                Do not use spaces
              </PasswordRequirement>

            </div>
          )}

          {/* ==========================================
              CONFIRM PASSWORD
          ========================================== */}

          <label>Confirm Password</label>

          <div className="password-input-container">

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={
                handleConfirmPasswordChange
              }
              maxLength={20}
              autoComplete="new-password"
              className={
                confirmPasswordError
                  ? "input-error"
                  : ""
              }
            />

            <button
              type="button"
              className="password-toggle-btn"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              aria-label={
                showConfirmPassword
                  ? "Hide Password"
                  : "Show Password"
              }
            >
              {showConfirmPassword ? (
                <FaRegEyeSlash />
              ) : (
                <FaRegEye />
              )}
            </button>

          </div>

          {confirmPasswordError && (
            <div
              style={{
                color: "#d93025",
                fontSize: "12px",
                marginTop: "5px",
              }}
            >
              ⚠️ {confirmPasswordError}
            </div>
          )}

          {!confirmPasswordError &&
            confirmPassword.length > 0 &&
            confirmPassword === newPassword && (
              <div
                style={{
                  color: "#188038",
                  fontSize: "12px",
                  marginTop: "5px",
                }}
              >
                ✓ Passwords match
              </div>
            )}

          {/* ==========================================
              RESET PASSWORD
          ========================================== */}

          <button
            type="button"
            className="action-btn"
            onClick={handleResetPassword}
          >
            Reset Password
          </button>

        </form>

      </div>

      <footer
        style={{
          marginTop: "auto",
        }}
      >
        © 2026 ITAMS
      </footer>

    </div>
  );
}
