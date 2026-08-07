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

import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import HRManagement from './components/HRManagement';
import AssetManagement from './components/AssetManagement';
import AddEmployee from './components/AddEmployee';
import UpdateEmployee from './components/UpdateEmployee';
import ViewEmployeeList from './components/ViewEmployeeList';
import EmployeeStatus from './components/EmployeeStatus';
import DepartmentManagement from './components/DepartmentManagement';
import ReportMaintenance from './components/ReportMaintenance';
import AssetRequest from './components/AssetRequest';
import AssetInventory from './components/AssetInventory';
import ManageAsset from './components/ManageAsset';
import AddAsset from './components/AddAsset';
import AssetDetails from './components/AssetDetails';
import EditAsset from './components/EditAsset';
import RequestApproval from './components/RequestApproval';
import AssetAssignment from './components/AssetAssignment';

function App() {
  const [page, setPage] = useState('home');
  const [active, setActive] = useState('home');
  const [username, setUsername] = useState('username');
  const [selectedAsset, setSelectedAsset] = useState(null);

  const scrollToSection = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUsername('username');
    setPage('home');
  };

  // ── Login page ──────────────────────────────────────────────
  if (page === 'login') {
    return (
      <div className="auth-wrapper">
        <nav className="navbar">
          <div className="logo">
            <h1>ITAMS</h1>
            <p>IT Asset Management System</p>
          </div>
          <div className="login-nav-buttons">
            <button
              className="login-nav-btn"
              onClick={() => setPage('hr-management')}
            >
              HR Management
            </button>
            <button
              className="login-nav-btn"
              onClick={() => setPage('asset-management')}
            >
              Asset Management
            </button>
            <button
              className="login-nav-btn"
              onClick={() => setPage('asset-inventory')}
            >
              Asset Inventory
            </button>
          </div>
        </nav>
        <Login
          onForgotPasswordClick={() => setPage('forgot-password')}
          onLoginSuccess={(user) => {
            setUsername(user || 'Admin');
            setPage('hr-management');
          }}
        />
        <footer>© 2026 ITAMS. All Rights Reserved.</footer>
      </div>
    );
  }

  // ── Forgot Password ─────────────────────────────────────────
  if (page === 'forgot-password') {
    return (
      <ForgotPassword onLoginClick={() => setPage('login')} />
    );
  }

  // ── HR Management ───────────────────────────────────────────
  if (page === 'hr-management') {
    return (
      <HRManagement
        username={username}
        onLogout={handleLogout}
        onAddEmployee={() => setPage('add-employee')}
        onUpdateEmployee={() => setPage('update-employee')}
        onViewEmployeeList={() => setPage('view-employee-list')}
        onEmployeeStatus={() => setPage('employee-status')}
        onDepartmentManagement={() => setPage('department-management')}
        onReportMaintenance={() => setPage('report-maintenance')}
        onAssetRequest={() => setPage('asset-request')}
      />
    );
  }

  // ── Asset Management ────────────────────────────────────────
  if (page === 'asset-management') {
    return (
      <AssetManagement
        username={username}
        onLogout={handleLogout}
        onManageAssets={() => setPage('manage-asset')}
        onAddAsset={() => setPage('add-asset')}
        onAssetDetails={() => setPage('asset-details')}
        onRequestApproval={() => setPage('request-approval')}
        onAssetAssignment={() => setPage('asset-assignment')}
      />
    );
  }

  // ── Asset Assignment ──────────────────────────────────────────
  if (page === 'asset-assignment') {
    return (
      <AssetAssignment
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('asset-management')}
        onSidebarNavigate={(id) => {
          if (id === 'asset-management')  setPage('asset-management');
          if (id === 'request-approval')  setPage('request-approval');
        }}
      />
    );
  }

  // ── Request Approval ─────────────────────────────────────────
  if (page === 'request-approval') {
    return (
      <RequestApproval
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('asset-management')}
        onSidebarNavigate={(id) => {
          if (id === 'asset-management') setPage('asset-management');
        }}
      />
    );
  }

  // ── Asset Details ────────────────────────────────────────────
  if (page === 'asset-details') {
    return (
      <AssetDetails
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('asset-management')}
      />
    );
  }

  // ── Add Asset ────────────────────────────────────────────────
  if (page === 'add-asset') {
    return (
      <AddAsset
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('asset-management')}
      />
    );
  }

  // ── Manage Asset ─────────────────────────────────────────────
  if (page === 'manage-asset') {
    return (
      <ManageAsset
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('asset-management')}
        onEditAsset={(asset) => {
          setSelectedAsset(asset);
          setPage('edit-asset');
        }}
      />
    );
  }

  // ── Edit Asset ───────────────────────────────────────────────
  if (page === 'edit-asset') {
    return (
      <EditAsset
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('manage-asset')}
        asset={selectedAsset}
      />
    );
  }

  // ── Asset Inventory ─────────────────────────────────────────
  if (page === 'asset-inventory') {
    return (
      <AssetInventory
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('home')}
      />
    );
  }

  // ── Add Employee ────────────────────────────────────────────
  if (page === 'add-employee') {
    return (
      <AddEmployee onBack={() => setPage('hr-management')} />
    );
  }

  // ── Update Employee ─────────────────────────────────────────
  if (page === 'update-employee') {
    return (
      <UpdateEmployee
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('hr-management')}
      />
    );
  }

  // ── View Employee List ──────────────────────────────────────
  if (page === 'view-employee-list') {
    return (
      <ViewEmployeeList
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('hr-management')}
      />
    );
  }

  // ── Employee Status ─────────────────────────────────────────
  if (page === 'employee-status') {
    return (
      <EmployeeStatus
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('hr-management')}
      />
    );
  }

  // ── Department Management ───────────────────────────────────
  if (page === 'department-management') {
    return (
      <DepartmentManagement
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('hr-management')}
      />
    );
  }

  // ── Report Maintenance ──────────────────────────────────────
  if (page === 'report-maintenance') {
    return (
      <ReportMaintenance
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('hr-management')}
      />
    );
  }

  // ── Asset Request ───────────────────────────────────────────
  if (page === 'asset-request') {
    return (
      <AssetRequest
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('hr-management')}
      />
    );
  }

  // ── Home / Landing page ─────────────────────────────────────
  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <h1>ITAMS</h1>
          <p>IT Asset Management System</p>
        </div>
        <ul className="nav-links">
          <li
            className={active === 'home' ? 'active' : ''}
            onClick={() => scrollToSection('home')}
          >
            Home
          </li>
          <li
            className={active === 'features' ? 'active' : ''}
            onClick={() => scrollToSection('features')}
          >
            Features
          </li>
          <li
            className={active === 'about' ? 'active' : ''}
            onClick={() => scrollToSection('about')}
          >
            About Us
          </li>
          <li
            className={active === 'contact' ? 'active' : ''}
            onClick={() => scrollToSection('contact')}
          >
            Contact
          </li>
        </ul>
        <div className="nav-buttons">
          <button className="outline-btn" onClick={() => setPage('login')}>
            Login
          </button>
        </div>
      </nav>

      <section id="home" className="hero">
        <h1>IT Asset <br /> Management System</h1>
        <h2>Manage and Track IT Assets Efficiently</h2>
        <p>
          A centralized platform for managing and tracking IT assets,
          inventory, maintenance and reports in one place.
        </p>
        <div className="hero-buttons">
          <button className="blue-btn" onClick={() => setPage('login')}>
            Login
          </button>
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

      <footer>© 2026 ITAMS. All Rights Reserved.</footer>
    </div>
  );
}

export default App;
