import "./index.css";
import { useState } from "react";

import Home from "./components/Home";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";

import Dashboard from "./components/Dashboard";

import AssetRequest from "./components/AssetRequest";
import AssetManagement from "./components/AssetManagement";
import AssetInventory from "./components/AssetInventory";
import AssetReturn from "./components/AssetReturn";
import RequestApproval from "./components/RequestApproval";
import Maintenance from "./components/Maintenance";

import HRManagement from "./components/HRManagement";
import AddEmployee from "./components/AddEmployee";
import UpdateEmployee from "./components/UpdateEmployee";
import ViewEmployeeList from "./components/ViewEmployeeList";
import EmployeeStatus from "./components/EmployeeStatus";
import DepartmentManagement from "./components/DepartmentManagement";
import ReportMaintenance from "./components/ReportMaintenance";

import AddAsset from "./components/AddAsset";

function App() {

  const [view, setView] = useState("home");
  const [activeTab, setActiveTab] = useState("home");

  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error(
          "Unable to read saved user",
          error
        );

        return null;
      }
    }

    return null;
  });


  const username =
    user?.name ||
    user?.email ||
    user?.loginId ||
    "username";


  // =====================================================
  // DASHBOARD
  // =====================================================

  const handleDashboard = () => {

    setActiveTab("dashboard");
    setView("dashboard");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =====================================================
  // ASSET MANAGEMENT
  // =====================================================

  const handleAssetManagement = () => {

    setView("asset-management");
    setActiveTab("asset-management");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =====================================================
  // ASSET ASSIGNMENT
  // =====================================================

  const handleAssetAssignment = () => {

    setView("asset-management");
    setActiveTab("asset-assignment");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =====================================================
  // REQUEST APPROVAL
  // =====================================================

  const handleRequestApproval = () => {
    setView("request-approval");
    setActiveTab("request-approval");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMaintenance = () => {
    setView("maintenance");
    setActiveTab("maintenance");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  // =====================================================
  // TEMPORARY LOGIN
  // =====================================================

  const handleTemporaryLogin = () => {

    const temporaryUser = {
      name: "Demo User",
      email: "260819001@gmail.com",
      loginId: "260819001",
      employeeId: "260819001",
      role: "HR",
    };

    setUser(temporaryUser);

    localStorage.setItem(
      "user",
      JSON.stringify(temporaryUser)
    );

    setView("hr-management");
  };


  // =====================================================
  // HOME SECTIONS
  // =====================================================

  const scrollToSection = (id) => {

    setActiveTab(id);

    if (view !== "home") {

      setView("home");

      setTimeout(() => {

        const section =
          document.getElementById(id);

        if (section) {

          section.scrollIntoView({
            behavior: "smooth",
          });

        }

      }, 100);

    } else {

      const section =
        document.getElementById(id);

      if (section) {

        section.scrollIntoView({
          behavior: "smooth",
        });

      }

    }
  };


  // =====================================================
  // LOGIN SUCCESS
  // =====================================================

  const handleLoginSuccess = (loggedInUser) => {

    console.log(
      "Logged-in user:",
      loggedInUser
    );

    setUser(loggedInUser);

    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );


    if (loggedInUser.role === "HR") {

      setView("hr-management");
      setActiveTab("hr-management");

    }

    else if (
      loggedInUser.role === "AssetManager"
    ) {

      setView("dashboard");
      setActiveTab("dashboard");

    }

    else if (
      loggedInUser.role === "AssetInventory" ||
      loggedInUser.role === "InventoryManager"
    ) {

      setView("asset-inventory");
      setActiveTab("asset-inventory");

    }

    else {

      console.error(
        "Unknown user role:",
        loggedInUser.role
      );

      alert(
        "Unknown user role: " +
        loggedInUser.role
      );

      setView("home");
      setActiveTab("home");

    }
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setView("home");
    setActiveTab("home");
  };


  // =====================================================
  // HOME
  // =====================================================

  const handleHome = () => {

    setView("home");
    setActiveTab("home");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =====================================================
  // ASSET INVENTORY
  // =====================================================

  const handleAssetInventory = () => {

    setView("asset-inventory");
    setActiveTab("asset-inventory");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =====================================================
  // HR MANAGEMENT
  // =====================================================

  const handleHRManagement = () => {

    setView("hr-management");
    setActiveTab("hr-management");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  return (
    <div>

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="navbar">

        <div
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() =>
            scrollToSection("home")
          }
        >

          <h1>ITAMS</h1>

          <p>
            IT Asset Management System
          </p>

        </div>


        {/* HOME NAVIGATION */}

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


        {/* =================================================
            LOGIN BUTTON
        ================================================= */}

        {!user && view === "home" && (

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


        {/* =================================================
            LOGGED-IN NAVIGATION
        ================================================= */}

        {user &&
          view !== "home" &&
          view !== "login" &&
          view !== "forgot-password" && (

            <div className="nav-buttons">

              <button
                type="button"
                className="outline-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>

          )}

      </nav>


      {/* =================================================
          LOGIN
      ================================================= */}

      {view === "login" && (

        <Login
          onForgotPasswordClick={() =>
            setView("forgot-password")
          }
          onLoginSuccess={
            handleLoginSuccess
          }
        />

      )}


      {/* =================================================
          FORGOT PASSWORD
      ================================================= */}

      {view === "forgot-password" && (

        <ForgotPassword
          onLoginClick={() =>
            setView("login")
          }
        />

      )}


      {/* =================================================
          HOME
      ================================================= */}

      {view === "home" && (

        <Home
          onLoginClick={() =>
            setView("login")
          }
        />

      )}


      {/* =================================================
          DASHBOARD
      ================================================= */}

      {view === "dashboard" && (

        <Dashboard

          username={username}

          onLogout={handleLogout}

          onNavigateToDashboard={
            handleDashboard
          }

          onNavigateToAssetManagement={
            handleAssetManagement
          }

          onNavigateToAssetAssignment={
            handleAssetAssignment
          }

          onNavigateToRequestApproval={
            handleRequestApproval
          }

          onNavigateToMaintenance={
            handleMaintenance
          }

        />

      )}


      {/* =================================================
          ASSET INVENTORY
      ================================================= */}

      {view === "asset-inventory" && (

        <AssetInventory

          username={username}

          onLogout={handleLogout}

          onBack={handleHome}

        />

      )}


      {/* =================================================
          ASSET MANAGEMENT
      ================================================= */}

      {view === "asset-management" && (

        <AssetManagement

          username={username}

          onLogout={handleLogout}

          onNavigateToDashboard={
            handleDashboard
          }

          onNavigateToAddAsset={() =>
            setView("add-asset")
          }

          onNavigateToAssetReturn={() =>
            setView("asset-return")
          }

        />

      )}


      {/* =================================================
          ADD ASSET
      ================================================= */}

      {view === "add-asset" && (

        <AddAsset

          username={username}

          onLogout={handleLogout}

          onBack={() =>
            setView("asset-management")
          }

        />

      )}


      {/* =================================================
          ASSET RETURN
      ================================================= */}

      {view === "asset-return" && (

        <AssetReturn

          username={username}

          onLogout={handleLogout}

          onBack={() =>
            setView("asset-management")
          }

        />

      )}


      {/* =================================================
          HR MANAGEMENT
      ================================================= */}

      {view === "hr-management" && (

        <HRManagement

          username={username}

          onLogout={handleLogout}

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


      {/* =================================================
          ADD EMPLOYEE
      ================================================= */}

      {view === "add-employee" && (

        <AddEmployee

          username={username}

          onLogout={handleLogout}

          onBack={() =>
            setView("hr-management")
          }

        />

      )}


      {/* =================================================
          VIEW EMPLOYEE LIST
      ================================================= */}

      {view === "view-employee-list" && (

        <ViewEmployeeList

          username={username}

          onLogout={handleLogout}

          onBack={() =>
            setView("hr-management")
          }

        />

      )}


      {/* =================================================
          EMPLOYEE STATUS
      ================================================= */}

      {view === "employee-status" && (

        <EmployeeStatus

          username={username}

          onLogout={handleLogout}

          onBack={() =>
            setView("hr-management")
          }

        />

      )}


      {/* =================================================
          DEPARTMENT MANAGEMENT
      ================================================= */}

      {view === "department-management" && (

        <DepartmentManagement

          username={username}

          onLogout={handleLogout}

          onBack={() =>
            setView("hr-management")
          }

        />

      )}


      {/* =================================================
          UPDATE EMPLOYEE
      ================================================= */}

      {view === "update-employee" && (

        <UpdateEmployee

          username={username}

          onLogout={handleLogout}

          onBack={() =>
            setView("hr-management")
          }

        />

      )}


      {/* =================================================
          REPORT MAINTENANCE
      ================================================= */}

      {view === "report-maintenance" && (

        <ReportMaintenance

          username={username}

          onLogout={handleLogout}

          onBack={() =>
            setView("hr-management")
          }

        />

      )}


      {/* =================================================
          ASSET REQUEST
      ================================================= */}

      {view === "asset-request" && (

        <AssetRequest

          username={username}

          onLogout={handleLogout}

          onBack={() =>
            setView("hr-management")
          }

        />

      )}

      {/* =================================================
          REQUEST APPROVAL
      ================================================= */}

      {view === "request-approval" && (

        <RequestApproval

          username={username}

          onLogout={handleLogout}

          onBack={() =>
            setView("dashboard")
          }

          onSidebarNavigate={(id) => {
            if (id === "dashboard") handleDashboard();
            else if (id === "asset-management") handleAssetManagement();
            else if (id === "asset-assignment") handleAssetAssignment();
            else if (id === "maintenance") handleMaintenance();
          }}

        />

      )}

      {/* =================================================
          MAINTENANCE (Asset Manager view)
      ================================================= */}

      {view === "maintenance" && (

        <Maintenance

          username={username}

          onLogout={handleLogout}

          onBack={() =>
            setView("dashboard")
          }

          onSidebarNavigate={(id) => {
            if (id === "dashboard") handleDashboard();
            else if (id === "asset-management") handleAssetManagement();
            else if (id === "asset-assignment") handleAssetAssignment();
            else if (id === "request-approval") handleRequestApproval();
          }}

        />

      )}

    </div>
  );
}

export default App;
