import './App.css';
import { useState } from 'react';
import {
  FaBox,
  FaClipboardList,
  FaTools,
  FaChartBar,
  FaBuilding,
  FaPhone
} from "react-icons/fa";

function App() {

  const [active, setActive] = useState("home");

  const scrollToSection = (id) => {
    setActive(id);

    document.getElementById(id).scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <div>

      <nav className="navbar">

        <div className="logo">
          <h1>ITAMS</h1>
          <p>IT Asset Management System</p>
        </div>

        <ul className="nav-links">

          <li
            className={active === "home" ? "active" : ""}
            onClick={() => scrollToSection("home")}
          >
            Home
          </li>

          <li
            className={active === "features" ? "active" : ""}
            onClick={() => scrollToSection("features")}
          >
            Features
          </li>

          <li
            className={active === "about" ? "active" : ""}
            onClick={() => scrollToSection("about")}
          >
            About Us
          </li>

          <li
            className={active === "contact" ? "active" : ""}
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </li>

        </ul>

        <div className="nav-buttons">
          <button className="outline-btn">Login</button>
          <button className="blue-btn">Register</button>
        </div>

      </nav>

      <section id="home" className="hero">

        <h1>
          IT Asset <br />
          Management System
        </h1>

        <h2>Manage and Track IT Assets Efficiently</h2>

        <p>
          A centralized platform for managing and tracking
          IT assets, inventory, maintenance and reports in one place.
        </p>

        <div className="hero-buttons">
          <button className="blue-btn">Login</button>
          <button className="outline-btn">Register</button>
        </div>

      </section>

      <section id="features" className="section">

        <h2>Features</h2>

        <div className="cards">

          <div className="card">
            <FaBox className="icon" />
            <h3>Asset Management</h3>
            <p>Track and manage all IT assets efficiently.</p>
          </div>

          <div className="card">
            <FaClipboardList className="icon" />
            <h3>Inventory Tracking</h3>
            <p>Monitor asset availability and assignments.</p>
          </div>

          <div className="card">
            <FaTools className="icon" />
            <h3>Maintenance Management</h3>
            <p>Track repairs and maintenance requests.</p>
          </div>

          <div className="card">
            <FaChartBar className="icon" />
            <h3>Reports & Analytics</h3>
            <p>Generate reports and business insights.</p>
          </div>

        </div>

      </section>

      <section id="about" className="section">

        <div className="bottom-row">

          <div className="about-box">
            <FaBuilding className="icon" />
            <h3>About Us</h3>

            <p>
              ITAMS helps organizations manage IT assets,
              improve accountability and simplify tracking.
            </p>
          </div>

          <div id="contact" className="contact-box">
            <FaPhone className="icon" />
            <h3>Contact Us</h3>

            <p>Email: support@itams.com</p>
            <p>Phone: +91 12345 67890</p>
          </div>

        </div>

      </section>

      <footer>
        © 2026 ITAMS. All Rights Reserved.
      </footer>

    </div>
  );
}

export default App;