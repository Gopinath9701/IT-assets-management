import "./index.css";
import { useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import AssetManagement from "./components/AssetManagement";
import HRManagement from "./components/HRManagement";

function App() {
  const [view, setView] = useState("home"); // "home" | "login" | "forgot-password" | "asset-management" | "hr-management"
  const [activeTab, setActiveTab] = useState("home");

  const scrollToSection = (id) => {
    setActiveTab(id);
    if (view !== "home") {
      setView("home");
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo" style={{ cursor: "pointer" }} onClick={() => scrollToSection("home")}>
          <h1>ITAMS</h1>
          <p>IT Asset Management System</p>
        </div>

        <ul className="nav-links">
          <li
            className={activeTab === "home" ? "active" : ""}
            onClick={() => scrollToSection("home")}
          >
            Home
          </li>
          <li
            className={activeTab === "features" ? "active" : ""}
            onClick={() => scrollToSection("features")}
          >
            Features
          </li>
          <li
            className={activeTab === "about" ? "active" : ""}
            onClick={() => scrollToSection("about")}
          >
            About Us
          </li>
          <li
            className={activeTab === "contact" ? "active" : ""}
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </li>
        </ul>

        {view === "home" && (
          <div className="nav-buttons">
            <button className="outline-btn" onClick={() => setView("login")}>
              Login
            </button>
          </div>
        )}
        {/* Dry-run quick-access buttons */}
        {view !== "home" && (
          <div className="nav-buttons">
            <button className="outline-btn" style={{ fontSize: "12px", padding: "6px 14px" }} onClick={() => setView("asset-management")}>
              Asset Mgmt
            </button>
            <button className="outline-btn" style={{ fontSize: "12px", padding: "6px 14px" }} onClick={() => setView("hr-management")}>
              HR Mgmt
            </button>
            <button className="outline-btn" style={{ fontSize: "12px", padding: "6px 14px" }} onClick={() => setView("home")}>
              Home
            </button>
          </div>
        )}
      </nav>

      {/* View routing */}
      {view === "login" && (
        <Login
          onBack={() => setView("home")}
          onForgotPasswordClick={() => setView("forgot-password")}
        />
      )}

      {view === "forgot-password" && (
        <ForgotPassword onLoginClick={() => setView("login")} />
      )}
      {view === "home" && (
        <Home
          onLoginClick={() => setView("login")}
        />
      )}

      {view === "asset-management" && (
        <AssetManagement
          username="username"
          onLogout={() => setView("home")}
        />
      )}

      {view === "hr-management" && (
        <HRManagement
          username="username"
          onLogout={() => setView("home")}
        />
      )}
    </div>
  );
}

export default App;
