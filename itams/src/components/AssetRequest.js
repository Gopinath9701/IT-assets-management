import React, { useState } from "react";
import "./AssetRequest.css";

const INITIAL_REQUESTS = [
  { id: "AR001 (Automatic Generated)", assetType: "Laptop",   employeeId: "EMP001", status: "Pending",  date: "01-07-2026" },
  { id: "AR002 (Automatic Generated)", assetType: "Monitor",  employeeId: "EMP002", status: "Approved", date: "28-06-2026" },
  { id: "AR003 (Automatic Generated)", assetType: "Keyboard", employeeId: "EMP003", status: "Rejected", date: "25-06-2026" },
  { id: "AR004 (Automatic Generated)", assetType: "Printer",  employeeId: "EMP004", status: "Pending",  date: "20-06-2026" },
];

const VALID_EMPLOYEE_IDS = ["EMP001", "EMP002", "EMP003", "EMP004", "EMP005"];
const ASSET_TYPES = ["Laptop", "Monitor", "Keyboard", "Printer", "Desktop", "Mouse", "Headset", "Webcam"];
const PAGE_SIZE_OPTIONS = [10, 30, 50, "All"];

const AssetRequest = ({ username = "username", onLogout, onBack }) => {

  const [employeeId, setEmployeeId]     = useState("");
  const [assetType, setAssetType]       = useState("");
  const [purpose, setPurpose]           = useState("");
  const [requiredDate, setRequiredDate] = useState("");
  const [empIdError, setEmpIdError]     = useState(false);

  const [searchInput, setSearchInput]   = useState("");
  const [searchId, setSearchId]         = useState("");

  const [requests, setRequests]         = useState(INITIAL_REQUESTS);
  const [pageSize, setPageSize]         = useState(10);

  const handleEmployeeIdBlur = () => {
    if (employeeId && !VALID_EMPLOYEE_IDS.includes(employeeId.toUpperCase())) {
      setEmpIdError(true);
    } else {
      setEmpIdError(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeId || !assetType || !purpose || !requiredDate) {
      alert("Please fill all fields.");
      return;
    }
    if (!VALID_EMPLOYEE_IDS.includes(employeeId.toUpperCase())) {
      setEmpIdError(true);
      return;
    }
    const newReq = {
      id: `AR00${requests.length + 1} (Automatic Generated)`,
      assetType,
      employeeId: employeeId.toUpperCase(),
      status: "Pending",
      date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
    };
    setRequests([newReq, ...requests]);
    handleCancel();
  };

  const handleCancel = () => {
    setEmployeeId("");
    setAssetType("");
    setPurpose("");
    setRequiredDate("");
    setEmpIdError(false);
  };

  const handleSearch = () => setSearchId(searchInput.trim().toUpperCase());

  const filteredRequests = searchId
    ? requests.filter((r) => r.employeeId === searchId)
    : requests;

  const visibleRequests =
    pageSize === "All" ? filteredRequests : filteredRequests.slice(0, Number(pageSize));

  const statusColor = (s) =>
    s === "Approved" ? "#16a34a" : s === "Rejected" ? "#dc2626" : "#b45309";
  const statusBg = (s) =>
    s === "Approved" ? "#dcfce7" : s === "Rejected" ? "#fee2e2" : "#fef3c7";

  return (
    <div className="ar-page">

      {/* ── Navbar ── */}
      <nav className="ar-nav">
        <div className="ar-nav-logo">
          <span className="ar-nav-title">ITAMS</span>
          <span className="ar-nav-sub">IT Asset Management System</span>
        </div>
        <div className="ar-nav-right">
          <span className="ar-nav-user">{username}</span>
          <span className="ar-nav-divider">|</span>
          <button className="ar-logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="ar-body">

        <h1 className="ar-page-title">Asset Request</h1>
        <p className="ar-page-sub">Request a new IT asset from the Asset Manager.</p>

        {/* ── Form Card ── */}
        <div className="ar-card">
          <h2 className="ar-card-title">Asset Request Details</h2>

          <form onSubmit={handleSubmit} noValidate>

            <div className="ar-form-group">
              <label className="ar-label">Employee ID</label>
              <input
                className={`ar-input${empIdError ? " ar-input-error" : ""}`}
                type="text"
                placeholder="Enter Employee ID"
                value={employeeId}
                onChange={(e) => { setEmployeeId(e.target.value); setEmpIdError(false); }}
                onBlur={handleEmployeeIdBlur}
              />
              {empIdError && (
                <span className="ar-error-text">
                  Invalid Employee ID (If that employee ID is not present in database)
                </span>
              )}
            </div>

            <div className="ar-form-group">
              <label className="ar-label">Asset Type</label>
              <select
                className="ar-select"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
              >
                <option value="">Select Asset Type</option>
                {ASSET_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="ar-form-group">
              <label className="ar-label">Purpose</label>
              <textarea
                className="ar-textarea"
                placeholder="Enter Purpose"
                rows={4}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div className="ar-form-group">
              <label className="ar-label">Required Date</label>
              <input
                className="ar-input"
                type="date"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
              />
            </div>

            <div className="ar-btn-row">
              <button type="submit" className="ar-submit-btn">Submit Request</button>
              <button type="button" className="ar-cancel-btn" onClick={handleCancel}>Cancel</button>
            </div>

          </form>
        </div>

        {/* ── Search Card ── */}
        <div className="ar-card">
          <h2 className="ar-card-title">Search Employee</h2>
          <div className="ar-form-group">
            <label className="ar-label">Employee ID</label>
            <div className="ar-search-row">
              <input
                className="ar-input"
                type="text"
                placeholder="Enter Employee ID"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="ar-search-btn" onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>

        {/* ── Request History Card ── */}
        <div className="ar-card">
          <h2 className="ar-card-title">Request History</h2>
          <div className="ar-table-wrapper">
            <table className="ar-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Asset Type</th>
                  <th>Employee ID</th>
                  <th>Status</th>
                  <th>Request Date</th>
                </tr>
              </thead>
              <tbody>
                {visibleRequests.length > 0 ? (
                  visibleRequests.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.assetType}</td>
                      <td>{r.employeeId}</td>
                      <td>
                        <span
                          className="ar-status-badge"
                          style={{
                            color: statusColor(r.status),
                            backgroundColor: statusBg(r.status),
                          }}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td>{r.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="ar-no-data">No requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="ar-pagination-row">
            <select
              className="ar-page-size"
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

        {/* ── Back ── */}
        <button className="ar-back-btn" onClick={onBack}>Back</button>

      </div>
    </div>
  );
};

export default AssetRequest;

