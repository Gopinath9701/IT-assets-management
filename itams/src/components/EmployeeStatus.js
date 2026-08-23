import React, { useState } from "react";
import "./EmployeeStatus.css";

const PAGE_SIZE_OPTIONS = [10, 30, 50, "All"];

// ======================================================
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
// 250808001 -> 08-08-2025 -> ALLOWED
// 260808001 -> 08-08-2026 -> ALLOWED
// 260821001 -> 21-08-2026 -> ALLOWED (TODAY)
// 261006001 -> 06-10-2026 -> FUTURE if today is 21-08-2026
// 260822001 -> 22-08-2026 -> NOT ALLOWED
// 270808001 -> 08-08-2027 -> NOT ALLOWED
//
// RULES:
// 1. Exactly 9 digits
// 2. Numbers only
// 3. No spaces
// 4. Valid calendar date
// 5. Past dates allowed
// 6. Today's date allowed
// 7. Future dates NOT allowed
// 8. Last 3 digits must be 001 - 999
// 9. YY represents the actual year
// ======================================================

const validateEmployeeId = (id) => {
  // ====================================================
  // EMPTY
  // ====================================================

  if (!id || id.length === 0) {
    return {
      isValid: false,
      message: "Employee ID is required.",
    };
  }

  // ====================================================
  // SPACES
  // ====================================================

  if (/\s/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID must not contain spaces.",
    };
  }

  // ====================================================
  // ONLY NUMBERS
  // ====================================================

  if (!/^\d+$/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID must contain only numbers.",
    };
  }

  // ====================================================
  // EXACTLY 9 DIGITS
  // ====================================================

  if (id.length !== 9) {
    return {
      isValid: false,
      message:
        "Employee ID must be exactly 9 digits (YYMMDDXXX).",
    };
  }

  // ====================================================
  // SPLIT ID
  //
  // YY MM DD XXX
  // ====================================================

  const yearShort = Number(id.substring(0, 2));
  const month = Number(id.substring(2, 4));
  const day = Number(id.substring(4, 6));
  const employeeNumber = Number(id.substring(6, 9));

  // ====================================================
  // ACTUAL YEAR
  // ====================================================

  const fullYear = 2000 + yearShort;

  // ====================================================
  // MONTH
  // ====================================================

  if (month < 1 || month > 12) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid month.",
    };
  }

  // ====================================================
  // DAY
  // ====================================================

  if (day < 1 || day > 31) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid day.",
    };
  }

  // ====================================================
  // EMPLOYEE NUMBER
  //
  // 001 - 999
  // ====================================================

  if (
    employeeNumber < 1 ||
    employeeNumber > 999
  ) {
    return {
      isValid: false,
      message:
        "Employee number must be between 001 and 999.",
    };
  }

  // ====================================================
  // VALID CALENDAR DATE
  // ====================================================

  const employeeDate = new Date(
    fullYear,
    month - 1,
    day
  );

  employeeDate.setHours(0, 0, 0, 0);

  // ====================================================
  // PREVENT INVALID DATES
  //
  // Example:
  // 260231001 -> February 31
  // 260431001 -> April 31
  // ====================================================

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

  // ====================================================
  // TODAY
  // ====================================================

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  // ====================================================
  // FUTURE DATE CHECK
  //
  // Past  -> ALLOWED
  // Today -> ALLOWED
  // Future -> NOT ALLOWED
  // ====================================================

  if (employeeDate > today) {
    return {
      isValid: false,
      message:
        "Future dates are not allowed. Employee ID must contain a past or today's date.",
    };
  }

  // ====================================================
  // VALID
  // ====================================================

  return {
    isValid: true,
    message: "",
  };
};


// ======================================================
// CHECK WHETHER SEARCH IS AN EMPLOYEE ID
// ======================================================

const looksLikeEmployeeId = (value) => {
  if (!value) {
    return false;
  }

  // Starts with a number
  if (/^\d/.test(value)) {
    return true;
  }

  return false;
};


// ======================================================
// CREATE EMPLOYEE FOR A VALID ID
//
// FORMAT:
// YYMMDDXXX
// ======================================================

const createEmployeeFromId = (employeeId) => {
  const employeeNumber = Number(
    employeeId.substring(6, 9)
  );

  const names = [
    "Arjun Reddy",
    "Sneha Sharma",
    "Rahul Kumar",
    "Priya Reddy",
    "Vikram Singh",
    "Ananya Rao",
    "Kiran Kumar",
    "Neha Patel",
    "Rohit Sharma",
    "Pooja Reddy",
  ];

  return {
    id: employeeId,
    name:
      names[(employeeNumber - 1) % names.length],
    department: "IT",
    status: "Active",
  };
};


// ======================================================
// MAIN COMPONENT
// ======================================================

const EmployeeStatus = ({
  username = "username",
  onLogout,
  onBack,
}) => {

  // ====================================================
  // SEARCH
  // ====================================================

  const [search, setSearch] = useState("");

  const [searchApplied, setSearchApplied] =
    useState("");

  // ====================================================
  // PAGINATION
  // ====================================================

  const [pageSize, setPageSize] = useState(10);

  // ====================================================
  // VALIDATION
  // ====================================================

  const [validationError, setValidationError] =
    useState("");

  const [isSearchValid, setIsSearchValid] =
    useState(true);

  const [isSearchTouched, setIsSearchTouched] =
    useState(false);

  // ====================================================
  // EMPLOYEE DATA
  //
  // FORMAT:
  // YYMMDDXXX
  // ====================================================

  const [employees, setEmployees] = useState([]);

  // ====================================================
  // FETCH EMPLOYEES FROM BACKEND
  // ====================================================

  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/employees", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.employees) {
          setEmployees(
            data.employees.map((emp) => ({
              id: emp.employee_id,
              name: emp.employee_name,
              department: emp.department,
              status: emp.status,
            }))
          );
        }
      } catch (err) {
        console.error("Fetch Employees Error:", err);
      }
    };
    fetchEmployees();
  }, []);

  // ====================================================
  // PENDING STATUS CHANGES
  // ====================================================

  const [pendingStatuses, setPendingStatuses] =
    useState({});


  // ====================================================
  // SEARCH INPUT CHANGE
  // ====================================================

  const handleSearchChange = (e) => {

    const value = e.target.value;

    // ==================================================
    // EMPLOYEE ID SEARCH
    // ==================================================

    if (/^\d/.test(value)) {

      const numericValue =
        value
          .replace(/\D/g, "")
          .slice(0, 9);

      setSearch(numericValue);

    } else {

      // ==================================================
      // NAME SEARCH
      // ==================================================

      setSearch(value);
    }

    setIsSearchTouched(false);

    setValidationError("");

    setIsSearchValid(true);

    setSearchApplied("");
  };


  // ====================================================
  // SEARCH
  // ====================================================

  const handleSearch = () => {

    setIsSearchTouched(true);

    const rawValue = search;

    // ==================================================
    // EMPTY
    // ==================================================

    if (rawValue === "") {

      setValidationError(
        "Please enter an Employee ID or Employee Name."
      );

      setIsSearchValid(false);

      setSearchApplied(null);

      return;
    }


    // ==================================================
    // EMPLOYEE ID SEARCH
    // ==================================================

    if (looksLikeEmployeeId(rawValue)) {

      const result =
        validateEmployeeId(rawValue);

      // ==================================================
      // INVALID ID
      // ==================================================

      if (!result.isValid) {

        setValidationError(
          result.message
        );

        setIsSearchValid(false);

        setSearchApplied(null);

        return;
      }

      // ==================================================
      // VALID ID
      // ==================================================

      const employeeId = rawValue;

      let foundEmployee =
        employees.find(
          (emp) =>
            emp.id === employeeId
        );


      // ==================================================
      // CREATE IF NOT FOUND
      // ==================================================

      if (!foundEmployee) {

        const newEmployee =
          createEmployeeFromId(
            employeeId
          );

        setEmployees((prev) => [
          ...prev,
          newEmployee,
        ]);

        foundEmployee = newEmployee;
      }


      // ==================================================
      // SUCCESS
      // ==================================================

      setSearchApplied(
        employeeId
      );

      setValidationError("");

      setIsSearchValid(true);

      return;
    }


    // ==================================================
    // NAME SEARCH
    // ==================================================

    const nameValue =
      rawValue.trim();


    // ==================================================
    // SPACES BEFORE / AFTER
    // ==================================================

    if (rawValue !== nameValue) {

      setValidationError(
        "Search should not have spaces before or after the name."
      );

      setIsSearchValid(false);

      setSearchApplied(null);

      return;
    }


    // ==================================================
    // MULTIPLE SPACES
    // ==================================================

    if (/\s{2,}/.test(nameValue)) {

      setValidationError(
        "Name search should not contain multiple spaces."
      );

      setIsSearchValid(false);

      setSearchApplied(null);

      return;
    }


    // ==================================================
    // MINIMUM 2 CHARACTERS
    // ==================================================

    if (nameValue.length < 2) {

      setValidationError(
        "Please enter at least 2 characters."
      );

      setIsSearchValid(false);

      setSearchApplied(null);

      return;
    }


    // ==================================================
    // ONLY LETTERS
    // ==================================================

    if (
      !/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(
        nameValue
      )
    ) {

      setValidationError(
        "Name should contain only letters and single spaces."
      );

      setIsSearchValid(false);

      setSearchApplied(null);

      return;
    }


    // ==================================================
    // NAME SEARCH SUCCESS
    // ==================================================

    setSearchApplied(
      nameValue
    );

    setValidationError("");

    setIsSearchValid(true);
  };


  // ====================================================
  // ENTER KEY
  // ====================================================

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      e.preventDefault();

      handleSearch();
    }
  };


  // ====================================================
  // FILTER EMPLOYEES
  // ====================================================

  const filteredEmployees =
    searchApplied === null
      ? []
      : searchApplied === ""
      ? employees
      : looksLikeEmployeeId(searchApplied)
      ? employees.filter(
          (emp) =>
            emp.id === searchApplied
        )
      : employees.filter(
          (emp) =>
            emp.name
              .toLowerCase()
              .includes(
                searchApplied.toLowerCase()
              )
        );


  // ====================================================
  // PAGE SIZE
  // ====================================================

  const visibleEmployees =
    pageSize === "All"
      ? filteredEmployees
      : filteredEmployees.slice(
          0,
          Number(pageSize)
        );


  // ====================================================
  // DROPDOWN CHANGE
  // ====================================================

  const handleStatusChange = (
    empId,
    newStatus
  ) => {

    setPendingStatuses((prev) => ({
      ...prev,
      [empId]: newStatus,
    }));
  };


  // ====================================================
  // UPDATE BUTTON
  // ====================================================

  const handleUpdateStatus = async (
    empId
  ) => {

    const newStatus =
      pendingStatuses[empId];

    // ==================================================
    // NOTHING CHANGED
    // ==================================================

    if (!newStatus) {

      alert(
        "Please select a different status before clicking Update."
      );

      return;
    }

    // ==================================================
    // CALL API
    // ==================================================

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/employees/${empId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update status.");
        return;
      }

      // ==================================================
      // UPDATE LOCAL STATE
      // ==================================================

      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === empId
            ? { ...employee, status: newStatus }
            : employee
        )
      );

      // ==================================================
      // REMOVE TEMPORARY STATUS
      // ==================================================

      setPendingStatuses((prev) => {
        const updated = { ...prev };
        delete updated[empId];
        return updated;
      });

      alert(`✅ Status updated to "${newStatus}" successfully!`);
    } catch (error) {
      console.error("Update Status Error:", error);
      alert("Unable to connect to server. Please make sure the backend is running.");
    }
  };


  // ====================================================
  // GET DISPLAY STATUS
  // ====================================================

  const getDisplayStatus = (emp) => {

    return emp.status;
  };


  // ====================================================
  // GET DROPDOWN VALUE
  // ====================================================

  const getDropdownStatus = (emp) => {

    return (
      pendingStatuses[emp.id] ??
      emp.status
    );
  };


  // ====================================================
  // STATUS CLASS
  // ====================================================

  const getStatusClass = (status) => {

    return `es-status-${status
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };


  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="es-page">

      {/* ============================================== */}
      {/* NAVBAR */}
      {/* ============================================== */}

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


      {/* ============================================== */}
      {/* BODY */}
      {/* ============================================== */}

      <div className="es-body">

        <h1 className="es-page-title">
          Employee Status
        </h1>

        <p className="es-page-sub">
          View and update employee status.
        </p>


        {/* ========================================== */}
        {/* SEARCH CARD */}
        {/* ========================================== */}

        <div className="es-card">

          <h2 className="es-card-title">
            Search Employee
          </h2>


          <div className="es-search-group">

            <div className="es-search-row">

              <input
                className={`es-input ${
                  !isSearchValid &&
                  isSearchTouched
                    ? "es-input-error"
                    : ""
                }`}
                type="text"
                inputMode="text"
                maxLength={50}
                placeholder="Enter Employee ID or Employee Name"
                value={search}
                onChange={
                  handleSearchChange
                }
                onKeyDown={
                  handleKeyDown
                }
                aria-invalid={
                  !isSearchValid
                }
                aria-describedby="validation-error"
              />


              <button
                className="es-btn-primary"
                onClick={handleSearch}
              >
                Search
              </button>

            </div>


            {/* ====================================== */}
            {/* VALIDATION MESSAGE */}
            {/* ====================================== */}

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


            {/* ====================================== */}
            {/* FORMAT HINT */}
            {/* ====================================== */}

            <div className="es-validation-hint">

              <small>
                Employee ID format: YYMMDDXXX — exactly
                9 digits. Past and today's dates are
                allowed. Future dates are not allowed.
                Last 3 digits: 001–999.
              </small>

            </div>

          </div>

        </div>


        {/* ========================================== */}
        {/* TABLE */}
        {/* ========================================== */}

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

                visibleEmployees.map(
                  (emp) => {

                    const displayStatus =
                      getDisplayStatus(emp);

                    const dropdownStatus =
                      getDropdownStatus(emp);

                    const hasPendingChange =
                      pendingStatuses[
                        emp.id
                      ] !== undefined &&
                      pendingStatuses[
                        emp.id
                      ] !== emp.status;

                    return (

                      <tr
                        key={emp.id}
                      >

                        {/* ================================= */}
                        {/* EMPLOYEE ID */}
                        {/* ================================= */}

                        <td>

                          <span className="es-employee-id">
                            {emp.id}
                          </span>

                        </td>


                        {/* ================================= */}
                        {/* NAME */}
                        {/* ================================= */}

                        <td>
                          {emp.name}
                        </td>


                        {/* ================================= */}
                        {/* DEPARTMENT */}
                        {/* ================================= */}

                        <td>
                          {emp.department}
                        </td>


                        {/* ================================= */}
                        {/* STATUS */}
                        {/* ================================= */}

                        <td>

                          <span
                            className={`es-status-badge ${getStatusClass(
                              displayStatus
                            )}`}
                          >
                            {displayStatus}
                          </span>

                        </td>


                        {/* ================================= */}
                        {/* UPDATE */}
                        {/* ================================= */}

                        <td>

                          <div className="es-update-cell">

                            <select
                              className="es-select"
                              value={
                                dropdownStatus
                              }
                              onChange={(e) =>
                                handleStatusChange(
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
                                  emp.id
                                )
                              }
                              disabled={
                                !hasPendingChange
                              }
                            >
                              Update
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )

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


        {/* ========================================== */}
        {/* PAGINATION */}
        {/* ========================================== */}

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


        {/* ========================================== */}
        {/* BACK */}
        {/* ========================================== */}

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
