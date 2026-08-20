import React, { useState } from "react";
import "./ViewEmployeeList.css";

const PAGE_SIZE_OPTIONS = [10, 30, 50, "All"];

// =====================================================
// EMPLOYEE ID VALIDATION
// Required format: YYDDMM001
// Example: 261908001
//           YY DD MM 001
// =====================================================

const validateEmployeeId = (id) => {
  // Empty
  if (!id || id.length === 0) {
    return {
      isValid: false,
      message: "Employee ID is required.",
    };
  }

  // Leading space
  if (id !== id.trimStart()) {
    return {
      isValid: false,
      message: "Spaces before Employee ID are not allowed.",
    };
  }

  // Trailing space
  if (id !== id.trimEnd()) {
    return {
      isValid: false,
      message: "Spaces after Employee ID are not allowed.",
    };
  }

  // Any space inside
  if (/\s/.test(id)) {
    return {
      isValid: false,
      message: "Spaces are not allowed in Employee ID.",
    };
  }

  // Only numbers
  if (!/^\d+$/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID must contain only numbers.",
    };
  }

  // Exactly 9 digits
  if (id.length !== 9) {
    return {
      isValid: false,
      message: "Employee ID must be exactly 9 digits (YYDDMM001).",
    };
  }

  // Split ID
  const year = id.substring(0, 2);
  const day = id.substring(2, 4);
  const month = id.substring(4, 6);
  const employeeNumber = id.substring(6, 9);

  // Current year = 2026 -> 26
  const currentYear = new Date().getFullYear();
  const currentYearShort = String(currentYear).slice(-2);

  if (year !== currentYearShort) {
    return {
      isValid: false,
      message: `Employee ID must use the current year (${currentYearShort}).`,
    };
  }

  const dayNumber = Number(day);
  const monthNumber = Number(month);
  const employeeNumberValue = Number(employeeNumber);

  // Month validation
  if (monthNumber < 1 || monthNumber > 12) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid month.",
    };
  }

  // Day validation
  if (dayNumber < 1 || dayNumber > 31) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid day.",
    };
  }

  // Check actual calendar date
  const fullYear = currentYear;
  const date = new Date(fullYear, monthNumber - 1, dayNumber);

  if (
    date.getFullYear() !== fullYear ||
    date.getMonth() !== monthNumber - 1 ||
    date.getDate() !== dayNumber
  ) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid date.",
    };
  }

  // Employee number must be 001 - 999
  if (employeeNumberValue < 1 || employeeNumberValue > 999) {
    return {
      isValid: false,
      message: "Employee number must be between 001 and 999.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// =====================================================
// SAMPLE EMPLOYEE DATA
// Format: YYDDMM001
// =====================================================

const EMPLOYEES = [
  {
    id: "260101001",
    name: "Emp1",
    department: "IT",
    status: "Active",
    phone: "9876543210",
    email: "emp1@gmail.com",
    joiningDate: "01-01-2026",
    assets: [
      {
        assetId: "AST001",
        assetType: "Laptop",
        assignedDate: "15-02-2026",
      },
      {
        assetId: "AST008",
        assetType: "Monitor",
        assignedDate: "15-02-2026",
      },
      {
        assetId: "AST015",
        assetType: "Keyboard",
        assignedDate: "20-03-2026",
      },
    ],
  },

  {
    id: "260202002",
    name: "Emp2",
    department: "HR",
    status: "Active",
    phone: "9876543211",
    email: "emp2@gmail.com",
    joiningDate: "02-02-2026",
    assets: [
      {
        assetId: "AST021",
        assetType: "Laptop",
        assignedDate: "01-04-2026",
      },
    ],
  },

  {
    id: "260503003",
    name: "Emp3",
    department: "Finance",
    status: "On Leave",
    phone: "9876543212",
    email: "emp3@gmail.com",
    joiningDate: "03-05-2026",
    assets: [
      {
        assetId: "AST033",
        assetType: "Desktop",
        assignedDate: "12-05-2026",
      },
    ],
  },

  {
    id: "260704004",
    name: "Emp4",
    department: "IT",
    status: "Inactive",
    phone: "9876543213",
    email: "emp4@gmail.com",
    joiningDate: "04-07-2026",
    assets: [],
  },

  {
    id: "260805005",
    name: "Emp5",
    department: "HR",
    status: "Active",
    phone: "9876543214",
    email: "emp5@gmail.com",
    joiningDate: "05-08-2026",
    assets: [],
  },

  {
    id: "261006006",
    name: "Emp6",
    department: "Finance",
    status: "Active",
    phone: "9876543215",
    email: "emp6@gmail.com",
    joiningDate: "06-10-2026",
    assets: [],
  },

  {
    id: "261207007",
    name: "Emp7",
    department: "IT",
    status: "On Leave",
    phone: "9876543216",
    email: "emp7@gmail.com",
    joiningDate: "07-12-2026",
    assets: [],
  },
];

// =====================================================
// MAIN COMPONENT
// =====================================================

const ViewEmployeeList = ({
  username = "username",
  onLogout,
  onBack,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchId, setSearchId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [pageSize, setPageSize] = useState(10);

  const [validationError, setValidationError] = useState("");
  const [isSearchValid, setIsSearchValid] = useState(true);
  const [searchTouched, setSearchTouched] = useState(false);

  // =====================================================
  // SEARCH INPUT
  // =====================================================

  const handleSearchInputChange = (e) => {
    const value = e.target.value;

    setSearchInput(value);
    setSearchTouched(false);
    setSearchId("");
    setSelectedEmployee(null);

    if (value === "") {
      setValidationError("");
      setIsSearchValid(true);
      return;
    }

    const result = validateEmployeeId(value);

    setIsSearchValid(result.isValid);
    setValidationError(result.message);
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = () => {
    setSearchTouched(true);

    // Empty
    if (searchInput === "") {
      setValidationError("Please enter an Employee ID.");
      setIsSearchValid(false);
      setSearchId("");
      setSelectedEmployee(null);
      return;
    }

    // Validate ID
    const result = validateEmployeeId(searchInput);

    if (!result.isValid) {
      setValidationError(result.message);
      setIsSearchValid(false);
      setSearchId("");
      setSelectedEmployee(null);
      return;
    }

    // Exact ID search
    const foundEmployee = EMPLOYEES.find(
      (employee) => employee.id === searchInput
    );

    if (!foundEmployee) {
      setValidationError(
        `Employee ID "${searchInput}" was not found.`
      );
      setIsSearchValid(false);
      setSearchId("");
      setSelectedEmployee(null);
      return;
    }

    // Success
    setSearchId(searchInput);
    setValidationError("");
    setIsSearchValid(true);
    setSelectedEmployee(null);
  };

  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredEmployees =
    searchId === ""
      ? EMPLOYEES
      : EMPLOYEES.filter(
          (employee) => employee.id === searchId
        );

  // =====================================================
  // PAGE SIZE
  // =====================================================

  const visibleEmployees =
    pageSize === "All"
      ? filteredEmployees
      : filteredEmployees.slice(0, Number(pageSize));

  // =====================================================
  // VIEW EMPLOYEE
  // =====================================================

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  const handleCloseDetails = () => {
    setSelectedEmployee(null);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="vel-page">

      {/* ================= NAVBAR ================= */}

      <nav className="vel-nav">
        <div className="vel-nav-logo">
          <span className="vel-nav-title">
            ITAMS
          </span>

          <span className="vel-nav-sub">
            IT Asset Management System
          </span>
        </div>

        <div className="vel-nav-right">
          <span className="vel-nav-user">
            {username}
          </span>

          <span className="vel-nav-divider">
            |
          </span>

          <button
            className="vel-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ================= BODY ================= */}

      <div className="vel-body">

        {/* ================= LEFT COLUMN ================= */}

        <div className="vel-left">

          <h1 className="vel-page-title">
            View Employee List
          </h1>

          <p className="vel-page-sub">
            View employee information and assigned assets.
          </p>

          {/* ================= SEARCH CARD ================= */}

          <div className="vel-card">

            <h2 className="vel-card-title">
              Search Employee
            </h2>

            <div className="vel-search-row">

              <div className="vel-search-input-group">

                <label className="vel-label">
                  Employee ID
                </label>

                <input
                  className={`vel-input ${
                    !isSearchValid && searchTouched
                      ? "vel-input-error"
                      : ""
                  }`}
                  type="text"
                  placeholder="Enter Employee ID (e.g., 261908001)"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleKeyDown}
                  maxLength={9}
                  aria-invalid={!isSearchValid}
                />

                {/* VALIDATION MESSAGE */}

                {validationError && searchTouched && (
                  <div
                    className="vel-validation-error"
                    role="alert"
                  >
                    ⚠️ {validationError}
                  </div>
                )}

                <button
                  className="vel-btn-primary"
                  onClick={handleSearch}
                >
                  Search
                </button>

              </div>
            </div>

            {/* FORMAT HINT */}

            <div className="vel-validation-hint">
              <small>
                Format: YYDDMM001 — 9 digits.
                Example: 261908001
              </small>
            </div>

          </div>

          {/* ================= EMPLOYEE LIST ================= */}

          <div className="vel-card">

            <h2 className="vel-card-title">
              Employee List
            </h2>

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
                        className={
                          selectedEmployee?.id === emp.id
                            ? "vel-row-active"
                            : ""
                        }
                      >

                        <td>
                          <span className="vel-employee-id">
                            {emp.id}
                          </span>
                        </td>

                        <td>
                          {emp.department}
                        </td>

                        <td>
                          <span
                            className={`vel-status-badge vel-status-${emp.status
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {emp.status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="vel-view-btn"
                            onClick={() =>
                              handleViewEmployee(emp)
                            }
                          >
                            View
                          </button>
                        </td>

                      </tr>
                    ))

                  ) : (

                    <tr>
                      <td
                        colSpan="4"
                        className="vel-no-data"
                      >
                        No Employee Found
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* ================= PAGINATION ================= */}

            <div className="vel-pagination-row">

              <span className="vel-pagination-info">
                Showing {visibleEmployees.length} of{" "}
                {filteredEmployees.length} employees
              </span>

              <select
                className="vel-page-size"
                value={pageSize}
                onChange={(e) => {
                  const value = e.target.value;

                  setPageSize(
                    value === "All"
                      ? "All"
                      : Number(value)
                  );
                }}
              >

                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* ================= BACK ================= */}

          <button
            className="vel-back-btn"
            onClick={onBack}
          >
            ← Back
          </button>

        </div>

        {/* ================= DETAILS PANEL ================= */}

        {selectedEmployee && (

          <div
            className="vel-details-panel"
            role="dialog"
            aria-label="Employee Details"
          >

            <div className="vel-details-header">

              <h2 className="vel-details-title">
                Employee Details
              </h2>

              <button
                className="vel-close-btn"
                onClick={handleCloseDetails}
                aria-label="Close"
              >
                ✕
              </button>

            </div>

            <div className="vel-details-body">

              {/* PERSONAL INFORMATION */}

              <div className="vel-details-section">

                <h3 className="vel-section-title">
                  Personal Information
                </h3>

                {[
                  [
                    "Employee ID",
                    selectedEmployee.id,
                  ],
                  [
                    "Employee Name",
                    selectedEmployee.name,
                  ],
                  [
                    "Department",
                    selectedEmployee.department,
                  ],
                  [
                    "Phone Number",
                    selectedEmployee.phone,
                  ],
                  [
                    "Email ID",
                    selectedEmployee.email,
                  ],
                  [
                    "Date of Joining",
                    selectedEmployee.joiningDate,
                  ],
                  [
                    "Status",
                    selectedEmployee.status,
                  ],
                ].map(([label, value]) => (

                  <div
                    className="vel-detail-row"
                    key={label}
                  >

                    <span className="vel-detail-label">
                      {label}
                    </span>

                    <span className="vel-detail-colon">
                      :
                    </span>

                    <span className="vel-detail-value">
                      {value}
                    </span>

                  </div>

                ))}

              </div>

              <hr className="vel-divider" />

              {/* ASSIGNED ASSETS */}

              <div className="vel-details-section">

                <h3 className="vel-section-title">
                  Assigned Assets
                </h3>

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

                      {selectedEmployee.assets &&
                      selectedEmployee.assets.length > 0 ? (

                        selectedEmployee.assets.map(
                          (asset, index) => (

                            <tr key={index}>

                              <td>
                                {asset.assetId}
                              </td>

                              <td>
                                {asset.assetType}
                              </td>

                              <td>
                                {asset.assignedDate}
                              </td>

                            </tr>

                          )
                        )

                      ) : (

                        <tr>

                          <td
                            colSpan="3"
                            className="vel-no-data"
                          >
                            No Assets Assigned
                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* CLOSE */}

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
