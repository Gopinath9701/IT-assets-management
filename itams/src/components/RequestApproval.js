import React, { useState } from "react";
import "./RequestApproval.css";

const ASSET_TYPES = [
  "All Assets",
  "Laptop",
  "Monitor",
  "Keyboard",
  "Mouse",
  "Printer",
  "Desktop",
];

const ROWS_OPTIONS = [10, 30, 50, "All"];

const validateEmployeeId = (id) => {
  if (!id || id.length === 0) {
    return {
      isValid: false,
      message: "Employee ID is required.",
    };
  }

  if (/\s/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID should not contain spaces.",
    };
  }

  if (id !== id.trim()) {
    return {
      isValid: false,
      message: "Employee ID should not have leading or trailing spaces.",
    };
  }

  if (!/^\d+$/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID should contain numbers only.",
    };
  }

  if (id.length !== 9) {
    return {
      isValid: false,
      message: "Employee ID must contain exactly 9 digits.",
    };
  }

  // YYMMDD
  const year = Number(id.substring(0, 2));
  const month = Number(id.substring(2, 4));
  const day = Number(id.substring(4, 6));

  if (month < 1 || month > 12) {
    return {
      isValid: false,
      message: "Employee ID must contain a valid month.",
    };
  }

  if (day < 1 || day > 31) {
    return {
      isValid: false,
      message: "Employee ID must contain a valid day.",
    };
  }

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
      message: "Employee ID contains an invalid date.",
    };
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  employeeDate.setHours(0, 0, 0, 0);

  if (employeeDate > today) {
    return {
      isValid: false,
      message: "Future date Employee IDs are not allowed.",
    };
  }

  const employeeNumber = id.substring(6, 9);

  if (employeeNumber === "000") {
    return {
      isValid: false,
      message: "Employee number cannot be 000.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// =====================================================
// VALIDATION - SEARCH
// =====================================================

const validateSearch = (empId, assetType) => {
  const cleanEmpId = empId || "";

  const hasEmpId = cleanEmpId.length > 0;

  const hasAssetType =
    assetType && assetType !== "All Assets";

  // Both empty
  if (!hasEmpId && !hasAssetType) {
    return {
      isValid: false,
      message:
        "Please enter an Employee ID or select an Asset Type to search.",
    };
  }

  // If Employee ID is entered, it MUST be valid
  if (hasEmpId) {
    const employeeValidation =
      validateEmployeeId(cleanEmpId);

    if (!employeeValidation.isValid) {
      return employeeValidation;
    }
  }

  // Asset-only search is allowed
  return {
    isValid: true,
    message: "",
  };
};

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
  // ===================================================

  const [searchEmpId, setSearchEmpId] =
    useState("");

  const [searchType, setSearchType] =
    useState("All Assets");

  const [appliedEmpId, setAppliedEmpId] =
    useState("");

  const [appliedType, setAppliedType] =
    useState("All Assets");

  const [searchError, setSearchError] =
    useState("");

  const [isSearchTouched, setIsSearchTouched] =
    useState(false);

  // ===================================================
  // TABLE STATE
  // ===================================================

  const [requests, setRequests] =
    useState(INITIAL_REQUESTS);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const [selectedReq, setSelectedReq] =
    useState(null);

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
  // SEARCH
  // ===================================================

  const handleSearch = () => {
    setIsSearchTouched(true);

    const result = validateSearch(
      searchEmpId,
      searchType
    );

    if (!result.isValid) {
      setSearchError(result.message);

      setAppliedEmpId("");
      setAppliedType("All Assets");

      return;
    }

    const cleanEmpId =
      searchEmpId.trim();

    setAppliedEmpId(cleanEmpId);
    setAppliedType(searchType);

    setSearchError("");
  };

  // ===================================================
  // SEARCH INPUT CHANGE
  // ===================================================

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchEmpId(value);

    setSearchError("");

    setIsSearchTouched(false);
  };

  // ===================================================
  // ASSET TYPE CHANGE
  // ===================================================

  const handleSearchTypeChange = (e) => {
    const value = e.target.value;

    setSearchType(value);

    setSearchError("");

    setIsSearchTouched(false);
  };

  // ===================================================
  // ENTER KEY
  // ===================================================

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // ===================================================
  // FILTER
  // ===================================================

  const filtered = requests.filter((request) => {
    const empMatch = appliedEmpId
      ? request.employeeId
          .toLowerCase()
          .includes(
            appliedEmpId.toLowerCase()
          )
      : true;

    const typeMatch =
      appliedType === "All Assets"
        ? true
        : request.assetType ===
          appliedType;

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
  // APPROVE
  // ===================================================

  const handleApprove = () => {
    if (!selectedReq) {
      return;
    }

    if (
      selectedReq.status === "Approved" ||
      selectedReq.status === "Rejected"
    ) {
      return;
    }

    const dateValidation =
      validateRequiredDate(
        selectedReq.requiredDate
      );

    if (!dateValidation.isValid) {
      alert(
        `⚠️ ${dateValidation.message}`
      );

      return;
    }

    setRequests((prev) =>
      prev.map((request) =>
        request.id === selectedReq.id
          ? {
              ...request,
              status: "Approved",
            }
          : request
      )
    );

    setSelectedReq((prev) => ({
      ...prev,
      status: "Approved",
    }));

    setRejectionReason("");
    setRejectError("");

    alert(
      `✅ Request ${selectedReq.id} approved successfully!`
    );
  };

  // ===================================================
  // REJECT
  // ===================================================

  const handleReject = () => {
    if (!selectedReq) {
      return;
    }

    if (
      selectedReq.status === "Approved" ||
      selectedReq.status === "Rejected"
    ) {
      return;
    }

    // Validate rejection description
    const result =
      validateRejectionReason(
        rejectionReason
      );

    if (!result.isValid) {
      setRejectError(result.message);
      return;
    }

    // Validate required date
    const dateValidation =
      validateRequiredDate(
        selectedReq.requiredDate
      );

    if (!dateValidation.isValid) {
      setRejectError(
        dateValidation.message
      );

      return;
    }

    const cleanReason =
      rejectionReason.trim();

    setRequests((prev) =>
      prev.map((request) =>
        request.id === selectedReq.id
          ? {
              ...request,
              status: "Rejected",
              rejectionReason:
                cleanReason,
            }
          : request
      )
    );

    setSelectedReq((prev) => ({
      ...prev,
      status: "Rejected",
      rejectionReason: cleanReason,
    }));

    setRejectionReason(cleanReason);
    setRejectError("");

    alert(
      `❌ Request ${selectedReq.id} rejected.`
    );
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
                  className={
                    `ra-input ${
                      searchError &&
                      isSearchTouched
                        ? "ra-input-error"
                        : ""
                    }`
                  }
                  type="text"
                  placeholder="Enter employee ID"
                  value={searchEmpId}
                  onChange={
                    handleSearchChange
                  }
                  onKeyDown={
                    handleSearchKeyDown
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

              {/* SEARCH BUTTON */}

              <button
                className="ra-search-btn"
                onClick={handleSearch}
              >
                Search
              </button>

            </div>

            {/* SEARCH ERROR */}

            {searchError &&
              isSearchTouched && (
                <div className="ra-search-error">
                  ⚠️ {searchError}
                </div>
              )}

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
