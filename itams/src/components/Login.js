import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "../App.css"; // or wherever your CSS file is located

export default function Login({ onForgotPasswordClick }) {
  const [formData, setFormData] = useState({
    nameOrEmail: "",
    employeeId: "",
    department: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: connect to backend API with fetch/axios
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
            aria-label={showPassword ? "Hide password" : "Show password"}
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
