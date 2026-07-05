import React from "react";
import {
  FaCube,
  FaClipboardList,
  FaTools,
  FaChartBar,
  FaBuilding,
  FaPhone,
} from "react-icons/fa";

export default function Home({ onLoginClick }) {
  return (
    <div>
      {/* Hero Section */}
      <section id="home" className="hero">
        <h1>
          IT Asset Management
          <br />
          System
        </h1>
        <h2>Manage and Track IT Assets Efficiently</h2>
        <p>
          A centralized platform for managing assets, inventory, maintenance,
          and reports in one place.
        </p>
        <div className="hero-buttons">
          <button className="blue-btn" onClick={onLoginClick}>
            Login
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section">
        <h2>Features</h2>
        <div className="cards">
          {/* Row 1: 4 cards */}
          <div className="card">
            <div className="card-icon-wrapper">
              <FaCube className="card-icon" />
            </div>
            <div className="card-content">
              <h3>Asset Management</h3>
              <p>Easily add, update and track all IT assets in your organization.</p>
            </div>
          </div>

          <div className="card">
            <div className="card-icon-wrapper">
              <FaClipboardList className="card-icon" />
            </div>
            <div className="card-content">
              <h3>Inventory Tracking</h3>
              <p>Monitor available, in-use and assigned assets in real-time.</p>
            </div>
          </div>

          <div className="card">
            <div className="card-icon-wrapper">
              <FaTools className="card-icon" />
            </div>
            <div className="card-content">
              <h3>Maintenance Management</h3>
              <p>Track maintenance requests, repairs and service history efficiently.</p>
            </div>
          </div>

          <div className="card">
            <div className="card-icon-wrapper">
              <FaChartBar className="card-icon" />
            </div>
            <div className="card-content">
              <h3>Reports & Analytics</h3>
              <p>Generate detailed reports and gain valuable insights with analytics.</p>
            </div>
          </div>

          {/* Row 2: 2 cards */}
          <div className="card" id="about">
            <div className="card-icon-wrapper">
              <FaBuilding className="card-icon" />
            </div>
            <div className="card-content">
              <h3>About Us</h3>
              <p>
                ITAMS helps organizations efficiently manage IT assets, reduce
                manual work, improve accountability and make data-driven
                decisions. Our platform is secure, reliable and user-friendly.
              </p>
            </div>
          </div>

          <div className="card" id="contact">
            <div className="card-icon-wrapper">
              <FaPhone className="card-icon" />
            </div>
            <div className="card-content">
              <h3>Contact Us</h3>
              <p>Email: support@itams.com</p>
              <p>Phone: +91 12345 67890</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>© 2026 ITAMS</footer>
    </div>
  );
}
