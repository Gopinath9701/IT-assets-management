import "./index.css";
import { useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import AssetManagement from "./components/AssetManagement";
import HRManagement from "./components/HRManagement";
import AddEmployee from "./components/AddEmployee";
import UpdateEmployee from "./components/UpdateEmployee";
import ViewEmployeeList from "./components/ViewEmployeeList";
import EmployeeStatus from "./components/EmployeeStatus";
import DepartmentManagement from "./components/DepartmentManagement";
import ReportMaintenance from "./components/ReportMaintenance";

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
  onAddEmployee={() => setView("add-employee")}
  onUpdateEmployee={() => setView("update-employee")}
  onViewEmployeeList={() => setView("view-employee-list")}
  onEmployeeStatus={() => setView("employee-status")}
  onDepartmentManagement={() => setView("department-management")}
  onReportMaintenance={() => setView("report-maintenance")}
/>
)}

{view === "add-employee" && (
  <AddEmployee
    username="username"
    onLogout={() => setView("home")}
    onBack={() => setView("hr-management")}
  />
)}

{view === "view-employee-list" && (
  <ViewEmployeeList
    username="username"
    onLogout={() => setView("home")}
    onBack={() => setView("hr-management")}
  />
)}

{view === "employee-status" && (
  <EmployeeStatus
    username="username"
    onLogout={() => setView("home")}
    onBack={() => setView("hr-management")}
  />
)}

{view === "department-management" && (
  <DepartmentManagement
    username="username"
    onLogout={() => setView("home")}
    onBack={() => setView("hr-management")}
  />
)}

{view === "update-employee" && (
  <UpdateEmployee
    username="username"
    onLogout={() => setView("home")}
    onBack={() => setView("hr-management")}
  />
)}
{view === "report-maintenance" && (
  <ReportMaintenance
    username="username"
    onLogout={() => setView("home")}
    onBack={() => setView("hr-management")}
  />
)}

</div>
);
}

export default App;