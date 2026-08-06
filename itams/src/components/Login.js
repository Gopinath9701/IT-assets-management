import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "../App.css";

export default function Login({ onForgotPasswordClick, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    employeeIdOrEmail: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const input = formData.employeeIdOrEmail.trim();
    const password = formData.password;

    // Empty Validation
    if (!input) {
      alert("Please enter Employee ID or Email.");
      return;
    }

    if (!password) {
      alert("Please enter Password.");
      return;
    }

    // Maximum Length
    if (input.length > 100) {
      alert("Input is too long.");
      return;
    }

    // Spaces
    if (/\s/.test(input)) {
      alert("Spaces are not allowed.");
      return;
    }

    // Dangerous Characters
    if (/[<>'"`;(){}[\]\\]/.test(input)) {
      alert("Invalid characters are not allowed.");
      return;
    }

    // ================= EMAIL =================
    if (input.includes("@")) {

      if (!input.endsWith("@gmail.com")) {
        alert("Email must end with @gmail.com.");
        return;
      }

      const username = input.split("@")[0];

      if (username.length < 3) {
        alert("Email username must contain at least 3 characters.");
        return;
      }

      if (input.includes("..")) {
        alert("Email cannot contain consecutive dots.");
        return;
      }

      const emailRegex = /^[A-Za-z0-9._%+-]{3,}@gmail\.com$/;

      if (!emailRegex.test(input)) {
        alert("Please enter a valid Gmail address.");
        return;
      }

    }

    // ================= EMPLOYEE ID =================
    else {

      if (!input.startsWith("EMP")) {
        alert("Employee ID must start with 'EMP' in uppercase.");
        return;
      }

      if (input.length < 6) {
        alert("Employee ID must be exactly 6 characters long.");
        return;
      }

      if (input.length > 6) {
        alert("Employee ID cannot exceed 6 characters.");
        return;
      }

      const lastThree = input.substring(3);

      if (!/^[A-Za-z0-9]{3}$/.test(lastThree)) {
        alert("Last 3 characters can contain only letters and numbers.");
        return;
      }

    }

    // Password Validation
    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    if (password.length > 20) {
      alert("Password cannot exceed 20 characters.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeIdOrEmail: input,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("User:", data.user);
        if (onLoginSuccess) onLoginSuccess(data.user?.name || data.user?.employeeId || "Admin");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error("Login Error:", error);
      // Allow demo navigation even without a backend
      if (onLoginSuccess) onLoginSuccess("Admin");
    }

  };

  return (
    <div className="login-card">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <label>Employee ID or Email</label>
        <input
          type="text"
          name="employeeIdOrEmail"
          placeholder="Enter your Employee ID or Gmail"
          value={formData.employeeIdOrEmail}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide Password" : "Show Password"}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>

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

        <button type="submit">Login</button>

      </form>
    </div>
  );
}
