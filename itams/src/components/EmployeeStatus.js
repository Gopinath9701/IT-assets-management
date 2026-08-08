import React, { useState } from "react";
import "./EmployeeStatus.css";

const PAGE_SIZE_OPTIONS = [10, 30, 50, "All"];

// Validation function for Employee ID
const validateEmployeeId = (id) => {
  if (!id || id.trim() === "") {
    return { isValid: false, message: "Employee ID is required" };
  }

  if (id !== id.trim()) {
    return { isValid: false, message: "Employee ID should not have leading or trailing spaces" };
  }

  if (/\s/.test(id)) {
    return { isValid: false, message: "Employee ID should not contain spaces" };
  }

  if (/[^A-Za-z0-9]/.test(id)) {
    return { isValid: false, message: "Employee ID should not contain special characters" };
  }

  if (!id.startsWith("EMP")) {
    return { isValid: false, message: "Employee ID must start with 'EMP'" };
  }

  if (id.length !== 6) {
    return { isValid: false, message: "Employee ID must be exactly 6 characters long (EMP + 3 alphanumeric characters)" };
  }

  const lastThree = id.substring(3);
  if (!/^[A-Za-z0-9]{3}$/.test(lastThree)) {
    return { isValid: false, message: "Last 3 characters must be alphanumeric (letters or numbers)" };
  }

  return { isValid: true, message: "" };
};

// Check if input looks like an Employee ID
const isEmployeeIdFormat = (value) => {
  return value.startsWith("EMP") || value.length >= 3;
};

const EmployeeStatus = ({ username = "username", onLogout, onBack }) => {
  const [search, setSearch] = useState("");
  const [searchApplied, setSearchApplied] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [validationError, setValidationError] = useState("");
  const [isSearchValid, setIsSearchValid] = useState(true);
  const [isSearchTouched, setIsSearchTouched] = useState(false);

  const [employees, setEmployees] = useState([
    { id: "EMP001", name: "Employee 1", department: "IT", status: "Active" },
    { id: "EMP002", name: "Employee 2", department: "HR", status: "On Leave" },
    { id: "EMP003", name: "Employee 3", department: "Finance", status: "Inactive" },
    { id: "EMP004", name: "Employee 4", department: "Marketing", status: "Active" },
    { id: "EMP005", name: "Employee 5", department: "IT", status: "On Leave" },
    { id: "EMP006", name: "Employee 6", department: "Sales", status: "Inactive" },
    { id: "EMP007", name: "Employee 7", department: "Operations", status: "Active" },
    { id: "EMP008", name: "Employee 8", department: "Finance", status: "On Leave" },
  ]);

  // Handle search input change with validation
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setIsSearchTouched(false);

    if (value.trim() === "") {
      setIsSearchValid(true);
      setValidationError("");
    } else {
      // Only validate if it looks like an Employee ID
      if (isEmployeeIdFormat(value)) {
        const result = validateEmployeeId(value);
        setIsSearchValid(result.isValid);
        setValidationError(result.message);
      } else {
        // It's a name search, no validation needed
        setIsSearchValid(true);
        setValidationError("");
      }
    }
  };

  // Handle search with validation (FIXED)
  const handleSearch = () => {
    setIsSearchTouched(true);

    const rawValue = search; // untrimmed, so we can catch stray leading/trailing spaces

    if (rawValue.trim() === "") {
      setValidationError("Please enter an Employee ID or Employee Name to search");
      setIsSearchValid(false);
      setSearchApplied(""); // blank search -> show full table
      return;
    }

    // Heuristic: does this look like someone TRYING to type an Employee ID?
    // Strip spaces so "EMP 001" / " EMP001" / "EMP001 " are still recognized as ID attempts,
    // but cap the length so real names like "Employee 1" aren't misdetected as an ID.
    const stripped = rawValue.replace(/\s/g, "").toUpperCase();
    const looksLikeEmpId = stripped.startsWith("EMP") && stripped.length <= 7;

    if (looksLikeEmpId) {
      const result = validateEmployeeId(rawValue); // validate the RAW value, spaces included
      if (result.isValid) {
        setSearchApplied(rawValue);
        setValidationError("");
        setIsSearchValid(true);
      } else {
        setValidationError(result.message);
        setIsSearchValid(false);
        setSearchApplied(null); // invalid ID -> show NO results
      }
      return;
    }

    // Otherwise, treat it purely as a name search — never matches against IDs
    const searchValue = rawValue.trim();
    if (searchValue.length >= 2) {
      setSearchApplied(searchValue);
      setValidationError("");
      setIsSearchValid(true);
    } else {
      setValidationError("Please enter at least 2 characters for name search");
      setIsSearchValid(false);
      setSearchApplied(null); // too short -> show NO results
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Filter employees based on search
  // searchApplied === null means "invalid search, show nothing"
  // searchApplied === ""   means "blank search, show everything"
  const filteredEmployees =
    searchApplied === null
      ? []
      : employees.filter(
          (emp) =>
            emp.id.toLowerCase().includes(searchApplied.toLowerCase()) ||
            emp.name.toLowerCase().includes(searchApplied.toLowerCase())
        );

  const visibleEmployees =
    pageSize === "All"
      ? filteredEmployees
      : filteredEmployees.slice(0, Number(pageSize));

  // Update employee status
  const changeStatus = (empId, value) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === empId ? { ...e, status: value } : e))
    );
  };

  // Handle status update with confirmation
  const handleUpdateStatus = (empId, newStatus) => {
    changeStatus(empId, newStatus);
    alert(`✅ Status updated to "${newStatus}" successfully!`);
  };

  // Get status badge class
  const getStatusClass = (status) => {
    return `es-status-${status.toLowerCase().replace(" ", "-")}`;
  };

  return (
    <div className="es-page">

      {/* Navbar */}
      <nav className="es-nav">
        <div className="es-nav-logo">
          <span className="es-nav-title">ITAMS</span>
          <span className="es-nav-sub">IT Asset Management System</span>
        </div>
        <div className="es-nav-right">
          <span className="es-nav-user">{username}</span>
          <span className="es-nav-divider">|</span>
          <button className="es-logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      {/* Body */}
      <div className="es-body">

        <h1 className="es-page-title">Employee Status</h1>
        <p className="es-page-sub">View and update employee status.</p>

        {/* Search Card with Validation */}
        <div className="es-card">
          <h2 className="es-card-title">Search Employee</h2>
          <div className="es-search-group">
            <div className="es-search-row">
              <input
                className={`es-input ${!isSearchValid && isSearchTouched ? "es-input-error" : ""}`}
                type="text"
                placeholder="Enter Employee ID or Employee Name"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                aria-invalid={!isSearchValid}
                aria-describedby="validation-error"
              />
              <button
                className="es-btn-primary"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
            {validationError && isSearchTouched && (
              <div className="es-validation-error" id="validation-error" role="alert">
                ⚠️ {validationError}
              </div>
            )}
            <div className="es-validation-hint">
              <small>Format: EMP + 3 alphanumeric characters (e.g., EMP001, EMPA12, EMP1AB)</small>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="es-table-wrapper">
          <table className="es-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {visibleEmployees.length > 0 ? (
                visibleEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <span className="es-employee-id">{emp.id}</span>
                    </td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>
                      <span className={`es-status-badge ${getStatusClass(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <div className="es-update-cell">
                        <select
                          className="es-select"
                          value={emp.status}
                          onChange={(e) => changeStatus(emp.id, e.target.value)}
                        >
                          <option value="Active">Active</option>
                          <option value="On Leave">On Leave</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                        <button
                          className="es-update-btn"
                          onClick={() => {
                            const newStatus = emp.status;
                            handleUpdateStatus(emp.id, newStatus);
                          }}
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="es-no-data">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="es-pagination-row">
          <span className="es-pagination-info">
            Showing {visibleEmployees.length} of {filteredEmployees.length} employees
          </span>
          <select
            className="es-page-size"
            value={pageSize}
            onChange={(e) => {
              const v = e.target.value;
              setPageSize(v === "All" ? "All" : Number(v));
            }}
          >
            {PAGE_SIZE_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        {/* Back */}
        <button className="es-back-btn" onClick={onBack}>← Back</button>

      </div>
    </div>
  );
};

export default EmployeeStatus;
