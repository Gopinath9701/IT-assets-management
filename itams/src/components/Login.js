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
// IMPORTANT:
// - Today and past dates are allowed
// - Future dates are NOT allowed
// - Exactly 9 digits
// - No spaces
// - Employee number cannot be 000
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

  // YYMMDD
  const year = Number(value.substring(0, 2));
  const month = Number(value.substring(2, 4));
  const day = Number(value.substring(4, 6));

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

  // Future date validation
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  employeeDate.setHours(0, 0, 0, 0);

  if (employeeDate > today) {
    return "Future date Employee IDs are not allowed.";
  }

  // Employee number
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
// VALIDATE EMPLOYEE ID OR EMAIL
// =====================================================
//
// Employee ID:
// 260821001
//
// Email:
// 260821001a@gmail.com
//
// =====================================================

const validateEmployeeIdOrEmail = (value) => {
  if (value.length === 0) {
    return "Please enter Employee ID or Email.";
  }

  if (/\s/.test(value)) {
    return "Spaces are not allowed.";
  }

  // Employee ID
  if (/^[0-9]+$/.test(value)) {
    return validateEmployeeId(value);
  }

  // Email
  if (value.includes("@")) {
    const emailPattern =
      /^[0-9]{9}a@gmail\.com$/;

    if (!emailPattern.test(value)) {
      return "Email must be in this format: 260821001a@gmail.com";
    }

    // Validate Employee ID part
    const employeeIdPart = value.substring(0, 9);

    const employeeIdError =
      validateEmployeeId(employeeIdPart);

    if (employeeIdError) {
      return employeeIdError;
    }

    return "";
  }

  return "Enter a valid Employee ID or Email.";
};

// =====================================================
// PASSWORD VALIDATION
// =====================================================

const getPasswordRequirements = (password) => {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_\-[\]/`~+=;']/.test(
      password
    ),
    noSpaces: !/\s/.test(password),
  };
};

// =====================================================
// VALIDATE PASSWORD
// =====================================================

const validatePassword = (password) => {
  if (password.length === 0) {
    return "Please enter Password.";
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

  return "";
};

// =====================================================
// PASSWORD REQUIREMENT ITEM
// =====================================================

const PasswordRequirement = ({ valid, children }) => {
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

export default function Login({
  onForgotPasswordClick,
  onLoginSuccess,
}) {
  // ===================================================
  // FORM DATA
  // ===================================================

  const [formData, setFormData] = useState({
    employeeIdOrEmail: "",
    password: "",
  });

  // ===================================================
  // STATES
  // ===================================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [identifierError, setIdentifierError] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [identifierTouched, setIdentifierTouched] =
    useState(false);

  const [passwordTouched, setPasswordTouched] =
    useState(false);

  // ===================================================
  // HANDLE INPUT CHANGE
  // ===================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Employee ID / Email
    if (name === "employeeIdOrEmail") {
      setIdentifierTouched(true);

      if (value === "") {
        setIdentifierError("");
      } else {
        const error =
          validateEmployeeIdOrEmail(value);

        setIdentifierError(error);
      }
    }

    // Password
    if (name === "password") {
      setPasswordTouched(true);

      if (value === "") {
        setPasswordError("");
      } else {
        const error =
          validatePassword(value);

        setPasswordError(error);
      }
    }
  };

  // ===================================================
  // HANDLE LOGIN
  // ===================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const identifier =
      formData.employeeIdOrEmail;

    const password =
      formData.password;

    // Employee ID / Email validation
    const identifierValidation =
      validateEmployeeIdOrEmail(identifier);

    setIdentifierTouched(true);

    if (identifierValidation) {
      setIdentifierError(identifierValidation);
    } else {
      setIdentifierError("");
    }

    // Password validation
    const passwordValidation =
      validatePassword(password);

    setPasswordTouched(true);

    if (passwordValidation) {
      setPasswordError(passwordValidation);
    } else {
      setPasswordError("");
    }

    // Stop if invalid
    if (
      identifierValidation ||
      passwordValidation
    ) {
      return;
    }

    // Login request
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            employeeIdOrEmail: identifier,
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      // Login success
      if (response.ok && data.success) {
        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        console.log(
          "Logged in user:",
          data.user
        );

        alert("Login Successful");

        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }

      // Login failed
      else {
        alert(
          data.message ||
            "Invalid credentials."
        );
      }
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      alert(
        "Unable to connect to server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // PASSWORD REQUIREMENTS
  // ===================================================

  const passwordRequirements =
    getPasswordRequirements(
      formData.password
    );

  // ===================================================
  // LOGIN UI
  // ===================================================

  return (
    <div className="login-card">

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        {/* EMPLOYEE ID OR EMAIL */}

        <label>
          Employee ID or Email
        </label>

        <input
          type="text"
          name="employeeIdOrEmail"
          placeholder="Enter your Employee ID or Email"
          value={formData.employeeIdOrEmail}
          maxLength={29}
          onChange={handleChange}
          required
          className={
            identifierError &&
            identifierTouched
              ? "input-error"
              : ""
          }
        />

        {identifierError &&
          identifierTouched && (
            <div
              style={{
                color: "#d93025",
                fontSize: "12px",
                marginTop: "5px",
              }}
            >
              ⚠️ {identifierError}
            </div>
          )}

        {!identifierError &&
          identifierTouched &&
          formData.employeeIdOrEmail && (
            <div
              style={{
                color: "#188038",
                fontSize: "12px",
                marginTop: "5px",
              }}
            >
              ✓ Valid Employee ID or Email
            </div>
          )}

        {/* PASSWORD */}

        <label>
          Password
        </label>

        <div className="password-input-container">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            name="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleChange}
            required
            className={
              passwordError &&
              passwordTouched
                ? "input-error"
                : ""
            }
          />

          <button
            type="button"
            className="password-toggle-btn"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            aria-label={
              showPassword
                ? "Hide Password"
                : "Show Password"
            }
          >
            {showPassword ? (
              <FaRegEyeSlash />
            ) : (
              <FaRegEye />
            )}
          </button>

        </div>

        {/* PASSWORD REQUIREMENTS */}

        {formData.password.length > 0 && (
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

        {/* PASSWORD ERROR */}

        {passwordError &&
          passwordTouched &&
          formData.password.length > 0 && (
            <div
              style={{
                color: "#d93025",
                fontSize: "12px",
                marginBottom: "8px",
              }}
            >
              ⚠️ {passwordError}
            </div>
          )}

        {/* FORGOT PASSWORD */}

        <a
          href="/forgot-password"
          className="forgot-password-link"
          onClick={(e) => {
            e.preventDefault();

            if (onForgotPasswordClick) {
              onForgotPasswordClick();
            }
          }}
        >
          Forgot Password?
        </a>

        {/* LOGIN BUTTON */}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

      </form>

    </div>
  );
}
