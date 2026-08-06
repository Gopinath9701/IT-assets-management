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

function App() {
  const [page, setPage] = useState('home');
  const [active, setActive] = useState('home');

  // Logged-in user (set on successful login)
  const [username, setUsername] = useState('username');

  const scrollToSection = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUsername('username');
    setPage('home');
  };

  // ── Page routing ────────────────────────────────────────────
  if (page === 'login') {
    return (
      <div className="auth-wrapper">
        <nav className="navbar">
          <div className="logo">
            <h1>ITAMS</h1>
            <p>IT Asset Management System</p>
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

  if (page === 'forgot-password') {
    return (
      <ForgotPassword onLoginClick={() => setPage('login')} />
    );
  }

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

  if (page === 'asset-management') {
    return (
      <AssetManagement
        username={username}
        onLogout={handleLogout}
      />
    );
  }

  if (page === 'add-employee') {
    return <AddEmployee onBack={() => setPage('hr-management')} />;
  }

  if (page === 'update-employee') {
    return (
      <UpdateEmployee
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('hr-management')}
      />
    );
  }

  if (page === 'view-employee-list') {
    return (
      <ViewEmployeeList
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('hr-management')}
      />
    );
  }

  if (page === 'employee-status') {
    return (
      <EmployeeStatus
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('hr-management')}
      />
    );
  }

  if (page === 'department-management') {
    return (
      <DepartmentManagement
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('hr-management')}
      />
    );
  }

  if (page === 'report-maintenance') {
    return (
      <ReportMaintenance
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('hr-management')}
      />
    );
  }

  if (page === 'asset-request') {
    return (
      <AssetRequest
        username={username}
        onLogout={handleLogout}
        onBack={() => setPage('hr-management')}
      />
    );
  }

  // ── Landing / Home page ─────────────────────────────────────
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
        <h1>
          IT Asset <br />
          Management System
        </h1>
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
