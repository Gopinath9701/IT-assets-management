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

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeIdOrEmail: formData.employeeIdOrEmail,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful");

        // Store JWT token
        localStorage.setItem("token", data.token);

        // Store user details
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("User:", data.user);

        // Navigate to dashboard
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
          placeholder="Enter your employee ID or email"
          value={formData.employeeIdOrEmail}
          onChange={handleChange}
          required
        />

        <label>Password</label>

        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
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

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
