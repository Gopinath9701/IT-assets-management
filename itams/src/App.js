import "./index.css";
import { useState } from "react";

import Home from "./components/Home";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";

import AssetRequest from "./components/AssetRequest";
import AssetManagement from "./components/AssetManagement";
import AssetInventory from "./components/AssetInventory";
import AssetReturn from "./components/AssetReturn";

import HRManagement from "./components/HRManagement";
import AddEmployee from "./components/AddEmployee";
import UpdateEmployee from "./components/UpdateEmployee";
import ViewEmployeeList from "./components/ViewEmployeeList";
import EmployeeStatus from "./components/EmployeeStatus";
import DepartmentManagement from "./components/DepartmentManagement";
import ReportMaintenance from "./components/ReportMaintenance";

import AddAsset from "./components/AddAsset";


function App() {

  // =========================
  // CURRENT PAGE
  // =========================

  const [view, setView] = useState("home");

  const [activeTab, setActiveTab] = useState("home");

  // =========================
  // LOGGED-IN USER
  // =========================

  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem("user");

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


  // ==================================================
  // TEMPORARY LOGIN
  // FOR FRONTEND DEMO WHILE BACKEND IS PENDING
  // ==================================================

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


  // ==================================================
  // NAVIGATION FOR HOME PAGE SECTIONS
  // ==================================================

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

    }

    else {

      const section =
        document.getElementById(id);

      if (section) {

        section.scrollIntoView({
          behavior: "smooth",
        });

      }

    }

  };


  // ==================================================
  // LOGIN SUCCESS
  // ==================================================

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


    // ==================================================
    // ROLE-BASED REDIRECTION
    // ==================================================

    if (loggedInUser.role === "HR") {

      setView("hr-management");

    }

    else if (
      loggedInUser.role === "AssetManager"
    ) {

      setView("asset-management");

    }

    else if (
      loggedInUser.role === "AssetInventory"
    ) {

      setView("asset-inventory");

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

    }

  };


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

    setView("home");

    setActiveTab("home");

  };


  // ==================================================
  // BACK TO HOME
  // ==================================================

  const handleHome = () => {

    setView("home");

    setActiveTab("home");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  return (

    <div>


      {/* ==================================================
          NAVBAR
          ================================================== */}

      <nav className="navbar">


        {/* ================= LOGO ================= */}

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


        {/* ================= HOME NAVIGATION ================= */}

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


        {/* ==================================================
            RIGHT SIDE BUTTONS
            ================================================== */}


        {/* ================= BEFORE LOGIN ================= */}

        {!user &&
          view === "home" && (

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


        {/* ================= AFTER LOGIN ================= */}

        {user &&
          view !== "home" &&
          view !== "login" &&
          view !== "forgot-password" && (

            <div className="nav-buttons">


              {/* INVENTORY */}

              <button
                className="outline-btn"

                style={{
                  fontSize: "12px",
                  padding: "6px 14px",
                }}

                onClick={() =>
                  setView("asset-inventory")
                }
              >
                Invtry
              </button>


              {/* ASSET MANAGEMENT */}

              <button
                className="outline-btn"

                style={{
                  fontSize: "12px",
                  padding: "6px 14px",
                }}

                onClick={() =>
                  setView("asset-management")
                }
              >
                Asset Mgmt
              </button>


              {/* HR MANAGEMENT */}

              <button
                className="outline-btn"

                style={{
                  fontSize: "12px",
                  padding: "6px 14px",
                }}

                onClick={() =>
                  setView("hr-management")
                }
              >
                HR Mgmt
              </button>


              {/* HOME */}

              <button
                className="outline-btn"

                style={{
                  fontSize: "12px",
                  padding: "6px 14px",
                }}

                onClick={handleHome}
              >
                Home
              </button>


              {/* LOGOUT */}

              <button
                className="outline-btn"

                style={{
                  fontSize: "12px",
                  padding: "6px 14px",
                }}

                onClick={handleLogout}
              >
                Logout
              </button>

            </div>

          )}


      </nav>


      {/* ==================================================
          LOGIN PAGE
          ================================================== */}

      {view === "login" && (

        <>

          <Login

            onForgotPasswordClick={() =>
              setView("forgot-password")
            }

            onLoginSuccess={
              handleLoginSuccess
            }

          />

          {/* ==================================================
              TEMPORARY LOGIN
              FRONTEND DEMO ONLY
              ================================================== */}

          <div
            style={{
              textAlign: "center",
              marginTop: "15px",
            }}
          >

            <button
              type="button"
              onClick={handleTemporaryLogin}
              className="outline-btn"
            >
              Temporary Login
            </button>

          </div>

        </>

      )}


      {/* ==================================================
          FORGOT PASSWORD
          ================================================== */}

      {view === "forgot-password" && (

        <ForgotPassword

          onLoginClick={() =>
            setView("login")
          }

        />

      )}


      {/* ==================================================
          HOME PAGE
          ================================================== */}

      {view === "home" && (

        <Home

          onLoginClick={() =>
            setView("login")
          }

        />

      )}


      {/* ==================================================
          ASSET INVENTORY
          ================================================== */}

      {view === "asset-inventory" && (

        <AssetInventory

          username={
            user?.name ||
            user?.email ||
            user?.loginId ||
            "username"
          }

          onLogout={handleLogout}

          onBack={handleHome}

        />

      )}


      {/* ==================================================
          ASSET MANAGEMENT
          ================================================== */}

      {view === "asset-management" && (

        <AssetManagement

          username={
            user?.name ||
            user?.email ||
            user?.loginId ||
            "username"
          }

          onLogout={handleLogout}

          onNavigateToAddAsset={() =>
            setView("add-asset")
          }

          onNavigateToAssetReturn={() =>
            setView("asset-return")
          }

        />

      )}


      {/* ==================================================
          ADD ASSET
          ================================================== */}

      {view === "add-asset" && (

        <AddAsset

          username={
            user?.name ||
            user?.email ||
            user?.loginId ||
            "username"
          }

          onLogout={handleLogout}

          onBack={() =>
            setView("asset-management")
          }

        />

      )}


      {/* ==================================================
          ASSET RETURN
          ================================================== */}

      {view === "asset-return" && (

        <AssetReturn

          username={
            user?.name ||
            user?.email ||
            user?.loginId ||
            "username"
          }

          onLogout={handleLogout}

          onBack={() =>
            setView("asset-management")
          }

        />

      )}


      {/* ==================================================
          HR MANAGEMENT
          ================================================== */}

      {view === "hr-management" && (

        <HRManagement

          username={
            user?.name ||
            user?.email ||
            user?.loginId ||
            "username"
          }

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


      {/* ==================================================
          ADD EMPLOYEE
          ================================================== */}

      {view === "add-employee" && (

        <AddEmployee

          username={
            user?.name ||
            user?.email ||
            user?.loginId ||
            "username"
          }

          onLogout={handleLogout}

          onBack={() =>
            setView("hr-management")
          }

        />

      )}


      {/* ==================================================
          VIEW EMPLOYEE LIST
          ================================================== */}

      {view === "view-employee-list" && (

        <ViewEmployeeList

          username={
            user?.name ||
            user?.email ||
            user?.loginId ||
            "username"
          }

          onLogout={handleLogout}

          onBack={() =>
            setView("hr-management")
          }

        />

      )}


      {/* ==================================================
          EMPLOYEE STATUS
          ================================================== */}

      {view === "employee-status" && (

        <EmployeeStatus

          username={
            user?.name ||
            user?.email ||
            user?.loginId ||
            "username"
          }

          onLogout={handleLogout}

          onBack={() =>
            setView("hr-management")
          }

        />

      )}


      {/* ==================================================
          DEPARTMENT MANAGEMENT
          ================================================== */}

      {view === "department-management" && (

        <DepartmentManagement

          username={
            user?.name ||
            user?.email ||
            user?.loginId ||
            "username"
          }

          onLogout={handleLogout}

          onBack={() =>
            setView("hr-management")
          }

        />

      )}


      {/* ==================================================
          UPDATE EMPLOYEE
          ================================================== */}

      {view === "update-employee" && (

        <UpdateEmployee

          username={
            user?.name ||
            user?.email ||
            user?.loginId ||
            "username"
          }

          onLogout={handleLogout}

          onBack={() =>
            setView("hr-management")
          }

        />

      )}


      {/* ==================================================
          REPORT MAINTENANCE
          ================================================== */}

      {view === "report-maintenance" && (

        <ReportMaintenance

          username={
            user?.name ||
            user?.email ||
            user?.loginId ||
            "username"
          }

          onLogout={handleLogout}

          onBack={() =>
            setView("hr-management")
          }

        />

      )}


      {/* ==================================================
          ASSET REQUEST
          ================================================== */}

      {view === "asset-request" && (

        <AssetRequest

          username={
            user?.name ||
            user?.email ||
            user?.loginId ||
            "username"
          }

          onLogout={handleLogout}

          onBack={() =>
            setView("hr-management")
          }

        />

      )}

    </div>

  );

}


export default App;
