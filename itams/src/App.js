import React, { useState } from "react";
import "./index.css";

import Home from "./components/Home";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";

import AssetInventory from "./components/AssetInventory";
import AssetManagement from "./components/AssetManagement";
import HRManagement from "./components/HRManagement";

import AddEmployee from "./components/AddEmployee";
import UpdateEmployee from "./components/UpdateEmployee";
import ViewEmployeeList from "./components/ViewEmployeeList";
import EmployeeStatus from "./components/EmployeeStatus";
import DepartmentManagement from "./components/DepartmentManagement";
import ReportMaintenance from "./components/ReportMaintenance";
import AssetRequest from "./components/AssetRequest";
import AddAsset from "./components/AddAsset";


function App() {

  const [view, setView] = useState("home");
  const [activeTab, setActiveTab] = useState("home");


  // ==============================
  // HOME PAGE NAVIGATION
  // ==============================

  const scrollToSection = (id) => {

    setActiveTab(id);

    if (view !== "home") {

      setView("home");

      setTimeout(() => {

        const section = document.getElementById(id);

        if (section) {
          section.scrollIntoView({
            behavior: "smooth"
          });
        }

      }, 100);

    } else {

      const section = document.getElementById(id);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth"
        });
      }

    }
  };


  return (

    <div>

      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="navbar">

        {/* LOGO */}

        <div
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => scrollToSection("home")}
        >

          <h1>ITAMS</h1>

          <p>
            IT Asset Management System
          </p>

        </div>


        {/* =====================================
            HOME NAVIGATION
        ===================================== */}

        {view === "home" && (

          <ul className="nav-links">

            <li
              className={
                activeTab === "home"
                  ? "active"
                  : ""
              }
              onClick={() =>
                scrollToSection("home")
              }
            >
              Home
            </li>

            <li
              className={
                activeTab === "features"
                  ? "active"
                  : ""
              }
              onClick={() =>
                scrollToSection("features")
              }
            >
              Features
            </li>

            <li
              className={
                activeTab === "about"
                  ? "active"
                  : ""
              }
              onClick={() =>
                scrollToSection("about")
              }
            >
              About Us
            </li>

            <li
              className={
                activeTab === "contact"
                  ? "active"
                  : ""
              }
              onClick={() =>
                scrollToSection("contact")
              }
            >
              Contact
            </li>

          </ul>

        )}


        {/* =====================================
            RIGHT SIDE BUTTONS
            FOR LOGIN / OTHER PAGES
        ===================================== */}

        {view !== "home" && (

          <div className="nav-buttons">

            {/* INVENTORY */}

            <button
              className="outline-btn"
              onClick={() =>
                setView("asset-inventory")
              }
            >
              Invtry
            </button>


            {/* ASSET MANAGEMENT */}

            <button
              className="outline-btn"
              onClick={() =>
                setView("asset-management")
              }
            >
              Asset Mgmt
            </button>


            {/* HR MANAGEMENT */}

            <button
              className="outline-btn"
              onClick={() =>
                setView("hr-management")
              }
            >
              HR Mgmt
            </button>


            {/* HOME */}

            <button
              className="outline-btn"
              onClick={() =>
                setView("home")
              }
            >
              Home
            </button>

          </div>

        )}


        {/* =====================================
            LOGIN BUTTON ON HOME PAGE
        ===================================== */}

        {view === "home" && (

          <div className="nav-buttons">

            <button
              className="outline-btn"
              onClick={() =>
                setView("login")
              }
            >
              Login
            </button>

          </div>

        )}

      </nav>


      {/* =====================================
          HOME
      ===================================== */}

      {view === "home" && (

        <Home
          onLoginClick={() =>
            setView("login")
          }
        />

      )}


      {/* =====================================
          LOGIN
      ===================================== */}

      {view === "login" && (

        <Login

          onForgotPasswordClick={() =>
            setView("forgot-password")
          }

          onLoginSuccess={() =>
            setView("asset-inventory")
          }

        />

      )}


      {/* =====================================
          FORGOT PASSWORD
      ===================================== */}

      {view === "forgot-password" && (

        <ForgotPassword
          onLoginClick={() =>
            setView("login")
          }
        />

      )}


      {/* =====================================
          ASSET INVENTORY
      ===================================== */}

      {view === "asset-inventory" && (

        <AssetInventory

          username="username"

          onLogout={() =>
            setView("home")
          }

          onBack={() =>
            setView("home")
          }

        />

      )}


      {/* =====================================
          ASSET MANAGEMENT
      ===================================== */}

      {view === "asset-management" && (

        <AssetManagement

          username="username"

          onLogout={() =>
            setView("home")
          }

          onNavigateToAddAsset={() =>
            setView("add-asset")
          }

        />

      )}


      {/* =====================================
          ADD ASSET
      ===================================== */}

      {view === "add-asset" && (

        <AddAsset

          username="username"

          onLogout={() =>
            setView("home")
          }

          onBack={() =>
            setView("asset-management")
          }

        />

      )}


      {/* =====================================
          HR MANAGEMENT
      ===================================== */}

      {view === "hr-management" && (

        <HRManagement

          username="username"

          onLogout={() =>
            setView("home")
          }

          onAddEmployee={() =>
            setView("add-employee")
          }

          onUpdateEmployee={() =>
            setView("update-employee")
          }

          onViewEmployeeList={() =>
            setView("view-employee-list")
          }

          onEmployeeStatus={() =>
            setView("employee-status")
          }

          onDepartmentManagement={() =>
            setView("department-management")
          }

          onReportMaintenance={() =>
            setView("report-maintenance")
          }

          onAssetRequest={() =>
            setView("asset-request")
          }

        />

      )}


      {/* =====================================
          ADD EMPLOYEE
      ===================================== */}

      {view === "add-employee" && (

        <AddEmployee
          username="username"
          onLogout={() =>
            setView("home")
          }
          onBack={() =>
            setView("hr-management")
          }
        />

      )}


      {/* =====================================
          VIEW EMPLOYEE LIST
      ===================================== */}

      {view === "view-employee-list" && (

        <ViewEmployeeList
          username="username"
          onLogout={() =>
            setView("home")
          }
          onBack={() =>
            setView("hr-management")
          }
        />

      )}


      {/* =====================================
          EMPLOYEE STATUS
      ===================================== */}

      {view === "employee-status" && (

        <EmployeeStatus
          username="username"
          onLogout={() =>
            setView("home")
          }
          onBack={() =>
            setView("hr-management")
          }
        />

      )}


      {/* =====================================
          DEPARTMENT MANAGEMENT
      ===================================== */}

      {view === "department-management" && (

        <DepartmentManagement
          username="username"
          onLogout={() =>
            setView("home")
          }
          onBack={() =>
            setView("hr-management")
          }
        />

      )}


      {/* =====================================
          UPDATE EMPLOYEE
      ===================================== */}

      {view === "update-employee" && (

        <UpdateEmployee
          username="username"
          onLogout={() =>
            setView("home")
          }
          onBack={() =>
            setView("hr-management")
          }
        />

      )}


      {/* =====================================
          REPORT MAINTENANCE
      ===================================== */}

      {view === "report-maintenance" && (

        <ReportMaintenance
          username="username"
          onLogout={() =>
            setView("home")
          }
          onBack={() =>
            setView("hr-management")
          }
        />

      )}


      {/* =====================================
          ASSET REQUEST
      ===================================== */}

      {view === "asset-request" && (

        <AssetRequest
          username="username"
          onLogout={() =>
            setView("home")
          }
          onBack={() =>
            setView("hr-management")
          }
        />

      )}

    </div>
  );
}


export default App;
