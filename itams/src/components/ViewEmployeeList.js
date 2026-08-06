import React, { useState } from "react";
import "./ViewEmployeeList.css";

const PAGE_SIZE_OPTIONS = [10, 30, 50, "All"];

const ViewEmployeeList = ({
  username = "username",
  onLogout,
  onBack,
}) => {

  const [searchInput, setSearchInput] = useState("");
  const [searchId, setSearchId]       = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [pageSize, setPageSize]       = useState(10);

  const employees = [
    {
      id: "EMP001", name: "Emp1", department: "Dept 1", status: "Active",
      phone: "9876543210", email: "emp1@itams.com", joiningDate: "10-01-2025",
      assets: [
        { assetId: "AST001", assetType: "Laptop",   assignedDate: "15-02-2026" },
        { assetId: "AST008", assetType: "Monitor",  assignedDate: "15-02-2026" },
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
  ];

  const filteredEmployees = employees.filter((emp) =>
    emp.id.toLowerCase().includes(searchId.toLowerCase())
  );

  const visibleEmployees =
    pageSize === "All"
      ? filteredEmployees
      : filteredEmployees.slice(0, Number(pageSize));

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
              <label className="vel-label">Employee ID</label>
              <input
                className="vel-input"
                type="text"
                placeholder="Enter Employee ID"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setSearchId(searchInput)}
              />
              <button
                className="vel-btn-primary"
                onClick={() => setSearchId(searchInput)}
              >
                Search
              </button>
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
                        <td>{emp.id}</td>
                        <td>{emp.department}</td>
                        <td>{emp.status}</td>
                        <td>
                          <button
                            className="vel-view-btn"
                            onClick={() => setSelectedEmployee(emp)}
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

          {/* Back */}
          <button className="vel-back-btn" onClick={onBack}>Back</button>

        </div>

        {/* Right column — details panel */}
        {selectedEmployee && (
          <div className="vel-details-panel">

            <div className="vel-details-header">
              <h2 className="vel-details-title">Employee Details</h2>
              <button
                className="vel-close-btn"
                onClick={() => setSelectedEmployee(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="vel-details-body">
              {/* Key-value rows */}
              {[
                ["Employee ID",    selectedEmployee.id],
                ["Employee Name",  selectedEmployee.name],
                ["Department",     selectedEmployee.department],
                ["Phone Number",   selectedEmployee.phone],
                ["Email ID",       selectedEmployee.email],
                ["Date of Joining",selectedEmployee.joiningDate],
                ["Status",         selectedEmployee.status],
              ].map(([label, value]) => (
                <div className="vel-detail-row" key={label}>
                  <span className="vel-detail-label">{label}</span>
                  <span className="vel-detail-colon">:</span>
                  <span className="vel-detail-value">{value}</span>
                </div>
              ))}

              <hr className="vel-divider" />

              {/* Assigned Assets */}
              <h3 className="vel-assets-title">Assigned Assets</h3>
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
                    {selectedEmployee.assets.length > 0 ? (
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

              {/* Close button */}
              <div className="vel-close-row">
                <button
                  className="vel-close-panel-btn"
                  onClick={() => setSelectedEmployee(null)}
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
