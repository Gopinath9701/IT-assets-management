import React, { useState, useEffect } from "react";
import "./RequestApproval.css";

const ASSET_TYPES = [
  "All Assets",
  "Laptop",
  "Desktop",
  "Monitor",
  "Keyboard",
  "Webcam",
  "Projector",
  "Mouse",
  "CPU",
  "Printer",
  "Headset",
  "Scanner",
];

const ROWS_OPTIONS = [10, 30, 50, "All"];

// =====================================================
// VALIDATION - REJECTION DESCRIPTION
// =====================================================

const validateRejectionReason = (reason) => {
  if (!reason || reason.length === 0) {
    return {
      isValid: false,
      message:
        "Reason for rejection is required.",
    };
  }

  // Leading/trailing spaces
  if (reason !== reason.trim()) {
    return {
      isValid: false,
      message:
        "Reason for rejection should not have leading or trailing spaces.",
    };
  }

  // Multiple spaces
  if (/\s{2,}/.test(reason)) {
    return {
      isValid: false,
      message:
        "Reason for rejection should not contain multiple consecutive spaces.",
    };
  }

  // Only letters, numbers and single spaces
  if (!/^[A-Za-z0-9 ]+$/.test(reason)) {
    return {
      isValid: false,
      message:
        "Reason for rejection should contain only letters, numbers and single spaces.",
    };
  }

  // Minimum 10 characters
  if (reason.length < 10) {
    return {
      isValid: false,
      message:
        "Reason for rejection must be at least 10 characters.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// =====================================================
// VALIDATION - REQUIRED DATE
// Format: DD-MM-YYYY
// =====================================================

const validateRequiredDate = (date) => {
  if (!date || date.trim() === "") {
    return {
      isValid: false,
      message: "Required date is required.",
    };
  }

  if (!/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    return {
      isValid: false,
      message:
        "Required date must be in DD-MM-YYYY format.",
    };
  }

  const [day, month, year] = date
    .split("-")
    .map(Number);

  const dateObject = new Date(
    year,
    month - 1,
    day
  );

  if (
    dateObject.getFullYear() !== year ||
    dateObject.getMonth() !== month - 1 ||
    dateObject.getDate() !== day
  ) {
    return {
      isValid: false,
      message: "Please enter a valid required date.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// =====================================================
// INITIAL DATA
// Employee IDs now use YYMMDD + 3 numbers
// =====================================================

const INITIAL_REQUESTS = [
  {
    id: "AR001",
    employeeId: "260808001",
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
    employeeId: "260808002",
    employeeName: "Employee 2",
    department: "HR",
    assetType: "Monitor",
    purpose: "New Employees",
    requiredDate: "12-08-2026",
    status: "Pending",
    rejectionReason: "",
  },

  {
    id: "AR003",
    employeeId: "260808003",
    employeeName: "Employee 3",
    department: "Finance",
    assetType: "Keyboard",
    purpose: "Replacement",
    requiredDate: "15-08-2026",
    status: "Pending",
    rejectionReason: "",
  },
];

// =====================================================
// MAIN COMPONENT
// =====================================================

const RequestApproval = ({
  username = "username",
  onLogout,
  onBack,
  onSidebarNavigate,
}) => {
  const [activeSidebar, setActiveSidebar] =
    useState("request-approval");

  // ===================================================
  // SEARCH STATE
  // Live filter - `filtered` (below) re-derives from these on every
  // keystroke/selection, no Search button/Enter needed.
  // ===================================================

  const [searchEmpId, setSearchEmpId] =
    useState("");

  const [searchType, setSearchType] =
    useState("All Assets");

  // ===================================================
  // TABLE STATE — loaded from backend
  // ===================================================

  const [requests, setRequests] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedReq, setSelectedReq] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionMessageIsError, setActionMessageIsError] = useState(false);

  // Status banner clears itself after a few seconds instead of sitting
  // there until the next action overwrites it.
  useEffect(() => {
    if (!actionMessage) return;
    const timer = setTimeout(() => setActionMessage(""), 3500);
    return () => clearTimeout(timer);
  }, [actionMessage]);

  // Load all requests on mount
  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/asset-requests", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && data.requests) {
        setRequests(
          data.requests.map((r) => ({
            id: r.request_id,
            employeeId: r.employee_id,
            employeeName: r.employee_name || "-",
            department: r.department || "-",
            assetType: r.asset_type,
            purpose: r.purpose,
            requiredDate: r.required_date
              ? new Date(r.required_date).toLocaleDateString("en-GB").replace(/\//g, "-")
              : "-",
            status: r.status,
            rejectionReason: r.rejection_reason || "",
          }))
        );
      }
    } catch (err) {
      console.error("Load Requests Error:", err);
    }
  };

  // ===================================================
  // REJECTION STATE
  // ===================================================

  const [rejectionReason, setRejectionReason] =
    useState("");

  const [rejectError, setRejectError] =
    useState("");

  // ===================================================
  // SIDEBAR
  // ===================================================

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

  // ===================================================
  // SEARCH INPUT CHANGE / ASSET TYPE CHANGE
  // ===================================================

  const handleSearchChange = (e) => {
    setSearchEmpId(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  // ===================================================
  // FILTER
  // ===================================================

  const filtered = requests.filter((request) => {
    const empMatch = searchEmpId
      ? request.employeeId
          .toLowerCase()
          .includes(
            searchEmpId.trim().toLowerCase()
          )
      : true;

    const typeMatch =
      searchType === "All Assets"
        ? true
        : request.assetType ===
          searchType;

    return empMatch && typeMatch;
  });

  // ===================================================
  // DISPLAYED REQUESTS
  // ===================================================

  const displayed =
    rowsPerPage === "All"
      ? filtered
      : filtered.slice(
          0,
          rowsPerPage
        );

  // ===================================================
  // SELECT REQUEST
  // ===================================================

  const selectRequest = (request) => {
    setSelectedReq(request);

    setRejectionReason(
      request.rejectionReason || ""
    );

    setRejectError("");
  };

  // ===================================================
  // APPROVE — calls backend
  // ===================================================

  const handleApprove = async () => {
    if (!selectedReq || selectedReq.status === "Approved" || selectedReq.status === "Rejected") return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/asset-requests/${selectedReq.id}/approve`,
        { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (!response.ok) {
        setActionMessageIsError(true);
        setActionMessage(data.message || "Failed to approve.");
        return;
      }
      setActionMessageIsError(false);
      setActionMessage(`✅ Request ${selectedReq.id} approved successfully!`);
      setSelectedReq(null);
      setRejectionReason("");
      setRejectError("");
      loadRequests();
    } catch (err) {
      setActionMessageIsError(true);
      setActionMessage("Unable to connect to server.");
    }
  };

  // ===================================================
  // REJECT — calls backend
  // ===================================================

  const handleReject = async () => {
    if (!selectedReq || selectedReq.status === "Approved" || selectedReq.status === "Rejected") return;

    const result = validateRejectionReason(rejectionReason);
    if (!result.isValid) { setRejectError(result.message); return; }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/asset-requests/${selectedReq.id}/reject`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ reason: rejectionReason.trim() }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setActionMessageIsError(true);
        setActionMessage(data.message || "Failed to reject.");
        return;
      }
      setActionMessageIsError(false);
      setActionMessage(`❌ Request ${selectedReq.id} rejected.`);
      setSelectedReq(null);
      setRejectionReason("");
      setRejectError("");
      loadRequests();
    } catch (err) {
      setActionMessageIsError(true);
      setActionMessage("Unable to connect to server.");
    }
  };

  // ===================================================
  // STATUS CLASS
  // ===================================================

  const statusClass = (status) => {
    if (status === "Approved") {
      return "ra-badge--approved";
    }

    if (status === "Rejected") {
      return "ra-badge--rejected";
    }

    return "ra-badge--pending";
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="ra-page-wrapper">

      {/* TOP NAVBAR */}

      <nav className="ra-top-nav">

        <div className="ra-nav-logo">

          <span className="ra-nav-logo-title">
            ITAMS
          </span>

          <span className="ra-nav-logo-sub">
            IT Asset Management System
          </span>

        </div>

        <div className="ra-nav-right">

          <span className="ra-nav-username">
            {username}
          </span>

          <div className="ra-nav-divider" />

          <button
            className="ra-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* BODY */}

      <div className="ra-body-wrapper">

        {/* SIDEBAR */}

        <aside className="ra-sidebar">

          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={
                "ra-sidebar-item" +
                (
                  activeSidebar ===
                  item.id
                    ? " ra-sidebar-item--active"
                    : ""
                )
              }
              onClick={() =>
                handleSidebarClick(item)
              }
            >
              {item.label}
            </div>
          ))}

        </aside>

        {/* MAIN */}

        <main className="ra-main-content">

          <h1 className="ra-page-title">
            Request Approval
          </h1>

          <p className="ra-page-subtitle">
            Review and approve or reject asset requests.
          </p>

          {actionMessage && (
            <div
              style={{
                color: actionMessageIsError ? "#d93025" : "#188038",
                fontSize: "13px",
                marginBottom: "10px",
              }}
            >
              {actionMessageIsError ? "⚠️ " : ""}
              {actionMessage}
            </div>
          )}

          {/* SEARCH */}

          <div className="ra-card">

            <h2 className="ra-card-heading">
              Search Request
            </h2>

            <div className="ra-search-row">

              {/* EMPLOYEE ID */}

              <div className="ra-field-group">

                <label className="ra-field-label">
                  Employee ID
                </label>

                <input
                  className="ra-input"
                  type="text"
                  placeholder="Type to filter by Employee ID"
                  value={searchEmpId}
                  onChange={
                    handleSearchChange
                  }
                  maxLength={9}
                />

              </div>

              {/* ASSET TYPE */}

              <div className="ra-field-group">

                <label className="ra-field-label">
                  Asset Type
                </label>

                <select
                  className="ra-select"
                  value={searchType}
                  onChange={
                    handleSearchTypeChange
                  }
                >
                  {ASSET_TYPES.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}
                </select>

              </div>

            </div>

            {/* EMPLOYEE ID HINT */}

            <div className="ra-validation-hint">
              <small>
                Format: YYMMDD + 3 employee numbers
                (e.g., 260808001, 260808002, 260808003)
              </small>
            </div>

          </div>

          {/* TABLE */}

          <div className="ra-card ra-card--table">

            <h2 className="ra-card-heading">
              Pending Request List
            </h2>

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

                      <td
                        colSpan={6}
                        className="ra-no-data"
                      >
                        No requests found.
                      </td>

                    </tr>

                  ) : (

                    displayed.map(
                      (request) => (

                        <tr
                          key={request.id}
                          className={
                            "ra-table-row" +
                            (
                              selectedReq &&
                              selectedReq.id ===
                                request.id
                                ? " ra-table-row--selected"
                                : ""
                            )
                          }
                          onClick={() =>
                            selectRequest(
                              request
                            )
                          }
                          style={{
                            cursor:
                              "pointer",
                          }}
                        >

                          <td>
                            {request.id}
                          </td>

                          <td>

                            <span className="ra-employee-id">
                              {request.employeeId}
                            </span>

                          </td>

                          <td>
                            {request.assetType}
                          </td>

                          <td>
                            {request.purpose}
                          </td>

                          <td>
                            {request.requiredDate}
                          </td>

                          <td>

                            <span
                              className={
                                `ra-badge ${statusClass(
                                  request.status
                                )}`
                              }
                            >
                              {request.status}
                            </span>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

            {/* TABLE FOOTER */}

            <div className="ra-rows-right">

              <span className="ra-pagination-info">
                Showing{" "}
                {displayed.length}{" "}
                of{" "}
                {filtered.length}{" "}
                requests
              </span>

              <select
                className="ra-rows-select"
                value={rowsPerPage}
                onChange={(e) => {

                  const value =
                    e.target.value;

                  setRowsPerPage(
                    value === "All"
                      ? "All"
                      : Number(value)
                  );

                }}
              >

                {ROWS_OPTIONS.map(
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

          </div>

          {/* REQUEST DETAILS */}

          {selectedReq && (

            <div className="ra-card ra-card--details">

              <h2 className="ra-card-heading">
                Request Details
              </h2>

              <div className="ra-details-grid">

                {/* LEFT */}

                <div className="ra-details-col">

                  <div className="ra-detail-row">

                    <span className="ra-detail-label">
                      Request ID
                    </span>

                    <span className="ra-detail-sep">
                      :
                    </span>

                    <span className="ra-detail-value">
                      {selectedReq.id}
                    </span>

                  </div>

                  <div className="ra-detail-row">

                    <span className="ra-detail-label">
                      Employee ID
                    </span>

                    <span className="ra-detail-sep">
                      :
                    </span>

                    <span className="ra-detail-value">
                      {selectedReq.employeeId}
                    </span>

                  </div>

                  <div className="ra-detail-row">

                    <span className="ra-detail-label">
                      Employee Name
                    </span>

                    <span className="ra-detail-sep">
                      :
                    </span>

                    <span className="ra-detail-value">
                      {selectedReq.employeeName}
                    </span>

                  </div>

                  <div className="ra-detail-row">

                    <span className="ra-detail-label">
                      Department
                    </span>

                    <span className="ra-detail-sep">
                      :
                    </span>

                    <span className="ra-detail-value">
                      {selectedReq.department}
                    </span>

                  </div>

                </div>

                {/* MIDDLE */}

                <div className="ra-details-col">

                  <div className="ra-detail-row">

                    <span className="ra-detail-label">
                      Asset Type
                    </span>

                    <span className="ra-detail-sep">
                      :
                    </span>

                    <span className="ra-detail-value">
                      {selectedReq.assetType}
                    </span>

                  </div>

                  <div className="ra-detail-row">

                    <span className="ra-detail-label">
                      Purpose
                    </span>

                    <span className="ra-detail-sep">
                      :
                    </span>

                    <span className="ra-detail-value">
                      {selectedReq.purpose}
                    </span>

                  </div>

                  <div className="ra-detail-row">

                    <span className="ra-detail-label">
                      Required Date
                    </span>

                    <span className="ra-detail-sep">
                      :
                    </span>

                    <span className="ra-detail-value">
                      {selectedReq.requiredDate}
                    </span>

                  </div>

                </div>

                {/* RIGHT */}

                <div className="ra-details-col ra-details-col--right">

                  <div className="ra-status-row">

                    <span className="ra-detail-label">
                      Request Status
                    </span>

                    <span className="ra-detail-sep">
                      :
                    </span>

                    <span
                      className={
                        `ra-badge ${statusClass(
                          selectedReq.status
                        )}`
                      }
                    >
                      {selectedReq.status}
                    </span>

                  </div>

                  <button
                    className="ra-approve-btn"
                    onClick={
                      handleApprove
                    }
                    disabled={
                      selectedReq.status ===
                        "Approved" ||
                      selectedReq.status ===
                        "Rejected"
                    }
                  >
                    Approve
                  </button>

                </div>

              </div>

              {/* REJECTION DESCRIPTION */}

              <div className="ra-rejection-section">

                <label className="ra-rejection-label">

                  Description for Rejection{" "}

                  <span className="ra-rejection-hint">
                    (required if rejecting)
                  </span>

                </label>

                <div className="ra-rejection-row">

                  <textarea
                    className={
                      `ra-textarea${
                        rejectError
                          ? " ra-textarea--error"
                          : ""
                      }`
                    }
                    placeholder="Enter description for rejection"
                    value={rejectionReason}
                    onChange={(e) => {

                      setRejectionReason(
                        e.target.value
                      );

                      setRejectError("");

                    }}
                    rows={3}
                    disabled={
                      selectedReq.status ===
                        "Approved" ||
                      selectedReq.status ===
                        "Rejected"
                    }
                  />

                  <button
                    className="ra-reject-btn"
                    onClick={
                      handleReject
                    }
                    disabled={
                      selectedReq.status ===
                        "Approved" ||
                      selectedReq.status ===
                        "Rejected"
                    }
                  >
                    Reject
                  </button>

                </div>

                {/* DESCRIPTION ERROR */}

                {rejectError && (

                  <span className="ra-error">
                    ⚠️ {rejectError}
                  </span>

                )}

                {/* DESCRIPTION VALIDATION */}

                <div className="ra-validation-hint">

                  <small>
                    Minimum 10 characters required.
                    No leading/trailing spaces,
                    no multiple spaces and no
                    special characters.
                  </small>

                </div>

              </div>

            </div>

          )}

          {/* BACK */}

          <div className="ra-footer-row">

            <button
              className="ra-back-btn"
              onClick={onBack}
            >
              ← Back
            </button>

          </div>

        </main>

      </div>

    </div>
  );
};

export default RequestApproval;
