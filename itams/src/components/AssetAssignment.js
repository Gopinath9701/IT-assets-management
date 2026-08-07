import React, { useState } from "react";
import "./AssetAssignment.css";

const ROWS_OPTIONS = [10, 30, 50, "All"];

// Approved requests not yet assigned
const INITIAL_PENDING = [
  {
    requestId:    "AR001",
    employeeId:   "EMP001",
    employeeName: "Employee 1",
    department:   "IT",
    assetType:    "Laptop",
    purpose:      "Development Work",
    requiredDate: "10-08-2026",
    approvalDate: "08-08-2026",
  },
  {
    requestId:    "AR004",
    employeeId:   "EMP004",
    employeeName: "Employee 4",
    department:   "HR",
    assetType:    "Monitor",
    purpose:      "New Employees",
    requiredDate: "12-08-2026",
    approvalDate: "09-08-2026",
  },
  {
    requestId:    "AR006",
    employeeId:   "EMP007",
    employeeName: "Employee 7",
    department:   "Finance",
    assetType:    "Printer",
    purpose:      "Office Work",
    requiredDate: "14-08-2026",
    approvalDate: "10-08-2026",
  },
];

// Already assigned assets — history
const INITIAL_HISTORY = [
  {
    assignmentId: "ASG001",
    requestId:    "AR002",
    employeeId:   "EMP002",
    employeeName: "Employee 2",
    assetType:    "Laptop",
    assetNameId:  "Dell Latitude 5420 (AST1001)",
    assignedDate: "09-08-2026",
    status:       "Assigned",
  },
  {
    assignmentId: "ASG002",
    requestId:    "AR003",
    employeeId:   "EMP003",
    employeeName: "Employee 3",
    assetType:    "Keyboard",
    assetNameId:  "Logitech K120 (AST2007)",
    assignedDate: "10-08-2026",
    status:       "Assigned",
  },
  {
    assignmentId: "ASG003",
    requestId:    "AR005",
    employeeId:   "EMP005",
    employeeName: "Employee 5",
    assetType:    "Monitor",
    assetNameId:  'HP 24" Monitor (AST3004)',
    assignedDate: "11-08-2026",
    status:       "Assigned",
  },
];

// Simple assignment ID counter
let assignCounter = INITIAL_HISTORY.length + 1;

const AssetAssignment = ({ username = "username", onLogout, onBack, onSidebarNavigate }) => {
  const [activeSidebar, setActiveSidebar] = useState("asset-assignment");

  // Search
  const [searchEmpId, setSearchEmpId]     = useState("");
  const [appliedEmpId, setAppliedEmpId]   = useState("");

  // Table data
  const [pending, setPending]   = useState(INITIAL_PENDING);
  const [history, setHistory]   = useState(INITIAL_HISTORY);

  // Rows per page — separate for each table
  const [pendingRows, setPendingRows] = useState(10);
  const [historyRows, setHistoryRows] = useState(10);

  const sidebarItems = [
    { id: "dashboard",        label: "Dashboard"        },
    { id: "asset-management", label: "Asset Management" },
    { id: "asset-assignment", label: "Asset Assignment" },
    { id: "request-approval", label: "Request Approval" },
    { id: "maintenance",      label: "Maintenance"      },
  ];

  const handleSidebarClick = (item) => {
    setActiveSidebar(item.id);
    if (onSidebarNavigate) onSidebarNavigate(item.id);
  };

  // ── Search ───────────────────────────────────────────────────
  const handleSearch = () => setAppliedEmpId(searchEmpId.trim());

  const filteredPending = pending.filter((r) =>
    appliedEmpId
      ? r.employeeId.toLowerCase().includes(appliedEmpId.toLowerCase()) ||
        r.employeeName.toLowerCase().includes(appliedEmpId.toLowerCase())
      : true
  );

  const filteredHistory = history.filter((r) =>
    appliedEmpId
      ? r.employeeId.toLowerCase().includes(appliedEmpId.toLowerCase()) ||
        r.employeeName.toLowerCase().includes(appliedEmpId.toLowerCase())
      : true
  );

  const displayedPending = pendingRows === "All" ? filteredPending : filteredPending.slice(0, pendingRows);
  const displayedHistory = historyRows === "All" ? filteredHistory : filteredHistory.slice(0, historyRows);

  // ── Assign ───────────────────────────────────────────────────
  const handleAssign = (req) => {
    const padded = String(assignCounter).padStart(3, "0");
    const today  = new Date();
    const assignedDate = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

    const newEntry = {
      assignmentId: `ASG${padded}`,
      requestId:    req.requestId,
      employeeId:   req.employeeId,
      employeeName: req.employeeName,
      assetType:    req.assetType,
      assetNameId:  `${req.assetType} Asset (AUTO)`,
      assignedDate,
      status:       "Assigned",
    };

    assignCounter += 1;
    setPending((prev) => prev.filter((r) => r.requestId !== req.requestId));
    setHistory((prev) => [newEntry, ...prev]);
  };

  return (
    <div className="asa-page-wrapper">

      {/* ── Top Navbar ── */}
      <nav className="asa-top-nav">
        <div className="asa-nav-logo">
          <span className="asa-nav-logo-title">ITAMS</span>
          <span className="asa-nav-logo-sub">IT Asset Management System</span>
        </div>
        <div className="asa-nav-right">
          <span className="asa-nav-username">{username}</span>
          <div className="asa-nav-divider" />
          <button className="asa-logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div className="asa-body-wrapper">

        {/* ── Sidebar ── */}
        <aside className="asa-sidebar">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={
                "asa-sidebar-item" +
                (activeSidebar === item.id ? " asa-sidebar-item--active" : "")
              }
              onClick={() => handleSidebarClick(item)}
            >
              {item.label}
            </div>
          ))}
        </aside>

        {/* ── Main Content ── */}
        <main className="asa-main-content">
          <h1 className="asa-page-title">Asset Assignment</h1>
          <p className="asa-page-subtitle">
            Assign approved asset requests to employees.
          </p>

          {/* ── Search by Employee ID ── */}
          <div className="asa-search-section">
            <label className="asa-search-label">Search by Employee ID</label>
            <div className="asa-search-row">
              <input
                className="asa-input"
                type="text"
                placeholder="Enter employee ID"
                value={searchEmpId}
                onChange={(e) => setSearchEmpId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="asa-search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          {/* ── Pending Requests Table ── */}
          <div className="asa-card">
            <h2 className="asa-card-heading">
              Request Approved Information (Not Yet Assigned)
            </h2>
            <div className="asa-table-wrapper">
              <table className="asa-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Department</th>
                    <th>Asset Type</th>
                    <th>Purpose</th>
                    <th>Required Date</th>
                    <th>Approval Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {displayedPending.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="asa-no-data">
                        No pending requests found.
                      </td>
                    </tr>
                  ) : (
                    displayedPending.map((req) => (
                      <tr key={req.requestId}>
                        <td>{req.requestId}</td>
                        <td>{req.employeeId}</td>
                        <td>{req.employeeName}</td>
                        <td>{req.department}</td>
                        <td>{req.assetType}</td>
                        <td>{req.purpose}</td>
                        <td>{req.requiredDate}</td>
                        <td>{req.approvalDate}</td>
                        <td>
                          <button
                            className="asa-assign-btn"
                            onClick={() => handleAssign(req)}
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="asa-rows-right">
              <select
                className="asa-rows-select"
                value={pendingRows}
                onChange={(e) => {
                  const v = e.target.value;
                  setPendingRows(v === "All" ? "All" : Number(v));
                }}
              >
                {ROWS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* ── Assignment History Table ── */}
          <div className="asa-card">
            <h2 className="asa-card-heading">
              Assignment History (Already Assigned Assets)
            </h2>
            <div className="asa-table-wrapper">
              <table className="asa-table">
                <thead>
                  <tr>
                    <th>Assignment ID</th>
                    <th>Request ID</th>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Asset Type</th>
                    <th>Asset Name / ID</th>
                    <th>Assigned Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="asa-no-data">
                        No assignment history found.
                      </td>
                    </tr>
                  ) : (
                    displayedHistory.map((entry) => (
                      <tr key={entry.assignmentId}>
                        <td>{entry.assignmentId}</td>
                        <td>{entry.requestId}</td>
                        <td>{entry.employeeId}</td>
                        <td>{entry.employeeName}</td>
                        <td>{entry.assetType}</td>
                        <td>{entry.assetNameId}</td>
                        <td>{entry.assignedDate}</td>
                        <td>
                          <span className="asa-badge asa-badge--assigned">
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="asa-rows-right">
              <select
                className="asa-rows-select"
                value={historyRows}
                onChange={(e) => {
                  const v = e.target.value;
                  setHistoryRows(v === "All" ? "All" : Number(v));
                }}
              >
                {ROWS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* ── Back Button ── */}
          <div className="asa-footer-row">
            <button className="asa-back-btn" onClick={onBack}>Back</button>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AssetAssignment;
