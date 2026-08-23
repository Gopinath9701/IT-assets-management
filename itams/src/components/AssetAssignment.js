import React, { useState, useEffect } from "react";
import "./AssetAssignment.css";

const ROWS_OPTIONS = [10, 30, 50, "All"];

// ==========================================
// EMPLOYEE ID VALIDATION
// Format: YYMMDD + 3 digits
// Example: 260821001
// ==========================================

const validateEmployeeId = (id) => {
  if (!id || id.length === 0) {
    return {
      isValid: false,
      message: "Employee ID is required",
    };
  }

  // No spaces anywhere
  if (/\s/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID should not contain spaces",
    };
  }

  // No leading or trailing spaces
  if (id !== id.trim()) {
    return {
      isValid: false,
      message: "Employee ID should not have leading or trailing spaces",
    };
  }

  // Numbers only
  if (!/^\d+$/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID must contain numbers only",
    };
  }

  // Exactly 9 digits
  if (id.length !== 9) {
    return {
      isValid: false,
      message: "Employee ID must be exactly 9 digits",
    };
  }

  // ==========================================
  // YYMMDD + 3 DIGITS
  // ==========================================

  const year = Number(id.substring(0, 2));
  const month = Number(id.substring(2, 4));
  const day = Number(id.substring(4, 6));
  const employeeNumber = id.substring(6, 9);

  // Month validation
  if (month < 1 || month > 12) {
    return {
      isValid: false,
      message: "Employee ID must contain a valid month",
    };
  }

  // Day basic validation
  if (day < 1 || day > 31) {
    return {
      isValid: false,
      message: "Employee ID must contain a valid day",
    };
  }

  // ==========================================
  // ACTUAL CALENDAR DATE VALIDATION
  // ==========================================

  const fullYear = 2000 + year;

  const employeeDate = new Date(
    fullYear,
    month - 1,
    day
  );

  if (
    employeeDate.getFullYear() !== fullYear ||
    employeeDate.getMonth() !== month - 1 ||
    employeeDate.getDate() !== day
  ) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid date",
    };
  }

  // ==========================================
  // FUTURE DATE NOT ALLOWED
  // ==========================================

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  employeeDate.setHours(0, 0, 0, 0);

  if (employeeDate > today) {
    return {
      isValid: false,
      message: "Future date Employee IDs are not allowed",
    };
  }

  // ==========================================
  // EMPLOYEE NUMBER
  // ==========================================

  if (!/^\d{3}$/.test(employeeNumber)) {
    return {
      isValid: false,
      message: "Last 3 digits must be employee numbers",
    };
  }

  if (employeeNumber === "000") {
    return {
      isValid: false,
      message: "Employee number cannot be 000",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// ==========================================
// INITIAL DATA
// Employee ID format: YYMMDD + 3 digits
// ==========================================

const INITIAL_PENDING = [
  {
    requestId: "AR001",
    employeeId: "260808001",
    employeeName: "Rahul Sharma",
    department: "IT",
    assetType: "Laptop",
    purpose: "Development Work",
    requiredDate: "10-08-2026",
    approvalDate: "08-08-2026",
  },
  {
    requestId: "AR004",
    employeeId: "260808004",
    employeeName: "Ananya Reddy",
    department: "HR",
    assetType: "Monitor",
    purpose: "New Employees",
    requiredDate: "12-08-2026",
    approvalDate: "09-08-2026",
  },
  {
    requestId: "AR006",
    employeeId: "260808007",
    employeeName: "Arjun Rao",
    department: "Finance",
    assetType: "Printer",
    purpose: "Office Work",
    requiredDate: "14-08-2026",
    approvalDate: "10-08-2026",
  },
];

// ==========================================
// ASSIGNMENT HISTORY
// ==========================================

const INITIAL_HISTORY = [
  {
    assignmentId: "ASG001",
    requestId: "AR002",
    employeeId: "260808002",
    employeeName: "Sneha Patel",
    assetType: "Laptop",
    assetNameId: "Dell Latitude 5420 (AST1001)",
    assignedDate: "09-08-2026",
    status: "Assigned",
  },
  {
    assignmentId: "ASG002",
    requestId: "AR003",
    employeeId: "260808003",
    employeeName: "Vikram Singh",
    assetType: "Keyboard",
    assetNameId: "Logitech K120 (AST2007)",
    assignedDate: "10-08-2026",
    status: "Assigned",
  },
  {
    assignmentId: "ASG003",
    requestId: "AR005",
    employeeId: "260808005",
    employeeName: "Priya Nair",
    assetType: "Monitor",
    assetNameId: 'HP 24" Monitor (AST3004)',
    assignedDate: "11-08-2026",
    status: "Assigned",
  },
];

let assignCounter = INITIAL_HISTORY.length + 1;

// ==========================================
// MAIN COMPONENT
// ==========================================

const AssetAssignment = ({
  username = "username",
  onLogout,
  onBack,
  onSidebarNavigate,
}) => {
  const [activeSidebar, setActiveSidebar] =
    useState("asset-assignment");

  // Search state
  const [searchEmpId, setSearchEmpId] = useState("");
  const [appliedEmpId, setAppliedEmpId] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearchTouched, setIsSearchTouched] = useState(false);

  // Table data — loaded from backend
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);

  // Load on mount
  useEffect(() => { loadData(); }, []); // eslint-disable-line

  const loadData = async () => {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
    try {
      const [pendResp, histResp] = await Promise.all([
        fetch("http://localhost:5000/api/asset-assignments/pending", { headers }),
        fetch("http://localhost:5000/api/asset-assignments/history", { headers }),
      ]);
      const pendData = await pendResp.json();
      const histData = await histResp.json();
      if (pendData.success) {
        setPending(
          (pendData.pending || []).map((r) => ({
            requestId: r.request_id,
            employeeId: r.employee_id,
            employeeName: r.employee_name || "-",
            department: r.department || "-",
            assetType: r.asset_type,
            purpose: r.purpose,
            requiredDate: r.required_date
              ? new Date(r.required_date).toLocaleDateString("en-GB").replace(/\//g, "-") : "-",
            approvalDate: r.approval_date
              ? new Date(r.approval_date).toLocaleDateString("en-GB").replace(/\//g, "-") : "-",
          }))
        );
      }
      if (histData.success) {
        setHistory(
          (histData.history || []).map((h) => ({
            assignmentId: h.assignment_id,
            requestId: h.request_id,
            employeeId: h.employee_id,
            employeeName: h.employee_name || "-",
            assetType: h.asset_type || "-",
            assetNameId: h.asset_name_id || "-",
            assignedDate: h.assigned_date
              ? new Date(h.assigned_date).toLocaleDateString("en-GB").replace(/\//g, "-") : "-",
            status: h.status,
          }))
        );
      }
    } catch (err) { console.error("Load assignment data error:", err); }
  };

  // Rows
  const [pendingRows, setPendingRows] = useState(10);
  const [historyRows, setHistoryRows] = useState(10);

  // Assign modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // ==========================================
  // SIDEBAR
  // ==========================================

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
    },
    {
      id: "asset-management",
      label: "Asset Management",
    },
    {
      id: "asset-assignment",
      label: "Asset Assignment",
    },
    {
      id: "request-approval",
      label: "Request Approval",
    },
    {
      id: "maintenance",
      label: "Maintenance",
    },
  ];

  const handleSidebarClick = (item) => {
    setActiveSidebar(item.id);

    if (onSidebarNavigate) {
      onSidebarNavigate(item.id);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = () => {
    setIsSearchTouched(true);
    setSearchError("");

    const result = validateEmployeeId(searchEmpId);

    if (!result.isValid) {
      setSearchError(result.message);
      setAppliedEmpId("");
      return;
    }

    setAppliedEmpId(searchEmpId);
    setSearchError("");
  };

  const handleSearchChange = (e) => {
    setSearchEmpId(e.target.value);
    setSearchError("");
    setIsSearchTouched(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredPending = pending.filter((r) =>
    appliedEmpId
      ? r.employeeId === appliedEmpId
      : true
  );

  const filteredHistory = history.filter((r) =>
    appliedEmpId
      ? r.employeeId === appliedEmpId
      : true
  );

  const displayedPending =
    pendingRows === "All"
      ? filteredPending
      : filteredPending.slice(0, pendingRows);

  const displayedHistory =
    historyRows === "All"
      ? filteredHistory
      : filteredHistory.slice(0, historyRows);

  // ==========================================
  // ASSIGN MODAL
  // ==========================================

  const openAssignModal = (req) => {
    setSelectedRequest(req);
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedRequest(null);
  };

  // ==========================================
  // CONFIRM ASSIGNMENT — calls backend
  // ==========================================

  const confirmAssign = async () => {
    if (!selectedRequest) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

      // Fetch first available asset of the required type
      const availResp = await fetch(
        `http://localhost:5000/api/asset-assignments/available-assets?type=${encodeURIComponent(selectedRequest.assetType)}`,
        { headers }
      );
      const availData = await availResp.json();
      const available = availData.assets || [];

      if (available.length === 0) {
        alert(`No available ${selectedRequest.assetType} assets to assign. Please add stock first.`);
        return;
      }

      const assetId = available[0].asset_id;

      const response = await fetch("http://localhost:5000/api/asset-assignments", {
        method: "POST",
        headers,
        body: JSON.stringify({ requestId: selectedRequest.requestId, assetId }),
      });
      const data = await response.json();

      if (!response.ok) { alert(data.message || "Failed to assign asset."); return; }

      alert(`Asset assigned successfully!\nAssignment ID: ${data.assignmentId}\nAsset: ${assetId}`);
      closeAssignModal();
      loadData();
    } catch (err) {
      console.error("Confirm Assign Error:", err);
      alert("Unable to connect to server.");
    }
  };

  // ==========================================
  // JSX
  // ==========================================

  return (
    <div className="asa-page-wrapper">

      {/* ======================================
          TOP NAVBAR
      ====================================== */}

      <nav className="asa-top-nav">
        <div className="asa-nav-logo">
          <span className="asa-nav-logo-title">
            ITAMS
          </span>

          <span className="asa-nav-logo-sub">
            IT Asset Management System
          </span>
        </div>

        <div className="asa-nav-right">
          <span className="asa-nav-username">
            {username}
          </span>

          <div className="asa-nav-divider" />

          <button
            className="asa-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="asa-body-wrapper">

        {/* ====================================
            SIDEBAR
        ==================================== */}

        <aside className="asa-sidebar">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={
                "asa-sidebar-item" +
                (activeSidebar === item.id
                  ? " asa-sidebar-item--active"
                  : "")
              }
              onClick={() =>
                handleSidebarClick(item)
              }
            >
              {item.label}
            </div>
          ))}
        </aside>

        {/* ====================================
            MAIN CONTENT
        ==================================== */}

        <main className="asa-main-content">

          <h1 className="asa-page-title">
            Asset Assignment
          </h1>

          <p className="asa-page-subtitle">
            Assign approved asset requests to employees.
          </p>

          {/* ==================================
              SEARCH
          ================================== */}

          <div className="asa-search-section">

            <label className="asa-search-label">
              Search by Employee ID
            </label>

            <div className="asa-search-row">

              <input
                className={
                  `asa-input ${
                    searchError && isSearchTouched
                      ? "asa-input-error"
                      : ""
                  }`
                }
                type="text"
                placeholder="Enter Employee ID (e.g., 260808001)"
                value={searchEmpId}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                maxLength={9}
              />

              <button
                className="asa-search-btn"
                onClick={handleSearch}
              >
                Search
              </button>

            </div>

            {/* ERROR */}

            {searchError && isSearchTouched && (
              <div className="asa-search-error">
                ⚠️ {searchError}
              </div>
            )}

            {/* VALIDATION HINT */}

            <div className="asa-validation-hint">
              <small>
                Format: YYMMDD + 3 employee numbers
                (e.g., 260808001, 260808002, 260808003)
              </small>
            </div>

          </div>

          {/* ==================================
              PENDING REQUESTS
          ================================== */}

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
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {displayedPending.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="asa-no-data"
                      >
                        No pending requests found.
                      </td>
                    </tr>
                  ) : (
                    displayedPending.map((req) => (
                      <tr key={req.requestId}>

                        <td>
                          {req.requestId}
                        </td>

                        <td>
                          <span className="asa-employee-id">
                            {req.employeeId}
                          </span>
                        </td>

                        <td>
                          {req.employeeName}
                        </td>

                        <td>
                          {req.department}
                        </td>

                        <td>
                          {req.assetType}
                        </td>

                        <td>
                          {req.purpose}
                        </td>

                        <td>
                          {req.requiredDate}
                        </td>

                        <td>
                          {req.approvalDate}
                        </td>

                        <td>

                          <button
                            className="asa-assign-btn"
                            onClick={() =>
                              openAssignModal(req)
                            }
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

              <span className="asa-pagination-info">
                Showing {displayedPending.length} of{" "}
                {filteredPending.length} requests
              </span>

              <select
                className="asa-rows-select"
                value={pendingRows}
                onChange={(e) => {
                  const value = e.target.value;

                  setPendingRows(
                    value === "All"
                      ? "All"
                      : Number(value)
                  );
                }}
              >

                {ROWS_OPTIONS.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* ==================================
              ASSIGNMENT HISTORY
          ================================== */}

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
                      <td
                        colSpan={8}
                        className="asa-no-data"
                      >
                        No assignment history found.
                      </td>
                    </tr>
                  ) : (
                    displayedHistory.map((entry) => (
                      <tr key={entry.assignmentId}>

                        <td>
                          {entry.assignmentId}
                        </td>

                        <td>
                          {entry.requestId}
                        </td>

                        <td>
                          <span className="asa-employee-id">
                            {entry.employeeId}
                          </span>
                        </td>

                        <td>
                          {entry.employeeName}
                        </td>

                        <td>
                          {entry.assetType}
                        </td>

                        <td>
                          {entry.assetNameId}
                        </td>

                        <td>
                          {entry.assignedDate}
                        </td>

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

              <span className="asa-pagination-info">
                Showing {displayedHistory.length} of{" "}
                {filteredHistory.length} records
              </span>

              <select
                className="asa-rows-select"
                value={historyRows}
                onChange={(e) => {
                  const value = e.target.value;

                  setHistoryRows(
                    value === "All"
                      ? "All"
                      : Number(value)
                  );
                }}
              >

                {ROWS_OPTIONS.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* ==================================
              BACK
          ================================== */}

          <div className="asa-footer-row">

            <button
              className="asa-back-btn"
              onClick={onBack}
            >
              ← Back
            </button>

          </div>

        </main>

      </div>

      {/* ======================================
          SIMPLE ASSIGN MODAL
      ====================================== */}

      {showAssignModal && selectedRequest && (

        <div
          className="asa-modal-overlay"
          onClick={closeAssignModal}
        >

          <div
            className="asa-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="asa-modal-header">

              <h2 className="asa-modal-title">
                Assign Asset
              </h2>

              <button
                className="asa-modal-close"
                onClick={closeAssignModal}
              >
                ✕
              </button>

            </div>

            {/* NO OTHER FIELDS */}

            <div className="asa-modal-footer">

              <button
                className="asa-modal-cancel"
                onClick={closeAssignModal}
              >
                Cancel
              </button>

              <button
                className="asa-modal-confirm"
                onClick={confirmAssign}
              >
                Confirm Assignment
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AssetAssignment;
