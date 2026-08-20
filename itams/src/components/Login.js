import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "../App.css";

// ========================================
// GENERATE EMPLOYEE ID
// Format: YYMMDD + 3-digit employee number
// Example: 260819001
// ========================================

const generateEmployeeId = (employeeNumber = 1) => {
  const date = new Date();

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const employeeNumberFormatted =
    String(employeeNumber).padStart(3, "0");

  return `${year}${month}${day}${employeeNumberFormatted}`;
};

// ========================================
// VALIDATE EMPLOYEE ID / EMAIL
// ========================================

const validateEmployeeIdOrEmail = (value) => {
  // Empty
  if (value.length === 0) {
    return "Please enter Employee ID or Email.";
  }

  // No spaces or whitespace anywhere
  if (/\s/.test(value)) {
    return "Spaces are not allowed.";
  }

  // ----------------------------------------
  // EMPLOYEE ID
  // Exactly 9 digits
  // Format: YYMMDD001
  // ----------------------------------------

  if (/^\d+$/.test(value)) {
    if (!/^\d{9}$/.test(value)) {
      return "Employee ID must be exactly 9 digits.";
    }

    return "";
  }

  // ----------------------------------------
  // EMAIL
  // Exactly:
  // 9 digits + @gmail.com
  // Example: 260819001@gmail.com
  // ----------------------------------------

  if (value.includes("@")) {
    if (!/^\d{9}@gmail\.com$/.test(value)) {
      return "Email must be in this format: 260819001@gmail.com";
    }

    return "";
  }

  // Anything else is invalid
  return "Enter a valid Employee ID or Email.";
};

// ========================================
// VALIDATE PASSWORD
// ========================================

const validatePassword = (password) => {
  // Empty
  if (password.length === 0) {
    return "Please enter Password.";
  }

  // No spaces
  if (/\s/.test(password)) {
    return "Password cannot contain spaces.";
  }

  // Minimum 8 characters
  if (password.length < 8) {
    return "Password must contain at least 8 characters.";
  }

  // Uppercase
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  // Lowercase
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  // Number
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }

  // Special character
  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;']/.test(password)) {
    return "Password must contain at least one special character.";
  }

  return "";
};

// ========================================
// LOGIN COMPONENT
// ========================================

export default function Login({
  onForgotPasswordClick,
  onLoginSuccess,
}) {

  // ========================================
  // FORM DATA
  // ========================================

  const [formData, setFormData] = useState({
    employeeIdOrEmail: generateEmployeeId(1),
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ========================================
  // HANDLE LOGIN
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // IMPORTANT:
    // Do NOT trim before validation.
    // This makes spaces at the beginning/end invalid.

    const identifier = formData.employeeIdOrEmail;
    const password = formData.password;

    // ========================================
    // EMPLOYEE ID / EMAIL VALIDATION
    // ========================================

    const identifierError =
      validateEmployeeIdOrEmail(identifier);

    if (identifierError) {
      alert(identifierError);
      return;
    }

    // ========================================
    // PASSWORD VALIDATION
    // ========================================

    const passwordError =
      validatePassword(password);

    if (passwordError) {
      alert(passwordError);
      return;
    }

    // ========================================
    // LOGIN REQUEST
    // Only reaches here if ALL validation passes
    // ========================================

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

      // ========================================
      // LOGIN SUCCESS
      // ========================================

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

        // Send user information to App.js
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }

      // ========================================
      // LOGIN FAILED
      // ========================================

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

  // ========================================
  // LOGIN UI
  // ========================================

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
          onChange={handleChange}
          required
        />

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
            {
              showPassword
                ? <FaRegEyeSlash />
                : <FaRegEye />
            }
          </button>

        </div>

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
          {
            loading
              ? "Logging in..."
              : "Login"
          }
        </button>

      </form>

    </div>
  );
}
