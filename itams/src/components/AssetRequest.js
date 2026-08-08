import React, { useState } from "react";
import "./AssetRequest.css";

const INITIAL_REQUESTS = [
  {
    id: "AR001 (Automatic Generated)",
    assetType: "Laptop",
    employeeId: "EMP001",
    status: "Pending",
    date: "01-07-2026",
  },
  {
    id: "AR002 (Automatic Generated)",
    assetType: "Monitor",
    employeeId: "EMP002",
    status: "Approved",
    date: "28-06-2026",
  },
  {
    id: "AR003 (Automatic Generated)",
    assetType: "Keyboard",
    employeeId: "EMP003",
    status: "Rejected",
    date: "25-06-2026",
  },
  {
    id: "AR004 (Automatic Generated)",
    assetType: "Printer",
    employeeId: "EMP004",
    status: "Pending",
    date: "20-06-2026",
  },
];

const VALID_EMPLOYEE_IDS = ["EMP001", "EMP002", "EMP003", "EMP004", "EMP005"];

const ASSET_TYPES = [
  "Laptop",
  "Monitor",
  "Keyboard",
  "Printer",
  "Desktop",
  "Mouse",
  "Headset",
  "Webcam",
];

const PAGE_SIZE_OPTIONS = [10, 30, 50, "All"];

// Validation function for Employee ID
const validateEmployeeId = (id) => {
  if (!id || id.trim() === "") {
    return { isValid: false, message: "Employee ID is required" };
  }
  if (id !== id.trim()) {
    return { isValid: false, message: "Employee ID should not have leading or trailing spaces" };
  }
  if (/\s/.test(id)) {
    return { isValid: false, message: "Employee ID should not contain spaces" };
  }
  if (/[^A-Za-z0-9]/.test(id)) {
    return { isValid: false, message: "Employee ID should not contain special characters" };
  }
  if (!id.startsWith("EMP")) {
    return { isValid: false, message: "Employee ID must start with 'EMP'" };
  }
  if (id.length !== 6) {
    return { isValid: false, message: "Employee ID must be exactly 6 characters long (EMP + 3 alphanumeric characters)" };
  }
  const lastThree = id.substring(3);
  if (!/^[A-Za-z0-9]{3}$/.test(lastThree)) {
    return { isValid: false, message: "Last 3 characters must be alphanumeric (letters or numbers)" };
  }
  // Check if employee exists in database
  if (!VALID_EMPLOYEE_IDS.includes(id.toUpperCase())) {
    return { isValid: false, message: "Employee ID does not exist in the database" };
  }
  return { isValid: true, message: "" };
};

// Validation function for Purpose
const validatePurpose = (purpose) => {
  if (!purpose || purpose.trim() === "") {
    return { isValid: false, message: "Purpose is required" };
  }
  if (purpose.trim().length < 10) {
    return { isValid: false, message: "Purpose must be at least 10 characters long" };
  }
  if (purpose.trim().length > 500) {
    return { isValid: false, message: "Purpose cannot exceed 500 characters" };
  }
  if (!/^[A-Za-z0-9 ,.()-]+$/.test(purpose.trim())) {
    return { isValid: false, message: "Purpose contains invalid characters" };
  }
  return { isValid: true, message: "" };
};

// Validation function for Required Date
const validateRequiredDate = (date) => {
  if (!date) {
    return { isValid: false, message: "Required Date is required" };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  if (selectedDate < today) {
    return { isValid: false, message: "Required Date cannot be a past date" };
  }
  if (selectedDate > maxDate) {
    return { isValid: false, message: "Required Date cannot exceed one year from today" };
  }
  return { isValid: true, message: "" };
};

const AssetRequest = ({ username = "username", onLogout, onBack }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [assetType, setAssetType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [requiredDate, setRequiredDate] = useState("");
  const [errors, setErrors] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchError, setSearchError] = useState("");
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [pageSize, setPageSize] = useState(10);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate Employee ID
    const empResult = validateEmployeeId(employeeId);
    if (!empResult.isValid) {
      newErrors.employeeId = empResult.message;
    }

    // Validate Asset Type
    if (!assetType) {
      newErrors.assetType = "Asset Type is required";
    }

    // Validate Purpose
    const purposeResult = validatePurpose(purpose);
    if (!purposeResult.isValid) {
      newErrors.purpose = purposeResult.message;
    }

    // Validate Required Date
    const dateResult = validateRequiredDate(requiredDate);
    if (!dateResult.isValid) {
      newErrors.requiredDate = dateResult.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSearch = () => {
    if (!searchInput.trim()) {
      setSearchError("Employee ID is required.");
      return false;
    }

    if (!searchInput.startsWith("EMP")) {
      setSearchError("Employee ID must start with uppercase EMP.");
      return false;
    }

    if (searchInput.length !== 6) {
      setSearchError("Employee ID must be exactly 6 characters.");
      return false;
    }

    if (!/^EMP[A-Za-z0-9]{3}$/.test(searchInput)) {
      setSearchError("Invalid Employee ID format.");
      return false;
    }

    if (!VALID_EMPLOYEE_IDS.includes(searchInput.toUpperCase())) {
      setSearchError("Employee ID does not exist in the database.");
      return false;
    }

    setSearchError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newRequest = {
      id: `AR00${requests.length + 1} (Automatic Generated)`,
      assetType,
      employeeId: employeeId.toUpperCase(),
      status: "Pending",
      date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
    };

    setRequests([newRequest, ...requests]);
    alert("✅ Asset Request Submitted Successfully!");
    handleCancel();
  };

  const handleCancel = () => {
    setEmployeeId("");
    setAssetType("");
    setPurpose("");
    setRequiredDate("");
    setErrors({});
  };

  const handleSearch = () => {
    if (!validateSearch()) {
      return;
    }
    setSearchId(searchInput.toUpperCase());
  };

  // Handle field change and clear error
  const handleFieldChange = (setter, field) => (e) => {
    setter(e.target.value);
    setErrors({ ...errors, [field]: "" });
  };

  const filteredRequests =
    searchId.trim() === ""
      ? requests
      : requests.filter((req) =>
          req.employeeId.toLowerCase().includes(searchId.toLowerCase())
        );

  const visibleRequests =
    pageSize === "All"
      ? filteredRequests
      : filteredRequests.slice(0, Number(pageSize));

  const getStatusClass = (status) => {
    return `ar-status-${status.toLowerCase()}`;
  };

  return (
    <div className="ar-page">
      <nav className="ar-nav">
        <div className="ar-nav-logo">
          <span className="ar-nav-title">ITAMS</span>
          <span className="ar-nav-sub">IT Asset Management System</span>
        </div>
        <div className="ar-nav-right">
          <span className="ar-nav-user">{username}</span>
          <span className="ar-nav-divider">|</span>
          <button className="ar-logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="ar-body">
        <h1 className="ar-page-title">Asset Request</h1>
        <p className="ar-page-sub">
          Request a new IT asset from the Asset Manager.
        </p>

        <div className="ar-card">
          <h2 className="ar-card-title">Asset Request Details</h2>

          <form onSubmit={handleSubmit} noValidate>
            {/* Employee ID */}
            <div className="ar-form-group">
              <label className="ar-label">Employee ID *</label>
              <input
                type="text"
                className={`ar-input ${errors.employeeId ? "ar-input-error" : ""}`}
                placeholder="Enter Employee ID (e.g., EMP001)"
                value={employeeId}
                onChange={handleFieldChange(setEmployeeId, "employeeId")}
              />
              {errors.employeeId && (
                <span className="ar-error-text">⚠️ {errors.employeeId}</span>
              )}
              <div className="ar-validation-hint">
                <small>Format: EMP + 3 alphanumeric characters (e.g., EMP001, EMPA12, EMP1AB)</small>
              </div>
            </div>

            {/* Asset Type */}
            <div className="ar-form-group">
              <label className="ar-label">Asset Type *</label>
              <select
                className={`ar-select ${errors.assetType ? "ar-input-error" : ""}`}
                value={assetType}
                onChange={handleFieldChange(setAssetType, "assetType")}
              >
                <option value="">Select Asset Type</option>
                {ASSET_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.assetType && (
                <span className="ar-error-text">⚠️ {errors.assetType}</span>
              )}
            </div>

            {/* Purpose */}
            <div className="ar-form-group">
              <label className="ar-label">Purpose *</label>
              <textarea
                className={`ar-textarea ${errors.purpose ? "ar-input-error" : ""}`}
                placeholder="Enter Purpose (min 10 characters)"
                rows={4}
                value={purpose}
                onChange={handleFieldChange(setPurpose, "purpose")}
              />
              {errors.purpose && (
                <span className="ar-error-text">⚠️ {errors.purpose}</span>
              )}
              <div className="ar-character-count">
                {purpose.length > 0 && (
                  <small>{purpose.length} / 500 characters</small>
                )}
              </div>
            </div>

            {/* Required Date */}
            <div className="ar-form-group">
              <label className="ar-label">Required Date *</label>
              <input
                type="date"
                className={`ar-input ${errors.requiredDate ? "ar-input-error" : ""}`}
                value={requiredDate}
                onChange={handleFieldChange(setRequiredDate, "requiredDate")}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.requiredDate && (
                <span className="ar-error-text">⚠️ {errors.requiredDate}</span>
              )}
              <div className="ar-validation-hint">
                <small>Date must be today or within the next year</small>
              </div>
            </div>

            <div className="ar-btn-row">
              <button type="submit" className="ar-submit-btn">
                Submit Request
              </button>
              <button
                type="button"
                className="ar-cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="ar-card">
          <h2 className="ar-card-title">Search Employee</h2>
          <div className="ar-form-group">
            <label className="ar-label">Employee ID</label>
            <div className="ar-search-row">
              <input
                type="text"
                className={`ar-input ${searchError ? "ar-input-error" : ""}`}
                placeholder="Enter Employee ID"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setSearchError("");
                }}
              />
              <button type="button" className="ar-search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
            {searchError && (
              <span className="ar-error-text">⚠️ {searchError}</span>
            )}
          </div>
        </div>

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
                  visibleRequests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.id}</td>
                      <td>{req.assetType}</td>
                      <td>
                        <span className="ar-employee-id">{req.employeeId}</span>
                      </td>
                      <td>
                        <span className={`ar-status-badge ${getStatusClass(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>{req.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="ar-no-data">
                      No Requests Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="ar-back-btn" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default AssetRequest;
