import React, { useState } from "react";
import "./ViewEmployeeList.css";

const PAGE_SIZE_OPTIONS = [10, 30, 50, "All"];

// =====================================================
// EMPLOYEE ID VALIDATION
//
// FORMAT:
// YYMMDDXXX
//
// YY  = Year
// MM  = Month
// DD  = Day
// XXX = Employee number (001 - 999)
//
// EXAMPLES:
//
// 260101001 -> 01-01-2026 -> ALLOWED
// 260808001 -> 08-08-2026 -> ALLOWED
// 260821001 -> 21-08-2026 -> ALLOWED (TODAY)
// 260822001 -> 22-08-2026 -> NOT ALLOWED
// 270808001 -> 08-08-2027 -> NOT ALLOWED
// =====================================================

const validateEmployeeId = (id) => {
  // Empty
  if (!id || id.length === 0) {
    return {
      isValid: false,
      message: "Employee ID is required.",
    };
  }

  // Spaces
  if (/\s/.test(id)) {
    return {
      isValid: false,
      message: "Spaces are not allowed in Employee ID.",
    };
  }

  // Numbers only
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
      message:
        "Employee ID must be exactly 9 digits (YYMMDDXXX).",
    };
  }

  // ===================================================
  // SPLIT ID
  // YY MM DD XXX
  // ===================================================

  const yearShort = Number(id.substring(0, 2));
  const month = Number(id.substring(2, 4));
  const day = Number(id.substring(4, 6));
  const employeeNumber = Number(id.substring(6, 9));

  // YY -> Actual year
  const fullYear = 2000 + yearShort;

  // ===================================================
  // MONTH
  // ===================================================

  if (month < 1 || month > 12) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid month.",
    };
  }

  // ===================================================
  // DAY
  // ===================================================

  if (day < 1 || day > 31) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid day.",
    };
  }

  // ===================================================
  // EMPLOYEE NUMBER
  // ===================================================

  if (employeeNumber < 1 || employeeNumber > 999) {
    return {
      isValid: false,
      message:
        "Employee number must be between 001 and 999.",
    };
  }

  // ===================================================
  // VALID CALENDAR DATE
  // ===================================================

  const employeeDate = new Date(
    fullYear,
    month - 1,
    day
  );

  employeeDate.setHours(0, 0, 0, 0);

  if (
    employeeDate.getFullYear() !== fullYear ||
    employeeDate.getMonth() !== month - 1 ||
    employeeDate.getDate() !== day
  ) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid date.",
    };
  }

  // ===================================================
  // TODAY
  // ===================================================

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ===================================================
  // FUTURE DATE CHECK
  //
  // Past  -> ALLOWED
  // Today -> ALLOWED
  // Future -> NOT ALLOWED
  // ===================================================

  if (employeeDate > today) {
    return {
      isValid: false,
      message:
        "Future dates are not allowed. Employee ID must contain a past or today's date.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// =====================================================
// CONVERT EMPLOYEE ID DATE
// =====================================================

const getDateFromEmployeeId = (id) => {
  const year = 2000 + Number(id.substring(0, 2));
  const month = Number(id.substring(2, 4));
  const day = Number(id.substring(4, 6));

  return new Date(year, month - 1, day);
};

// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

// =====================================================
// EMPLOYEE NAMES
// =====================================================

const EMPLOYEE_NAMES = [
  "Rahul Sharma",
  "Priya Reddy",
  "Arjun Kumar",
  "Sneha Rani",
  "Kiran Rao",
  "Ananya Patel",
  "Rohit Varma",
  "Neha Reddy",
  "Vikram Singh",
  "Pooja Sharma",
];

// =====================================================
// CREATE EMPLOYEE AUTOMATICALLY
//
// If the ID is valid but not already stored,
// a basic employee record is created.
// =====================================================

const createEmployeeFromId = (id) => {
  const employeeDate = getDateFromEmployeeId(id);

  const employeeNumber = Number(
    id.substring(6, 9)
  );

  const departments = [
    "IT",
    "HR",
    "Finance",
  ];

  const department =
    departments[(employeeNumber - 1) % departments.length];

  const name =
    EMPLOYEE_NAMES[
      (employeeNumber - 1) % EMPLOYEE_NAMES.length
    ];

  return {
    id: id,
    name: name,
    department: department,
    status: "Active",
    phone: "9876543210",
    email: `${id}@gmail.com`,
    joiningDate: formatDate(employeeDate),

    assets: [],
  };
};

// =====================================================
// SAMPLE EMPLOYEE DATA
// =====================================================

const EMPLOYEES = [
  {
    id: "260101001",
    name: "Rahul Sharma",
    department: "IT",
    status: "Active",
    phone: "9876543210",
    email: "260101001@gmail.com",
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
    name: "Priya Reddy",
    department: "HR",
    status: "Active",
    phone: "9876543211",
    email: "260202002@gmail.com",
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
    name: "Arjun Kumar",
    department: "Finance",
    status: "On Leave",
    phone: "9876543212",
    email: "260503003@gmail.com",
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
    name: "Sneha Rani",
    department: "IT",
    status: "Inactive",
    phone: "9876543213",
    email: "260704004@gmail.com",
    joiningDate: "04-07-2026",

    assets: [],
  },

  {
    id: "260805005",
    name: "Kiran Rao",
    department: "HR",
    status: "Active",
    phone: "9876543214",
    email: "260805005@gmail.com",
    joiningDate: "05-08-2026",

    assets: [],
  },

  // ===================================================
  // PAST EMPLOYEE
  // ===================================================

  {
    id: "250808001",
    name: "Ananya Patel",
    department: "IT",
    status: "Active",
    phone: "9876543215",
    email: "250808001@gmail.com",
    joiningDate: "08-08-2025",

    assets: [
      {
        assetId: "AST040",
        assetType: "Laptop",
        assignedDate: "10-08-2025",
      },
    ],
  },

  {
    id: "260808001",
    name: "Rohit Varma",
    department: "HR",
    status: "Active",
    phone: "9876543216",
    email: "260808001@gmail.com",
    joiningDate: "08-08-2026",

    assets: [
      {
        assetId: "AST041",
        assetType: "Desktop",
        assignedDate: "09-08-2026",
      },
    ],
  },

  // ===================================================
  // TODAY'S EMPLOYEE
  // ===================================================

  {
    id: "260821001",
    name: "Neha Reddy",
    department: "Finance",
    status: "Active",
    phone: "9876543217",
    email: "260821001@gmail.com",
    joiningDate: "21-08-2026",

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
  const [searchInput, setSearchInput] =
    useState("");

  const [searchId, setSearchId] =
    useState("");

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [pageSize, setPageSize] =
    useState(10);

  const [validationError, setValidationError] =
    useState("");

  const [isSearchValid, setIsSearchValid] =
    useState(true);

  const [searchTouched, setSearchTouched] =
    useState(false);

  // =====================================================
  // SEARCH INPUT CHANGE
  // =====================================================

  const handleSearchInputChange = (e) => {
    // Only numbers
    // Maximum 9 digits

    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 9);

    setSearchInput(value);

    setSearchTouched(false);

    setSearchId("");

    setSelectedEmployee(null);

    setValidationError("");

    // Empty
    if (value === "") {
      setIsSearchValid(true);
      return;
    }

    // Less than 9 digits
    if (value.length < 9) {
      setIsSearchValid(false);

      setValidationError(
        "Employee ID must be exactly 9 digits (YYMMDDXXX)."
      );

      return;
    }

    // Validate
    const result =
      validateEmployeeId(value);

    setIsSearchValid(result.isValid);

    if (!result.isValid) {
      setValidationError(
        result.message
      );
    }
  };

  // =====================================================
  // SEARCH EMPLOYEE
  // =====================================================

  const handleSearch = () => {
    setSearchTouched(true);

    // Empty
    if (searchInput === "") {
      setValidationError(
        "Please enter an Employee ID."
      );

      setIsSearchValid(false);
      setSearchId("");
      setSelectedEmployee(null);

      return;
    }

    // Validate
    const result =
      validateEmployeeId(searchInput);

    if (!result.isValid) {
      setValidationError(
        result.message
      );

      setIsSearchValid(false);
      setSearchId("");
      setSelectedEmployee(null);

      return;
    }

    // ===================================================
    // FIND EMPLOYEE
    // ===================================================

    let foundEmployee =
      EMPLOYEES.find(
        (employee) =>
          employee.id === searchInput
      );

    // ===================================================
    // CREATE EMPLOYEE IF NOT STORED
    // ===================================================

    if (!foundEmployee) {
      foundEmployee =
        createEmployeeFromId(
          searchInput
        );
    }

    // ===================================================
    // SUCCESS
    // ===================================================

    setSearchId(foundEmployee.id);

    setValidationError("");

    setIsSearchValid(true);

    setSelectedEmployee(foundEmployee);
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
  // FILTER EMPLOYEES
  // =====================================================

  const filteredEmployees =
    searchId === ""
      ? EMPLOYEES
      : EMPLOYEES.filter(
          (employee) =>
            employee.id === searchId
        );

  // =====================================================
  // PAGE SIZE
  // =====================================================

  const visibleEmployees =
    pageSize === "All"
      ? filteredEmployees
      : filteredEmployees.slice(
          0,
          Number(pageSize)
        );

  // =====================================================
  // VIEW EMPLOYEE
  // =====================================================

  const handleViewEmployee = (
    employee
  ) => {
    // Validate ID first
    const validation =
      validateEmployeeId(
        employee.id
      );

    // Future/invalid employee cannot open
    if (!validation.isValid) {
      setValidationError(
        validation.message
      );

      setSearchTouched(true);

      return;
    }

    // Find exact employee
    let exactEmployee =
      EMPLOYEES.find(
        (emp) =>
          emp.id === employee.id
      );

    // If not stored, create it
    if (!exactEmployee) {
      exactEmployee =
        createEmployeeFromId(
          employee.id
        );
    }

    // Open exact employee
    setSelectedEmployee(
      exactEmployee
    );

    setSearchInput(
      exactEmployee.id
    );

    setSearchId(
      exactEmployee.id
    );

    setValidationError("");

    setIsSearchValid(true);
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
                    !isSearchValid &&
                    searchTouched
                      ? "vel-input-error"
                      : ""
                  }`}
                  type="text"
                  inputMode="numeric"
                  maxLength={9}
                  placeholder="Enter Employee ID (e.g., 260805005)"
                  value={searchInput}
                  onChange={
                    handleSearchInputChange
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  aria-invalid={
                    !isSearchValid
                  }
                />

                {/* ================= VALIDATION ================= */}

                {validationError &&
                  searchTouched && (

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

            {/* ================= FORMAT HINT ================= */}

            <div className="vel-validation-hint">

              <small>
                Format: YYMMDDXXX — exactly 9 digits,
                no spaces. Past and today's dates are
                allowed. Future dates are not allowed.
                Last 3 digits: 001–999.
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

                    <th>
                      Employee ID
                    </th>

                    <th>
                      Department
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {visibleEmployees.length > 0 ? (

                    visibleEmployees.map(
                      (emp) => (

                        <tr
                          key={emp.id}
                          className={
                            selectedEmployee?.id ===
                            emp.id
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
                                .replace(
                                  " ",
                                  "-"
                                )}`}
                            >
                              {emp.status}
                            </span>

                          </td>

                          <td>

                            <button
                              className="vel-view-btn"
                              onClick={() =>
                                handleViewEmployee(
                                  emp
                                )
                              }
                            >
                              View
                            </button>

                          </td>

                        </tr>
                      )

                    )

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

                Showing{" "}
                {visibleEmployees.length} of{" "}
                {filteredEmployees.length}{" "}
                employees

              </span>

              <select
                className="vel-page-size"
                value={pageSize}
                onChange={(e) => {

                  const value =
                    e.target.value;

                  setPageSize(
                    value === "All"
                      ? "All"
                      : Number(value)
                  );

                }}
              >

                {PAGE_SIZE_OPTIONS.map(
                  (option) => (

                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>

                  )
                )}

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

        {/* =================================================
            EMPLOYEE DETAILS PANEL
        ================================================= */}

        {selectedEmployee && (

          <div
            className="vel-details-panel"
            role="dialog"
            aria-label="Employee Details"
          >

            {/* ================= HEADER ================= */}

            <div className="vel-details-header">

              <h2 className="vel-details-title">
                Employee Details
              </h2>

              <button
                className="vel-close-btn"
                onClick={
                  handleCloseDetails
                }
                aria-label="Close"
              >
                ✕
              </button>

            </div>

            <div className="vel-details-body">

              {/* ================= PERSONAL INFORMATION ================= */}

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

                ].map(
                  ([label, value]) => (

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
                  )
                )}

              </div>

              <hr className="vel-divider" />

              {/* ================= ASSIGNED ASSETS ================= */}

              <div className="vel-details-section">

                <h3 className="vel-section-title">
                  Assigned Assets
                </h3>

                <div className="vel-asset-table-wrapper">

                  <table className="vel-asset-table">

                    <thead>

                      <tr>

                        <th>
                          Asset ID
                        </th>

                        <th>
                          Asset Type
                        </th>

                        <th>
                          Assigned Date
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {selectedEmployee.assets &&
                      selectedEmployee.assets.length >
                        0 ? (

                        selectedEmployee.assets.map(
                          (asset, index) => (

                            <tr
                              key={index}
                            >

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

              {/* ================= CLOSE ================= */}

              <div className="vel-close-row">

                <button
                  className="vel-close-panel-btn"
                  onClick={
                    handleCloseDetails
                  }
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
