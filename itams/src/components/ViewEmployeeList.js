import React, { useState } from "react";
import "./ViewEmployeeList.css";

const PAGE_SIZE_OPTIONS = [10, 30, 50, "All"];

// Validation function for Employee ID
const validateEmployeeId = (id) => {
  // Check if empty
  if (!id || id.trim() === "") {
    return { isValid: false, message: "Employee ID is required" };
  }

  // Check for leading or trailing spaces
  if (id !== id.trim()) {
    return { isValid: false, message: "Employee ID should not have leading or trailing spaces" };
  }

  // Check if contains any spaces
  if (/\s/.test(id)) {
    return { isValid: false, message: "Employee ID should not contain spaces" };
  }

  // Check if contains special characters (only alphanumeric allowed after EMP)
  if (/[^A-Za-z0-9]/.test(id)) {
    return { isValid: false, message: "Employee ID should not contain special characters" };
  }

  // Check if starts with "EMP" (case sensitive)
  if (!id.startsWith("EMP")) {
    return { isValid: false, message: "Employee ID must start with 'EMP'" };
  }

  // Check exact length (EMP + 3 characters = 6 total)
  if (id.length !== 6) {
    return { isValid: false, message: "Employee ID must be exactly 6 characters long (EMP + 3 alphanumeric characters)" };
  }

  // Check if last 3 characters are alphanumeric
  const lastThree = id.substring(3);
  if (!/^[A-Za-z0-9]{3}$/.test(lastThree)) {
    return { isValid: false, message: "Last 3 characters must be alphanumeric (letters or numbers)" };
  }

  return { isValid: true, message: "" };
};

const ViewEmployeeList = ({
  username = "username",
  onLogout,
  onBack,
}) => {

  const [searchInput, setSearchInput] = useState("");
  const [searchId, setSearchId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  
  // State for validation
  const [validationError, setValidationError] = useState("");
  const [isSearchValid, setIsSearchValid] = useState(true);

  // Sample employee data with valid IDs
  const employees = [
    {
      id: "EMP001", name: "Emp1", department: "Dept 1", status: "Active",
      phone: "9876543210", email: "emp1@itams.com", joiningDate: "10-01-2025",
      assets: [
        { assetId: "AST001", assetType: "Laptop", assignedDate: "15-02-2026" },
        { assetId: "AST008", assetType: "Monitor", assignedDate: "15-02-2026" },
        { assetId: "AST015", assetType: "Keyboard", assignedDate: "20-03-2026" },
      ],
    },
    {
      id: "EMP002", name: "Emp2", department: "Dept 2", status: "Active",
      phone: "9876543211", email: "emp2@itams.com", joiningDate: "11-01-2025",
      assets: [
        { assetId: "AST021", assetType: "Laptop", assignedDate: "01-04-2026" },
      ],
    },
    {
      id: "EMP003", name: "Emp3", department: "Dept 3", status: "On Leave",
      phone: "9876543212", email: "emp3@itams.com", joiningDate: "15-02-2025",
      assets: [
        { assetId: "AST033", assetType: "Desktop", assignedDate: "12-05-2026" },
      ],
    },
    {
      id: "EMP004", name: "Emp4", department: "Dept 1", status: "Inactive",
      phone: "9876543213", email: "emp4@itams.com", joiningDate: "18-02-2025",
      assets: [],
    },
    {
      id: "EMP005", name: "Emp5", department: "Dept 2", status: "Active",
      phone: "9876543214", email: "emp5@itams.com", joiningDate: "22-03-2025",
      assets: [],
    },
    {
      id: "EMP006", name: "Emp6", department: "Dept 3", status: "Active",
      phone: "9876543215", email: "emp6@itams.com", joiningDate: "01-04-2025",
      assets: [],
    },
    {
      id: "EMP007", name: "Emp7", department: "Dept 1", status: "On Leave",
      phone: "9876543216", email: "emp7@itams.com", joiningDate: "15-05-2025",
      assets: [],
    },
  ];

  // Handle search input change with validation
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Validate on every keystroke
    if (value.trim() === "") {
      setIsSearchValid(true);
      setValidationError("");
    } else {
      const result = validateEmployeeId(value);
      setIsSearchValid(result.isValid);
      setValidationError(result.message);
    }
  };

  // Handle search with validation
  const handleSearch = () => {
    if (searchInput.trim() === "") {
      setSearchId("");
      setValidationError("");
      setIsSearchValid(true);
      return;
    }

    const result = validateEmployeeId(searchInput);
    if (result.isValid) {
      setSearchId(searchInput);
      setValidationError("");
      setIsSearchValid(true);
    } else {
      setValidationError(result.message);
      setIsSearchValid(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Filter employees based on search ID
  const filteredEmployees = searchId.trim() === "" 
    ? employees 
    : employees.filter((emp) => 
        emp.id.toLowerCase().includes(searchId.toLowerCase())
      );

  // Get visible employees based on page size
  const visibleEmployees =
    pageSize === "All"
      ? filteredEmployees
      : filteredEmployees.slice(0, Number(pageSize));

  // Handle View button click
  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  // Handle Close details panel
  const handleCloseDetails = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="vel-page">

      {/* Navbar */}
      <nav className="vel-nav">
        <div className="vel-nav-logo">
          <span className="vel-nav-title">ITAMS</span>
          <span className="vel-nav-sub">IT Asset Management System</span>
        </div>
        <div className="vel-nav-right">
          <span className="vel-nav-user">{username}</span>
          <span className="vel-nav-divider">|</span>
          <button className="vel-logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      {/* Body */}
      <div className="vel-body">

        {/* Left column */}
        <div className="vel-left">

          <h1 className="vel-page-title">View Employee List</h1>
          <p className="vel-page-sub">View employee information and assigned assets.</p>

          {/* Search card */}
          <div className="vel-card">
            <h2 className="vel-card-title">Search Employee</h2>
            <div className="vel-search-row">
              <div className="vel-search-input-group">
                <label className="vel-label">Employee ID</label>
                <input
                  className={`vel-input ${!isSearchValid && searchInput.trim() !== "" ? "vel-input-error" : ""}`}
                  type="text"
                  placeholder="Enter Employee ID (e.g., EMP001)"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleKeyDown}
                  aria-invalid={!isSearchValid}
                  aria-describedby="validation-error"
                />
                {validationError && searchInput.trim() !== "" && (
                  <div className="vel-validation-error" id="validation-error" role="alert">
                    ⚠️ {validationError}
                  </div>
                )}
                <button
                  className="vel-btn-primary"
                  onClick={handleSearch}
                  disabled={!isSearchValid && searchInput.trim() !== ""}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="vel-validation-hint">
              <small>Format: EMP + 3 alphanumeric characters (e.g., EMP001, EMPA12, EMP1AB)</small>
            </div>
          </div>

          {/* Employee list card */}
          <div className="vel-card">
            <h2 className="vel-card-title">Employee List</h2>
            <div className="vel-table-wrapper">
              <table className="vel-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleEmployees.length > 0 ? (
                    visibleEmployees.map((emp) => (
                      <tr
                        key={emp.id}
                        className={selectedEmployee?.id === emp.id ? "vel-row-active" : ""}
                      >
                        <td>
                          <span className="vel-employee-id">{emp.id}</span>
                        </td>
                        <td>{emp.department}</td>
                        <td>
                          <span className={`vel-status-badge vel-status-${emp.status.toLowerCase().replace(" ", "-")}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="vel-view-btn"
                            onClick={() => handleViewEmployee(emp)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="vel-no-data">No Employee Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="vel-pagination-row">
              <span className="vel-pagination-info">
                Showing {visibleEmployees.length} of {filteredEmployees.length} employees
              </span>
              <select
                className="vel-page-size"
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
          </div>

          {/* Back button */}
          <button className="vel-back-btn" onClick={onBack}>← Back</button>

        </div>

        {/* Right column — Employee Details Panel */}
        {selectedEmployee && (
          <div className="vel-details-panel" role="dialog" aria-label="Employee Details">

            <div className="vel-details-header">
              <h2 className="vel-details-title">Employee Details</h2>
              <button
                className="vel-close-btn"
                onClick={handleCloseDetails}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="vel-details-body">
              {/* Employee Information */}
              <div className="vel-details-section">
                <h3 className="vel-section-title">Personal Information</h3>
                {[
                  ["Employee ID", selectedEmployee.id],
                  ["Employee Name", selectedEmployee.name],
                  ["Department", selectedEmployee.department],
                  ["Phone Number", selectedEmployee.phone],
                  ["Email ID", selectedEmployee.email],
                  ["Date of Joining", selectedEmployee.joiningDate],
                  ["Status", selectedEmployee.status],
                ].map(([label, value]) => (
                  <div className="vel-detail-row" key={label}>
                    <span className="vel-detail-label">{label}</span>
                    <span className="vel-detail-colon">:</span>
                    <span className="vel-detail-value">{value}</span>
                  </div>
                ))}
              </div>

              <hr className="vel-divider" />

              {/* Assigned Assets */}
              <div className="vel-details-section">
                <h3 className="vel-section-title">Assigned Assets</h3>
                <div className="vel-asset-table-wrapper">
                  <table className="vel-asset-table">
                    <thead>
                      <tr>
                        <th>Asset ID</th>
                        <th>Asset Type</th>
                        <th>Assigned Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEmployee.assets && selectedEmployee.assets.length > 0 ? (
                        selectedEmployee.assets.map((asset, i) => (
                          <tr key={i}>
                            <td>{asset.assetId}</td>
                            <td>{asset.assetType}</td>
                            <td>{asset.assignedDate}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="vel-no-data">No Assets Assigned</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Close button */}
              <div className="vel-close-row">
                <button
                  className="vel-close-panel-btn"
                  onClick={handleCloseDetails}
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ViewEmployeeList;
