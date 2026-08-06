import React, { useState } from "react";
import "./EmployeeStatus.css";

const PAGE_SIZE_OPTIONS = [10, 30, 50, "All"];

const EmployeeStatus = ({ username = "username", onLogout, onBack }) => {
  const [search, setSearch]           = useState("");
  const [searchApplied, setSearchApplied] = useState("");
  const [pageSize, setPageSize]       = useState(10);

  const [employees, setEmployees] = useState([
    { id: "EMP001", name: "Employee 1", department: "IT",         status: "Active"   },
    { id: "EMP002", name: "Employee 2", department: "HR",         status: "On Leave" },
    { id: "EMP003", name: "Employee 3", department: "Finance",    status: "Inactive" },
    { id: "EMP004", name: "Employee 4", department: "Marketing",  status: "Active"   },
    { id: "EMP005", name: "Employee 5", department: "IT",         status: "On Leave" },
    { id: "EMP006", name: "Employee 6", department: "Sales",      status: "Inactive" },
    { id: "EMP007", name: "Employee 7", department: "Operations", status: "Active"   },
    { id: "EMP008", name: "Employee 8", department: "Finance",    status: "On Leave" },
  ]);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.id.toLowerCase().includes(searchApplied.toLowerCase()) ||
      emp.name.toLowerCase().includes(searchApplied.toLowerCase())
  );

  const visibleEmployees =
    pageSize === "All"
      ? filteredEmployees
      : filteredEmployees.slice(0, Number(pageSize));

  const changeStatus = (empId, value) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === empId ? { ...e, status: value } : e))
    );
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

        {/* Search Card */}
        <div className="es-card">
          <h2 className="es-card-title">Search Employee</h2>
          <div className="es-search-row">
            <input
              className="es-input"
              type="text"
              placeholder="Enter Employee ID or Employee Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearchApplied(search)}
            />
            <button
              className="es-btn-primary"
              onClick={() => setSearchApplied(search)}
            >
              Search
            </button>
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
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.status}</td>
                    <td>
                      <div className="es-update-cell">
                        <select
                          className="es-select"
                          value={emp.status}
                          onChange={(e) => changeStatus(emp.id, e.target.value)}
                        >
                          <option>Active</option>
                          <option>On Leave</option>
                          <option>Inactive</option>
                        </select>
                        <button
                          className="es-update-btn"
                          onClick={() => alert("Status Updated Successfully")}
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
        <button className="es-back-btn" onClick={onBack}>Back</button>

      </div>
    </div>
  );
};

export default EmployeeStatus;
