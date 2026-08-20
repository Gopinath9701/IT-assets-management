import React, { useState } from "react";
import "./EmployeeStatus.css";

const PAGE_SIZE_OPTIONS = [10, 30, 50, "All"];

// ======================================================
// EMPLOYEE ID VALIDATION
// Format: YYDDMM001
// Example: 260819001
// ======================================================

const validateEmployeeId = (id) => {
  if (!id || id.length === 0) {
    return {
      isValid: false,
      message: "Employee ID is required",
    };
  }

  // Leading or trailing spaces
  if (id !== id.trim()) {
    return {
      isValid: false,
      message: "Employee ID should not have spaces before or after the ID.",
    };
  }

  // Any spaces inside the ID
  if (/\s/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID should not contain spaces.",
    };
  }

  // Only digits allowed
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
      message: "Employee ID must be exactly 9 digits in YYDDMM001 format.",
    };
  }

  // Extract YYDDMM
  const yy = id.substring(0, 2);
  const dd = id.substring(2, 4);
  const mm = id.substring(4, 6);
  const employeeNumber = id.substring(6, 9);

  // Validate day
  const day = Number(dd);

  if (day < 1 || day > 31) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid day.",
    };
  }

  // Validate month
  const month = Number(mm);

  if (month < 1 || month > 12) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid month.",
    };
  }

  // Employee number must be 001-999
  const empNumber = Number(employeeNumber);

  if (empNumber < 1 || empNumber > 999) {
    return {
      isValid: false,
      message: "Employee number must be between 001 and 999.",
    };
  }

  // Prevent impossible dates such as 3102
  const fullYear = 2000 + Number(yy);
  const date = new Date(fullYear, month - 1, day);

  if (
    date.getFullYear() !== fullYear ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid date.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};


// ======================================================
// CHECK WHETHER INPUT LOOKS LIKE EMPLOYEE ID
// ======================================================

const looksLikeEmployeeId = (value) => {
  if (!value) return false;

  // If it starts with a number, treat it as Employee ID
  if (/^\d/.test(value)) {
    return true;
  }

  // If user tries old EMP format, show ID validation error
  if (/^emp/i.test(value)) {
    return true;
  }

  return false;
};


// ======================================================
// MAIN COMPONENT
// ======================================================

const EmployeeStatus = ({
  username = "username",
  onLogout,
  onBack,
}) => {
  const [search, setSearch] = useState("");
  const [searchApplied, setSearchApplied] = useState("");

  const [pageSize, setPageSize] = useState(10);

  const [validationError, setValidationError] = useState("");

  const [isSearchValid, setIsSearchValid] = useState(true);

  const [isSearchTouched, setIsSearchTouched] = useState(false);


  // ======================================================
  // EMPLOYEE DATA
  // Employee IDs now follow YYDDMM001 format
  // ======================================================

  const [employees, setEmployees] = useState([
    {
      id: "260812001",
      name: "Employee 1",
      department: "IT",
      status: "Active",
    },
    {
      id: "260813002",
      name: "Employee 2",
      department: "HR",
      status: "On Leave",
    },
    {
      id: "260814003",
      name: "Employee 3",
      department: "Finance",
      status: "Inactive",
    },
    {
      id: "260815004",
      name: "Employee 4",
      department: "Marketing",
      status: "Active",
    },
    {
      id: "260816005",
      name: "Employee 5",
      department: "IT",
      status: "On Leave",
    },
    {
      id: "260817006",
      name: "Employee 6",
      department: "Sales",
      status: "Inactive",
    },
    {
      id: "260818007",
      name: "Employee 7",
      department: "Operations",
      status: "Active",
    },
    {
      id: "260819008",
      name: "Employee 8",
      department: "Finance",
      status: "On Leave",
    },
  ]);


  // ======================================================
  // SEARCH INPUT CHANGE
  // ======================================================

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearch(value);

    setIsSearchTouched(false);

    setValidationError("");

    setIsSearchValid(true);
  };


  // ======================================================
  // SEARCH
  // ======================================================

  const handleSearch = () => {
    setIsSearchTouched(true);

    const rawValue = search;


    // ------------------------------------------
    // EMPTY SEARCH
    // ------------------------------------------

    if (rawValue === "") {
      setValidationError(
        "Please enter an Employee ID or Employee Name."
      );

      setIsSearchValid(false);

      setSearchApplied(null);

      return;
    }


    // ------------------------------------------
    // EMPLOYEE ID SEARCH
    // ------------------------------------------

    if (looksLikeEmployeeId(rawValue)) {
      const result = validateEmployeeId(rawValue);

      if (!result.isValid) {
        setValidationError(result.message);

        setIsSearchValid(false);

        setSearchApplied(null);

        return;
      }

      // Exact ID match
      const employeeId = rawValue;

      const foundEmployee = employees.find(
        (emp) => emp.id === employeeId
      );

      if (!foundEmployee) {
        setValidationError(
          `Employee ID "${employeeId}" was not found.`
        );

        setIsSearchValid(false);

        setSearchApplied(null);

        return;
      }

      setSearchApplied(employeeId);

      setValidationError("");

      setIsSearchValid(true);

      return;
    }


    // ------------------------------------------
    // NAME SEARCH
    // ------------------------------------------

    const nameValue = rawValue.trim();

    // Don't allow spaces before/after name
    if (rawValue !== nameValue) {
      setValidationError(
        "Search should not have spaces before or after the name."
      );

      setIsSearchValid(false);

      setSearchApplied(null);

      return;
    }

    // Multiple spaces in name are not allowed
    if (/\s{2,}/.test(nameValue)) {
      setValidationError(
        "Name search should not contain multiple spaces."
      );

      setIsSearchValid(false);

      setSearchApplied(null);

      return;
    }

    if (nameValue.length < 2) {
      setValidationError(
        "Please enter at least 2 characters."
      );

      setIsSearchValid(false);

      setSearchApplied(null);

      return;
    }

    // Only letters and single spaces
    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(nameValue)) {
      setValidationError(
        "Name should contain only letters and single spaces."
      );

      setIsSearchValid(false);

      setSearchApplied(null);

      return;
    }

    setSearchApplied(nameValue);

    setValidationError("");

    setIsSearchValid(true);
  };


  // ======================================================
  // ENTER KEY
  // ======================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      handleSearch();
    }
  };


  // ======================================================
  // FILTER EMPLOYEES
  // ======================================================

  const filteredEmployees =
    searchApplied === null
      ? []
      : searchApplied === ""
      ? employees
      : looksLikeEmployeeId(searchApplied)
      ? employees.filter(
          (emp) => emp.id === searchApplied
        )
      : employees.filter((emp) =>
          emp.name
            .toLowerCase()
            .includes(searchApplied.toLowerCase())
        );


  // ======================================================
  // PAGE SIZE
  // ======================================================

  const visibleEmployees =
    pageSize === "All"
      ? filteredEmployees
      : filteredEmployees.slice(
          0,
          Number(pageSize)
        );


  // ======================================================
  // CHANGE STATUS
  // ======================================================

  const changeStatus = (empId, value) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === empId
          ? {
              ...employee,
              status: value,
            }
          : employee
      )
    );
  };


  // ======================================================
  // UPDATE STATUS
  // ======================================================

  const handleUpdateStatus = (empId, newStatus) => {
    changeStatus(empId, newStatus);

    alert(
      `✅ Status updated to "${newStatus}" successfully!`
    );
  };


  // ======================================================
  // STATUS CLASS
  // ======================================================

  const getStatusClass = (status) => {
    return `es-status-${status
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };


  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="es-page">

      {/* ============================================= */}
      {/* NAVBAR */}
      {/* ============================================= */}

      <nav className="es-nav">

        <div className="es-nav-logo">

          <span className="es-nav-title">
            ITAMS
          </span>

          <span className="es-nav-sub">
            IT Asset Management System
          </span>

        </div>


        <div className="es-nav-right">

          <span className="es-nav-user">
            {username}
          </span>

          <span className="es-nav-divider">
            |
          </span>

          <button
            className="es-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ============================================= */}
      {/* BODY */}
      {/* ============================================= */}

      <div className="es-body">

        <h1 className="es-page-title">
          Employee Status
        </h1>

        <p className="es-page-sub">
          View and update employee status.
        </p>


        {/* =========================================== */}
        {/* SEARCH CARD */}
        {/* =========================================== */}

        <div className="es-card">

          <h2 className="es-card-title">
            Search Employee
          </h2>


          <div className="es-search-group">

            <div className="es-search-row">

              <input
                className={`es-input ${
                  !isSearchValid && isSearchTouched
                    ? "es-input-error"
                    : ""
                }`}
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


            {/* VALIDATION MESSAGE */}

            {validationError &&
              isSearchTouched && (
                <div
                  className="es-validation-error"
                  id="validation-error"
                  role="alert"
                >
                  ⚠️ {validationError}
                </div>
              )}


            {/* FORMAT HINT */}

            <div className="es-validation-hint">

              <small>
                Employee ID format: YYDDMM001
                (e.g., 260819001)
              </small>

            </div>

          </div>

        </div>


        {/* =========================================== */}
        {/* TABLE */}
        {/* =========================================== */}

        <div className="es-table-wrapper">

          <table className="es-table">

            <thead>

              <tr>

                <th>
                  Employee ID
                </th>

                <th>
                  Employee Name
                </th>

                <th>
                  Department
                </th>

                <th>
                  Status
                </th>

                <th>
                  Update
                </th>

              </tr>

            </thead>


            <tbody>

              {visibleEmployees.length > 0 ? (

                visibleEmployees.map((emp) => (

                  <tr key={emp.id}>

                    {/* EMPLOYEE ID */}

                    <td>

                      <span className="es-employee-id">
                        {emp.id}
                      </span>

                    </td>


                    {/* NAME */}

                    <td>
                      {emp.name}
                    </td>


                    {/* DEPARTMENT */}

                    <td>
                      {emp.department}
                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`es-status-badge ${getStatusClass(
                          emp.status
                        )}`}
                      >
                        {emp.status}
                      </span>

                    </td>


                    {/* UPDATE */}

                    <td>

                      <div className="es-update-cell">

                        <select
                          className="es-select"
                          value={emp.status}
                          onChange={(e) =>
                            changeStatus(
                              emp.id,
                              e.target.value
                            )
                          }
                        >

                          <option value="Active">
                            Active
                          </option>

                          <option value="On Leave">
                            On Leave
                          </option>

                          <option value="Inactive">
                            Inactive
                          </option>

                        </select>


                        <button
                          className="es-update-btn"
                          onClick={() =>
                            handleUpdateStatus(
                              emp.id,
                              emp.status
                            )
                          }
                        >
                          Update
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="es-no-data"
                  >
                    No employees found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* =========================================== */}
        {/* PAGINATION */}
        {/* =========================================== */}

        <div className="es-pagination-row">

          <span className="es-pagination-info">

            Showing{" "}
            {visibleEmployees.length}{" "}
            of{" "}
            {filteredEmployees.length}{" "}
            employees

          </span>


          <select
            className="es-page-size"
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


        {/* =========================================== */}
        {/* BACK */}
        {/* =========================================== */}

        <button
          className="es-back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>

    </div>
  );
};

export default EmployeeStatus;
