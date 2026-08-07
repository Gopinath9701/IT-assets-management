import React, { useState } from "react";
import "./RequestApproval.css";

const ASSET_TYPES = ["All Assets", "Laptop", "Monitor", "Keyboard", "Mouse", "Printer", "Desktop"];
const ROWS_OPTIONS = [10, 30, 50, "All"];

const INITIAL_REQUESTS = [
  {
    id: "AR001",
    employeeId: "EMP001",
    employeeName: "Employee 1",
    department: "IT",
    assetType: "Laptop",
    purpose: "Development Work",
    requiredDate: "10-08-2026",
    status: "Pending",
    rejectionReason: "",
  },
  {
    id: "AR002",
    employeeId: "EMP004",
    employeeName: "Employee 4",
    department: "HR",
    assetType: "Monitor",
    purpose: "New Employees",
    requiredDate: "12-08-2026",
    status: "Pending",
    rejectionReason: "",
  },
  {
    id: "AR003",
    employeeId: "EMP010",
    employeeName: "Employee 10",
    department: "Finance",
    assetType: "Keyboard",
    purpose: "Replacement",
    requiredDate: "15-08-2026",
    status: "Pending",
    rejectionReason: "",
  },
];

const RequestApproval = ({ username = "username", onLogout, onBack, onSidebarNavigate }) => {
  const [activeSidebar, setActiveSidebar] = useState("request-approval");

  // Search state
  const [searchEmpId, setSearchEmpId]   = useState("");
  const [searchType, setSearchType]     = useState("All Assets");
  const [appliedEmpId, setAppliedEmpId] = useState("");
  const [appliedType, setAppliedType]   = useState("All Assets");

  // Table state
  const [requests, setRequests]         = useState(INITIAL_REQUESTS);
  const [rowsPerPage, setRowsPerPage]   = useState(10);
  const [selectedReq, setSelectedReq]   = useState(INITIAL_REQUESTS[0]);

  // Rejection reason
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectError, setRejectError]         = useState("");

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
  const handleSearch = () => {
    setAppliedEmpId(searchEmpId.trim());
    setAppliedType(searchType);
  };

  const filtered = requests.filter((r) => {
    const empMatch  = appliedEmpId ? r.employeeId.toLowerCase().includes(appliedEmpId.toLowerCase()) : true;
    const typeMatch = appliedType === "All Assets" ? true : r.assetType === appliedType;
    return empMatch && typeMatch;
  });

  const displayed = rowsPerPage === "All" ? filtered : filtered.slice(0, rowsPerPage);

  // ── Approve ──────────────────────────────────────────────────
  const handleApprove = () => {
    if (!selectedReq) return;
    setRequests((prev) =>
      prev.map((r) => r.id === selectedReq.id ? { ...r, status: "Approved" } : r)
    );
    setSelectedReq((prev) => ({ ...prev, status: "Approved" }));
    setRejectionReason("");
    setRejectError("");
  };

  // ── Reject ───────────────────────────────────────────────────
  const handleReject = () => {
    if (!selectedReq) return;
    if (!rejectionReason.trim()) {
      setRejectError("Reason for rejection is required.");
      return;
    }
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedReq.id ? { ...r, status: "Rejected", rejectionReason } : r
      )
    );
    setSelectedReq((prev) => ({ ...prev, status: "Rejected", rejectionReason }));
    setRejectError("");
  };

  // When a row is selected, reset rejection state
  const selectRequest = (req) => {
    setSelectedReq(req);
    setRejectionReason(req.rejectionReason || "");
    setRejectError("");
  };

  const statusClass = (s) => {
    if (s === "Approved") return "ra-badge--approved";
    if (s === "Rejected") return "ra-badge--rejected";
    return "ra-badge--pending";
  };

  return (
    <div className="ra-page-wrapper">

      {/* ── Top Navbar ── */}
      <nav className="ra-top-nav">
        <div className="ra-nav-logo">
          <span className="ra-nav-logo-title">ITAMS</span>
          <span className="ra-nav-logo-sub">IT Asset Management System</span>
        </div>
        <div className="ra-nav-right">
          <span className="ra-nav-username">{username}</span>
          <div className="ra-nav-divider" />
          <button className="ra-logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div className="ra-body-wrapper">

        {/* ── Sidebar ── */}
        <aside className="ra-sidebar">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={
                "ra-sidebar-item" +
                (activeSidebar === item.id ? " ra-sidebar-item--active" : "")
              }
              onClick={() => handleSidebarClick(item)}
            >
              {item.label}
            </div>
          ))}
        </aside>

        {/* ── Main Content ── */}
        <main className="ra-main-content">
          <h1 className="ra-page-title">Request Approval</h1>
          <p className="ra-page-subtitle">
            Review and approve or reject asset requests.
          </p>

          {/* ── Search Request Card ── */}
          <div className="ra-card">
            <h2 className="ra-card-heading">Search Request</h2>
            <div className="ra-search-row">
              <div className="ra-field-group">
                <label className="ra-field-label">Employee ID</label>
                <input
                  className="ra-input"
                  type="text"
                  placeholder="Enter employee ID"
                  value={searchEmpId}
                  onChange={(e) => setSearchEmpId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="ra-field-group">
                <label className="ra-field-label">Asset Type</label>
                <select
                  className="ra-select"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  {ASSET_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <button className="ra-search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          {/* ── Pending Request List Card ── */}
          <div className="ra-card ra-card--table">
            <h2 className="ra-card-heading">Pending Request List</h2>

            <div className="ra-table-wrapper">
              <table className="ra-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Employee ID</th>
                    <th>Asset Type</th>
                    <th>Purpose</th>
                    <th>Required Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="ra-no-data">No requests found.</td>
                    </tr>
                  ) : (
                    displayed.map((req) => (
                      <tr
                        key={req.id}
                        className={
                          "ra-table-row" +
                          (selectedReq && selectedReq.id === req.id ? " ra-table-row--selected" : "")
                        }
                        onClick={() => selectRequest(req)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{req.id}</td>
                        <td>{req.employeeId}</td>
                        <td>{req.assetType}</td>
                        <td>{req.purpose}</td>
                        <td>{req.requiredDate}</td>
                        <td>
                          <span className={`ra-badge ${statusClass(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* rows-per-page top-right of this card */}
            <div className="ra-rows-right">
              <select
                className="ra-rows-select"
                value={rowsPerPage}
                onChange={(e) => {
                  const v = e.target.value;
                  setRowsPerPage(v === "All" ? "All" : Number(v));
                }}
              >
                {ROWS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* ── Request Details Card ── */}
          {selectedReq && (
            <div className="ra-card ra-card--details">
              <h2 className="ra-card-heading">Request Details</h2>

              <div className="ra-details-grid">
                {/* Left column */}
                <div className="ra-details-col">
                  <div className="ra-detail-row">
                    <span className="ra-detail-label">Request ID</span>
                    <span className="ra-detail-sep">:</span>
                    <span className="ra-detail-value">{selectedReq.id}</span>
                  </div>
                  <div className="ra-detail-row">
                    <span className="ra-detail-label">Employee ID</span>
                    <span className="ra-detail-sep">:</span>
                    <span className="ra-detail-value">{selectedReq.employeeId}</span>
                  </div>
                  <div className="ra-detail-row">
                    <span className="ra-detail-label">Employee Name</span>
                    <span className="ra-detail-sep">:</span>
                    <span className="ra-detail-value">{selectedReq.employeeName}</span>
                  </div>
                  <div className="ra-detail-row">
                    <span className="ra-detail-label">Department</span>
                    <span className="ra-detail-sep">:</span>
                    <span className="ra-detail-value">{selectedReq.department}</span>
                  </div>
                </div>

                {/* Middle column */}
                <div className="ra-details-col">
                  <div className="ra-detail-row">
                    <span className="ra-detail-label">Asset Type</span>
                    <span className="ra-detail-sep">:</span>
                    <span className="ra-detail-value">{selectedReq.assetType}</span>
                  </div>
                  <div className="ra-detail-row">
                    <span className="ra-detail-label">Purpose</span>
                    <span className="ra-detail-sep">:</span>
                    <span className="ra-detail-value">{selectedReq.purpose}</span>
                  </div>
                  <div className="ra-detail-row">
                    <span className="ra-detail-label">Required Date</span>
                    <span className="ra-detail-sep">:</span>
                    <span className="ra-detail-value">{selectedReq.requiredDate}</span>
                  </div>
                </div>

                {/* Right column — status + approve */}
                <div className="ra-details-col ra-details-col--right">
                  <div className="ra-status-row">
                    <span className="ra-detail-label">Request Status</span>
                    <span className="ra-detail-sep">:</span>
                    <span className={`ra-badge ${statusClass(selectedReq.status)}`}>
                      {selectedReq.status}
                    </span>
                  </div>
                  <button
                    className="ra-approve-btn"
                    onClick={handleApprove}
                    disabled={selectedReq.status === "Approved" || selectedReq.status === "Rejected"}
                  >
                    Approve
                  </button>
                </div>
              </div>

              {/* Rejection section */}
              <div className="ra-rejection-section">
                <label className="ra-rejection-label">
                  Reason for Rejection{" "}
                  <span className="ra-rejection-hint">(required if rejecting)</span>
                </label>
                <div className="ra-rejection-row">
                  <textarea
                    className={`ra-textarea${rejectError ? " ra-textarea--error" : ""}`}
                    placeholder="Enter reason for rejection"
                    value={rejectionReason}
                    onChange={(e) => {
                      setRejectionReason(e.target.value);
                      setRejectError("");
                    }}
                    rows={3}
                    disabled={selectedReq.status === "Approved" || selectedReq.status === "Rejected"}
                  />
                  <button
                    className="ra-reject-btn"
                    onClick={handleReject}
                    disabled={selectedReq.status === "Approved" || selectedReq.status === "Rejected"}
                  >
                    Reject
                  </button>
                </div>
                {rejectError && <span className="ra-error">{rejectError}</span>}
              </div>
            </div>
          )}

          {/* ── Footer: Back + rows-per-page ── */}
          <div className="ra-footer-row">
            <button className="ra-back-btn" onClick={onBack}>Back</button>
            <select
              className="ra-rows-select"
              value={rowsPerPage}
              onChange={(e) => {
                const v = e.target.value;
                setRowsPerPage(v === "All" ? "All" : Number(v));
              }}
            >
              {ROWS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

        </main>
      </div>
    </div>
  );
};

export default RequestApproval;
