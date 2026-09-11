import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "../App.css";

// =====================================================
// REGISTERED LOGIN EMAILS
// =====================================================

const REGISTERED_EMAILS = {
  "260822001a@gmail.com": "HR",
  "260822002a@gmail.com": "Asset",
  "260822003a@gmail.com": "Inventory",
};

// Must match OTP_EXPIRY_MINUTES in authController.js (backend) - this is
// the actual real expiry, not a decoration, so the two can't be allowed
// to drift apart the way they already had (this said 3 minutes while the
// backend allowed 10, so the UI told users their still-valid OTP had
// expired 7 minutes before it actually did).
const OTP_EXPIRY_SECONDS = 3 * 60;

// =====================================================
// VALIDATE EMPLOYEE ID
// =====================================================

const validateEmployeeId = (value) => {
  if (value.length === 0) {
    return "Please enter Employee ID.";
  }

  if (/\s/.test(value)) {
    return "Spaces are not allowed.";
  }

  if (!/^[0-9]+$/.test(value)) {
    return "Employee ID must contain numbers only.";
  }

  if (!/^[0-9]{9}$/.test(value)) {
    return "Employee ID must be exactly 9 digits.";
  }

  const year = Number(value.substring(0, 2));
  const month = Number(value.substring(2, 4));
  const day = Number(value.substring(4, 6));

  if (month < 1 || month > 12) {
    return "Invalid month in Employee ID.";
  }

  if (day < 1 || day > 31) {
    return "Invalid day in Employee ID.";
  }

  const fullYear = 2000 + year;

  const employeeDate = new Date(
    fullYear,
    month - 1,
    day
  );

  if (
    employeeDate.getFullYear() !== fullYear ||
    employeeDate.getMonth() !== month - 1 ||
    employeeDate.getDate() !== day
  ) {
    return "Invalid date in Employee ID.";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  employeeDate.setHours(0, 0, 0, 0);

  if (employeeDate > today) {
    return "Future date Employee IDs are not allowed.";
  }

  const employeeNumber = value.substring(6);

  if (employeeNumber === "000") {
    return "Employee number cannot be 000.";
  }

  return "";
};

// =====================================================
// VALIDATE EMAIL
// =====================================================

const validateEmail = (value) => {
  if (value.length === 0) {
    return "Please enter your Email.";
  }

  if (/\s/.test(value)) {
    return "Spaces are not allowed.";
  }

  if (value.length > 50) {
    return "Email is too long.";
  }

  const emailPattern =
    /^([0-9]{9})a@gmail\.com$/;

  const match = value.match(emailPattern);

  if (!match) {
    return "Email must be in this format: YYMMDDXXXa@gmail.com";
  }

  const employeeId = match[1];

  const employeeIdError =
    validateEmployeeId(employeeId);

  if (employeeIdError) {
    return employeeIdError;
  }

  return "";
};

// =====================================================
// CHECK REGISTERED EMAIL
// =====================================================

const isRegisteredEmail = (email) => {
  return Object.prototype.hasOwnProperty.call(
    REGISTERED_EMAILS,
    email
  );
};

// =====================================================
// VALIDATE OTP
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
    special:
      /[!@#$%^&*(),.?":{}|<>_\-+=;'/`~[\]\\]/.test(
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
  if (password.length === 0) {
    return "Please enter a new password.";
  }

  if (password.length > 20) {
    return "Password cannot exceed 20 characters.";
  }

  const requirements =
    getPasswordRequirements(password);

  if (!requirements.noSpaces) {
    return "Password cannot contain spaces.";
  }

  if (!requirements.minLength) {
    return "Password must contain at least 8 characters.";
  }

  if (!requirements.uppercase) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!requirements.lowercase) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!requirements.number) {
    return "Password must contain at least one number.";
  }

  if (!requirements.special) {
    return "Password must contain at least one special character.";
  }

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
// FORMAT TIMER
// =====================================================

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

// =====================================================
// FORGOT PASSWORD COMPONENT
// =====================================================

export default function ForgotPassword({
  onLoginClick,
}) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] =
    useState(false);

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  // ===================================================
  // PASSWORD VISIBILITY
  // ===================================================

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  // ===================================================
  // VALIDATION STATES
  // ===================================================

  const [emailError, setEmailError] =
    useState("");

  const [emailFound, setEmailFound] =
    useState(false);

  const [otpError, setOtpError] =
    useState("");

  const [
    confirmPasswordError,
    setConfirmPasswordError,
  ] = useState("");

  // ===================================================
  // MESSAGES
  // ===================================================

  const [successMessage, setSuccessMessage] =
    useState("");

  const [serverError, setServerError] =
    useState("");

  // Separate from successMessage - that one is shown near the top of the
  // form (reused for "OTP verified" too) and the reset handler immediately
  // clears the email/OTP fields around it, so a "password reset
  // successful" confirmation there was easy to miss. This renders right
  // under the Reset Password button instead, where the user is looking.
  const [resetComplete, setResetComplete] =
    useState(false);

  // ===================================================
  // OTP TIMER
  // ===================================================

  const [otpTimer, setOtpTimer] =
    useState(0);

  // ===================================================
  // LOADING
  // ===================================================

  const [sendingOTP, setSendingOTP] =
    useState(false);

  const [verifyingOTP, setVerifyingOTP] =
    useState(false);

  const [resettingPassword, setResettingPassword] =
    useState(false);

  // ===================================================
  // PASSWORD REQUIREMENTS
  // ===================================================

  const passwordRequirements =
    getPasswordRequirements(newPassword);

  // ===================================================
  // OTP COUNTDOWN
  // ===================================================

  useEffect(() => {
    if (!otpSent || otpTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setOtpTimer((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [otpSent, otpTimer]);

  // ===================================================
  // EMAIL CHANGE
  // ===================================================

  const handleEmailChange = (e) => {
    const value = e.target.value.toLowerCase();

    setEmail(value);

    // Reset OTP flow when email changes
    setOtpSent(false);
    setOtpVerified(false);
    setOtpTimer(0);
    setOtp("");

    setOtpError("");
    setSuccessMessage("");
    setServerError("");
    setResetComplete(false);

    setEmailFound(false);

    // Empty email
    if (value === "") {
      setEmailError("");
      return;
    }

    // Validate format
    const formatError =
      validateEmail(value);

    if (formatError) {
      setEmailError(formatError);
      return;
    }

    // Registered email
    if (isRegisteredEmail(value)) {
      // IMPORTANT:
      // Valid email = NO GREEN MESSAGE
      setEmailFound(true);
      setEmailError("");
    } else {
      // Invalid email = RED MESSAGE
      setEmailFound(false);
      setEmailError("Email does not exist.");
    }
  };

  // ===================================================
  // OTP CHANGE
  // ===================================================

  const handleOTPChange = (e) => {
    const value = e.target.value;

    setOtp(value);
    setOtpVerified(false);

    setOtpError("");
    setSuccessMessage("");
    setServerError("");

    if (value === "") {
      return;
    }

    const error = validateOTP(value);

    setOtpError(error);
  };

  // ===================================================
  // NEW PASSWORD CHANGE
  // ===================================================

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;

    setNewPassword(value);
    setServerError("");

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

  // ===================================================
  // CONFIRM PASSWORD CHANGE
  // ===================================================

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;

    setConfirmPassword(value);
    setServerError("");

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

  // ===================================================
  // SEND OTP
  // ===================================================

  const handleSendOTP = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setServerError("");
    setOtpError("");

    // Validate email
    const emailValidation =
      validateEmail(email);

    if (emailValidation) {
      setEmailError(emailValidation);
      setEmailFound(false);
      return;
    }

    // Check registered email
    if (!isRegisteredEmail(email)) {
      setEmailFound(false);
      setEmailError("Email not found.");
      return;
    }

    // Valid email
    setEmailError("");
    setEmailFound(true);

    setSendingOTP(true);

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
            emailOrId: email,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        setOtpSent(true);
        setOtpVerified(false);

        setOtpTimer(OTP_EXPIRY_SECONDS);

        setOtp("");
        setOtpError("");

        // No setSuccessMessage here - the countdown note right above the
        // OTP field ("An OTP has been sent to your email. It expires in
        // ...") already says this, live and more precisely. Showing both
        // was redundant, and worse, the two disagreed (this one echoed the
        // backend's static "It expires in 10 minutes" text while the
        // countdown below it counted down from 3).
        setServerError("");
      } else {
        setOtpSent(false);
        setOtpVerified(false);
        setOtpTimer(0);

        // IMPORTANT:
        // Never put backend error under Email
        setEmailError("");

        if (response.status === 429) {
          setServerError(
            "Too many attempts. Please try again later."
          );
        } else {
          setServerError(
            data.message ||
              "Unable to send OTP."
          );
        }
      }
    } catch (error) {
      console.error(
        "Send OTP error:",
        error
      );

      // Keep email clean
      setEmailError("");

      setServerError(
        "Unable to connect to server. Please make sure the backend is running."
      );
    } finally {
      setSendingOTP(false);
    }
  };

  // ===================================================
  // VERIFY OTP
  // ===================================================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setServerError("");

    // Validate email
    const emailValidation =
      validateEmail(email);

    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }

    // Registered email
    if (!isRegisteredEmail(email)) {
      setEmailFound(false);
      setEmailError("Email not found.");
      return;
    }

    // Validate OTP
    const otpValidation =
      validateOTP(otp);

    if (otpValidation) {
      setOtpError(otpValidation);
      return;
    }

    if (!otpSent) {
      setOtpError(
        "Please request an OTP first."
      );
      return;
    }

    if (otpTimer <= 0) {
      setOtpError(
        "OTP has expired. Please request a new OTP."
      );
      return;
    }

    setEmailError("");
    setOtpError("");

    setVerifyingOTP(true);

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
            emailOrId: email,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        setOtpVerified(true);

        setSuccessMessage(
          data.message ||
            "OTP verified successfully."
        );

        setOtpError("");
        setServerError("");
      } else {
        setOtpVerified(false);

        setOtpError(
          data.message ||
            "Invalid OTP."
        );
      }
    } catch (error) {
      console.error(
        "Verify OTP error:",
        error
      );

      setOtpVerified(false);

      setServerError(
        "Unable to connect to server. Please make sure the backend is running."
      );
    } finally {
      setVerifyingOTP(false);
    }
  };

  // ===================================================
  // RESET PASSWORD
  // ===================================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setServerError("");

    // Validate email
    const emailValidation =
      validateEmail(email);

    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }

    // Registered email
    if (!isRegisteredEmail(email)) {
      setEmailFound(false);
      setEmailError("Email not found.");
      return;
    }

    // Validate OTP
    const otpValidation =
      validateOTP(otp);

    if (otpValidation) {
      setOtpError(otpValidation);
      return;
    }

    if (!otpSent) {
      setOtpError(
        "Please request an OTP first."
      );
      return;
    }

    if (!otpVerified) {
      setOtpError(
        "Please verify OTP before resetting password."
      );
      return;
    }

    if (otpTimer <= 0) {
      setOtpError(
        "OTP has expired. Please request a new OTP."
      );
      return;
    }

    // Validate password
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
      } else {
        setServerError(
          passwordValidation
        );
      }

      return;
    }

    setEmailError("");
    setOtpError("");
    setConfirmPasswordError("");

    setResettingPassword(true);

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
            emailOrId: email,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        setSuccessMessage(
          data.message ||
            "Password reset successfully."
        );

        setResetComplete(true);

        // Clear form
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");

        setEmailError("");
        setOtpError("");
        setConfirmPasswordError("");

        setEmailFound(false);
        setOtpSent(false);
        setOtpVerified(false);
        setOtpTimer(0);

        setServerError("");

        if (onLoginClick) {
          setTimeout(() => {
            onLoginClick();
          }, 2500);
        }
      } else {
        setServerError(
          data.message ||
            "Unable to reset password."
        );
      }
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      setServerError(
        "Unable to connect to server. Please make sure the backend is running."
      );
    } finally {
      setResettingPassword(false);
    }
  };

  // ===================================================
  // BACK TO LOGIN
  // ===================================================

  const handleBackToLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    }
  };

  // ===================================================
  // UI
  // ===================================================

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
            placeholder="Enter your Email (e.g. YYMMDDXXXa@gmail.com)"
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

          {/* ONLY RED EMAIL ERRORS */}

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

          {/* ==========================================
              SEND OTP
          ========================================== */}

          <button
            type="button"
            className="action-btn"
            onClick={handleSendOTP}
            disabled={sendingOTP}
          >
            {sendingOTP
              ? "Sending..."
              : "Send OTP"}
          </button>

          {/* ==========================================
              SUCCESS MESSAGE
          ========================================== */}

          {successMessage && (
            <div
              style={{
                color: "#188038",
                fontSize: "12px",
                marginTop: "7px",
              }}
            >
              ✓ {successMessage}
            </div>
          )}

          {/* ==========================================
              SERVER ERROR
          ========================================== */}

          {serverError && (
            <div
              style={{
                color: "#d93025",
                fontSize: "12px",
                marginTop: "7px",
              }}
            >
              ⚠️ {serverError}
            </div>
          )}

          {/* ==========================================
              OTP
          ========================================== */}

          <label>Enter OTP</label>

          {otpSent && (
            <div
              style={{
                color:
                  otpTimer > 0
                    ? "#5f6368"
                    : "#d93025",
                fontSize: "12px",
                marginBottom: "5px",
              }}
            >
              {otpTimer > 0
                ? `An OTP has been sent to your email. It expires in ${formatTime(
                    otpTimer
                  )}.`
                : "OTP has expired. Please request a new OTP."}
            </div>
          )}

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
            disabled={verifyingOTP}
          >
            {verifyingOTP
              ? "Verifying..."
              : "Verify OTP"}
          </button>

          {/* OTP VERIFIED */}

          {otpVerified && (
            <div
              style={{
                color: "#188038",
                fontSize: "12px",
                marginTop: "5px",
              }}
            >
              ✓ OTP verified
            </div>
          )}

          {/* ==========================================
              RESEND OTP
          ========================================== */}

          {otpSent && (
            <button
              type="button"
              className="link-btn"
              onClick={handleSendOTP}
              disabled={
                otpTimer > 0 || sendingOTP
              }
              style={{
                background: "none",
                border: "none",
                color:
                  otpTimer > 0
                    ? "#9aa0a6"
                    : "#1a73e8",
                fontSize: "13px",
                cursor:
                  otpTimer > 0 ||
                  sendingOTP
                    ? "default"
                    : "pointer",
                padding: "5px 0",
                textAlign: "left",
              }}
            >
              {otpTimer > 0
                ? `Resend OTP in ${formatTime(
                    otpTimer
                  )}`
                : "Didn't get it? Resend OTP"}
            </button>
          )}

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
              PASSWORD REQUIREMENTS
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
            disabled={resettingPassword}
          >
            {resettingPassword
              ? "Resetting..."
              : "Reset Password"}
          </button>

          {resetComplete && (
            <div
              style={{
                color: "#188038",
                fontSize: "13px",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              ✓ Password reset successful! Redirecting to login...
            </div>
          )}

          {/* ==========================================
              BACK TO LOGIN — BOTTOM
          ========================================== */}

          <button
            type="button"
            className="back-login-btn"
            onClick={handleBackToLogin}
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "8px 12px",
              background: "#ffffff",
              border: "1px solid #dadce0",
              borderRadius: "4px",
              color: "#333333",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            ← Back to Login
          </button>

        </form>
      </div>

      {/* ==========================================
          FOOTER
      ========================================== */}

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
