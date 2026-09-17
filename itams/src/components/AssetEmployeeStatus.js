import React, { useState, useEffect } from "react";
import "./EmployeeStatus.css";

const PAGE_SIZE_OPTIONS = [10, 30, 50, "All"];

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

  // Old EMP format
  if (/^emp/i.test(value)) {
    return true;
  }

  return false;
};

// ======================================================
// CREATE EMPLOYEE FOR A VALID ID
// ======================================================

const createEmployeeFromId = (employeeId) => {
  const employeeNumber = Number(
    employeeId.substring(6, 9)
  );

  const randomNames = [
    "Rahul Sharma",
    "Ananya Reddy",
    "Arjun Kumar",
    "Sneha Patel",
    "Rohit Verma",
    "Priya Singh",
    "Karthik Rao",
    "Neha Reddy",
    "Vikram Mehta",
    "Pooja Nair",
    "Aditya Kapoor",
    "Meera Joshi",
  ];

  const name =
    randomNames[
      (employeeNumber - 1) %
        randomNames.length
    ];

  return {
    id: employeeId,
    name,
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

  // Live filter - the list narrows as `search` changes, no Search
  // button/Enter key needed. Empty search shows every employee.
  const [search, setSearch] = useState("");

  // ====================================================
  // PAGINATION
  // ====================================================

  const [pageSize, setPageSize] = useState(10);

  // ====================================================
  // EMPLOYEE DATA — loaded from backend
  // ====================================================

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/employees", {
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
  // SEARCH INPUT CHANGE
  // ====================================================

  const handleSearchChange = (e) => {
    const value = e.target.value;

    // Employee ID (starts with a digit) — numbers only, max 9
    if (/^\d/.test(value)) {
      setSearch(value.replace(/\D/g, "").slice(0, 9));
    } else {
      // Name search — letters and spaces only, no special characters
      setSearch(value.replace(/[^A-Za-z ]/g, ""));
    }
  };

  // ====================================================
  // FILTER EMPLOYEES
  // Substring match against the live search text, no separate "applied"
  // state to fall out of sync with it.
  // ====================================================

  const filteredEmployees = (() => {
    const value = search.trim();
    if (!value) return employees;

    return looksLikeEmployeeId(value)
      ? employees.filter((emp) => emp.id.includes(value))
      : employees.filter((emp) =>
          emp.name.toLowerCase().includes(value.toLowerCase())
        );
  })();

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
          View employee status.
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
                className="es-input"
                type="text"
                inputMode="text"
                maxLength={50}
                placeholder="Type to filter by Employee ID or Name"
                value={search}
                onChange={
                  handleSearchChange
                }
              />

            </div>

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
        {/* EMPLOYEE TABLE */}
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

              </tr>

            </thead>

            <tbody>

              {visibleEmployees.length > 0 ? (

                visibleEmployees.map(
                  (emp) => {

                    return (

                      <tr
                        key={emp.id}
                      >

                        {/* EMPLOYEE ID */}

                        <td>

                          <span className="es-employee-id">
                            {emp.id}
                          </span>

                        </td>

                        {/* EMPLOYEE NAME */}

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

                      </tr>
                    );
                  }
                )

              ) : (

                <tr>

                  <td
                    colSpan="4"
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
