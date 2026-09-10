import React, { useEffect, useState } from "react";
import "./ViewEmployeeList.css";

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

  // Actual year
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
// MAIN COMPONENT
// =====================================================

const ViewEmployeeList = ({
  username = "username",
  onLogout,
  onBack,
}) => {
  const [searchInput, setSearchInput] = useState("");

  const [searchId, setSearchId] = useState("");

  const [employees, setEmployees] = useState([]);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [validationError, setValidationError] =
    useState("");

  const [searchTouched, setSearchTouched] =
    useState(false);

  const [isSearchValid, setIsSearchValid] =
    useState(true);

  const [loading, setLoading] = useState(false);

  const [pageSize, setPageSize] = useState(10);

  // =====================================================
  // FETCH ALL EMPLOYEES
  // =====================================================

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/employees",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (
          response.ok &&
          data.employees
        ) {
          setEmployees(
            data.employees.map((emp) => ({
              id: emp.employee_id,
              name: emp.employee_name,
              department: emp.department,
              status: emp.status,
            }))
          );
        }
      } catch (error) {
        console.error(
          "Fetch Employees Error:",
          error
        );
      }
    };

    fetchEmployees();
  }, []);

  // =====================================================
  // FETCH SINGLE EMPLOYEE
  // =====================================================

  const fetchEmployeeById = async (id) => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/employees/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      console.log(
        "EMPLOYEE RESPONSE:",
        data
      );

      if (
        !response.ok ||
        !data.employee
      ) {
        return null;
      }

      const emp = data.employee;

      return {
        id: emp.employee_id,
        name: emp.employee_name,
        department: emp.department,
        status: emp.status,
        phone: emp.phone || "",
        email: emp.email || "",

        joiningDate:
          emp.joining_date
            ? new Date(
                emp.joining_date
              )
                .toLocaleDateString(
                  "en-GB"
                )
                .replace(
                  /\//g,
                  "-"
                )
            : "",

        assets:
          (data.assets || []).map(
            (asset) => ({
              assetId:
                asset.asset_id,

              assetType:
                asset.asset_type,

              assignedDate:
                asset.assigned_date
                  ? new Date(
                      asset.assigned_date
                    )
                      .toLocaleDateString(
                        "en-GB"
                      )
                      .replace(
                        /\//g,
                        "-"
                      )
                  : "",
            })
          ),
      };
    } catch (error) {
      console.error(
        "Fetch Employee By ID Error:",
        error
      );

      return null;
    }
  };

  // =====================================================
  // SEARCH INPUT CHANGE
  // =====================================================

  const handleSearchInputChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 9);

    setSearchInput(value);

    setSearchTouched(false);
    setValidationError("");
    setIsSearchValid(true);

    // Clear selected details while typing
    setSelectedEmployee(null);

    // Clear active search
    setSearchId("");
  };

  // =====================================================
  // SEARCH EMPLOYEE
  // =====================================================

  const handleSearch = () => {
    setSearchTouched(true);

    const rawValue = searchInput;

    // ===================================================
    // EMPTY
    // ===================================================

    if (rawValue === "") {
      setValidationError(
        "Please enter an Employee ID."
      );

      setIsSearchValid(false);
      setSearchId("");
      setSelectedEmployee(null);

      return;
    }

    // ===================================================
    // VALIDATE
    // ===================================================

    const result =
      validateEmployeeId(rawValue);

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
    // SUCCESS
    // ===================================================

    setSearchId(rawValue);
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
  // FILTER EMPLOYEES
  // =====================================================

  const filteredEmployees =
    searchId === ""
      ? employees
      : employees.filter(
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

  const handleViewEmployee = async (
    employee
  ) => {
    const validation =
      validateEmployeeId(employee.id);

    if (!validation.isValid) {
      setValidationError(
        validation.message
      );

      setSearchTouched(true);

      return;
    }

    setLoading(true);

    try {
      const fullEmployee =
        await fetchEmployeeById(
          employee.id
        );

      if (!fullEmployee) {
        setValidationError(
          `Could not load employee "${employee.id}".`
        );

        setSearchTouched(true);

        return;
      }

      setSelectedEmployee(
        fullEmployee
      );

      setSearchInput(
        fullEmployee.id
      );

      setSearchId(
        fullEmployee.id
      );

      setValidationError("");
      setIsSearchValid(true);
    } finally {
      setLoading(false);
    }
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

        {/* ================= LEFT SIDE ================= */}

        <div className="vel-left">

          {/* ================= PAGE TITLE ================= */}

          <h1 className="vel-page-title">
            View Employee List
          </h1>

          <p className="vel-page-sub">
            View employee information and
            assigned assets.
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

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >

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
                    placeholder="Enter Employee ID"
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

                  <button
                    type="button"
                    className="vel-btn-primary"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    Search
                  </button>

                </div>

                {/* ================= ERROR ================= */}

                {validationError &&
                  searchTouched && (

                    <div
                      className="vel-validation-error"
                      role="alert"
                    >
                      ⚠️ {validationError}
                    </div>

                  )}

              </div>

            </div>

            {/* ================= FORMAT HINT ================= */}

            <div className="vel-validation-hint">

              <small>
                Format: YYMMDDXXX — exactly
                9 digits, no spaces. Past and
                today's dates are allowed.
                Future dates are not allowed.
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
                              className={`vel-status-badge vel-status-${String(
                                emp.status || ""
                              )
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                            >
                              {emp.status}
                            </span>

                          </td>

                          <td>

                            <button
                              type="button"
                              className="vel-view-btn"
                              onClick={() =>
                                handleViewEmployee(
                                  emp
                                )
                              }
                              disabled={loading}
                            >
                              {loading &&
                              selectedEmployee?.id ===
                                emp.id
                                ? "Loading..."
                                : "View"}
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
                        No employees found.
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
                {visibleEmployees.length}{" "}
                of{" "}
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

                <option value={10}>
                  10
                </option>

                <option value={30}>
                  30
                </option>

                <option value={50}>
                  50
                </option>

                <option value="All">
                  All
                </option>

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

        {/* ================= RIGHT SIDE ================= */}

        {selectedEmployee && (

          <div className="vel-details-panel">

            <div className="vel-details-panel-header">

              <h2 className="vel-card-title">
                Employee Details
              </h2>

              <button
                type="button"
                className="vel-details-close-x"
                onClick={
                  handleCloseDetails
                }
              >
                ×
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
                        {value || "-"}
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
                          (
                            asset,
                            index
                          ) => (

                            <tr
                              key={`${asset.assetId}-${index}`}
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
                  type="button"
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
