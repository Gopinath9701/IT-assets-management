import React, { useState, useEffect } from "react";
import "./ReportMaintenance.css";

// =====================================================
// EMPLOYEE ID VALIDATION
// FORMAT: YYMMDDXXX
// =====================================================

const validateEmployeeId = (id) => {
  if (!id || id.length === 0) {
    return {
      isValid: false,
      message: "Employee ID is required",
    };
  }

  if (id !== id.trim()) {
    return {
      isValid: false,
      message:
        "Employee ID should not have leading or trailing spaces",
    };
  }

  if (/\s/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID should not contain spaces",
    };
  }

  if (!/^\d+$/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID must contain numbers only",
    };
  }

  if (id.length !== 9) {
    return {
      isValid: false,
      message:
        "Employee ID must be exactly 9 digits (YYMMDDXXX)",
    };
  }

  const yearShort = Number(id.substring(0, 2));
  const month = Number(id.substring(2, 4));
  const day = Number(id.substring(4, 6));
  const employeeNumber = Number(id.substring(6, 9));

  const fullYear = 2000 + yearShort;

  if (month < 1 || month > 12) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid month",
    };
  }

  if (day < 1 || day > 31) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid day",
    };
  }

  if (employeeNumber < 1 || employeeNumber > 999) {
    return {
      isValid: false,
      message:
        "Employee number must be between 001 and 999",
    };
  }

  const employeeDate = new Date(
    fullYear,
    month - 1,
    day
  );

  employeeDate.setHours(0, 0, 0, 0);

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (employeeDate > today) {
    return {
      isValid: false,
      message:
        "Future dates are not allowed. Employee ID must contain a past or today's date.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// =====================================================
// ASSET ID VALIDATION
//
// ALL 11 ASSET TYPES
//
// LAP001 - LAP999  = Laptop
// DES001 - DES999  = Desktop
// MON001 - MON999  = Monitor
// KEY001 - KEY999  = Keyboard
// WEB001 - WEB999  = Webcam
// PRO001 - PRO999  = Projector
// MOU001 - MOU999  = Mouse
// CPU001 - CPU999  = CPU
// PRI001 - PRI999  = Printer
// HEA001 - HEA999  = Headset
// SCN001 - SCN999  = Scanner
//
// INVALID:
// LAP000
// LAP1000
// LAPABC
// LAP01
// XYZ001
// =====================================================

const ASSET_PREFIXES = [
  "LAP",
  "DES",
  "MON",
  "KEY",
  "WEB",
  "PRO",
  "MOU",
  "CPU",
  "PRI",
  "HEA",
  "SCN",
];

const validateAssetId = (id) => {
  if (!id || id.length === 0) {
    return {
      isValid: false,
      message: "Asset ID is required",
    };
  }

  if (id !== id.trim()) {
    return {
      isValid: false,
      message:
        "Asset ID should not have leading or trailing spaces",
    };
  }

  if (/\s/.test(id)) {
    return {
      isValid: false,
      message: "Asset ID should not contain spaces",
    };
  }

  const value = id.toUpperCase();

  if (value.length !== 6) {
    return {
      isValid: false,
      message: "Asset ID must be exactly 6 characters",
    };
  }

  const prefix = value.substring(0, 3);
  const numberPart = value.substring(3);

  // Check asset prefix
  if (!ASSET_PREFIXES.includes(prefix)) {
    return {
      isValid: false,
      message:
        "Invalid Asset ID prefix. Use LAP, DES, MON, KEY, WEB, PRO, MOU, CPU, PRI, HEA or SCN",
    };
  }

  // Last 3 characters must be numbers
  if (!/^\d{3}$/.test(numberPart)) {
    return {
      isValid: false,
      message:
        "Last 3 characters of Asset ID must be numbers",
    };
  }

  const assetNumber = Number(numberPart);

  // 001 - 999 only
  if (assetNumber < 1 || assetNumber > 999) {
    return {
      isValid: false,
      message:
        "Asset number must be between 001 and 999",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// =====================================================
// ISSUE DESCRIPTION VALIDATION
// =====================================================

const validateDescription = (desc) => {
  if (!desc || desc.length === 0) {
    return {
      isValid: false,
      message: "Issue description is required",
    };
  }

  if (desc.trim() === "") {
    return {
      isValid: false,
      message:
        "Issue description cannot contain only spaces",
    };
  }

  if (desc !== desc.trim()) {
    return {
      isValid: false,
      message:
        "Issue description should not have leading or trailing spaces",
    };
  }

  // Multiple consecutive spaces are not allowed
  if (/ {2,}/.test(desc)) {
    return {
      isValid: false,
      message:
        "Issue description should not contain multiple consecutive spaces",
    };
  }

  // Minimum 10 characters
  if (desc.length < 10) {
    return {
      isValid: false,
      message:
        "Issue description must be at least 10 characters long",
    };
  }

  // Maximum 500 characters
  if (desc.length > 500) {
    return {
      isValid: false,
      message:
        "Issue description cannot exceed 500 characters",
    };
  }

  // Repeated special characters
  if (/([.,;:'"()[\]*&#@!%$^])\1+/.test(desc)) {
    return {
      isValid: false,
      message:
        "Issue description should not contain repeated special characters",
    };
  }

  // Invalid repeated combinations
  if (
    /(\.\.|,,|;;|\/\/|\\\\|\]\]|\[\[|\)\)|\(\(|\*\*|&&|\^\^|%%|\$\$|##|@@|!!)/.test(
      desc
    )
  ) {
    return {
      isValid: false,
      message:
        "Issue description contains invalid repeated symbols",
    };
  }

  // Allowed characters
  if (!/^[A-Za-z0-9\s.,!?;:'"()/%-]+$/.test(desc)) {
    return {
      isValid: false,
      message:
        "Issue description contains invalid characters",
    };
  }

  // Must contain at least one letter or number
  if (!/[A-Za-z0-9]/.test(desc)) {
    return {
      isValid: false,
      message:
        "Issue description must contain letters or numbers",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// =====================================================
// PAGE SIZE OPTIONS
// =====================================================

const PAGE_SIZE_OPTIONS = [10, 30, 50, "All"];

// =====================================================
// MAIN COMPONENT
// =====================================================

const ReportMaintenance = ({
  username = "username",
  onLogout,
  onBack,
}) => {
  // ===================================================
  // FORM STATES
  // ===================================================

  const [employeeId, setEmployeeId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [issueCategory, setIssueCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");

  // ===================================================
  // ERROR STATES
  // ===================================================

  const [errors, setErrors] = useState({});

  // ===================================================
  // REPORT STATES
  // ===================================================

  const [reports, setReports] = useState([]);

  // ===================================================
  // PAGE SIZE
  // ===================================================

  const [pageSize, setPageSize] = useState(10);

  // ===================================================
  // LOAD REPORTS FROM BACKEND
  // ===================================================

  const loadReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/maintenance",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success && data.reports) {
        setReports(
          data.reports.map((r) => ({
            id: r.request_id,
            assetId: r.asset_id || "-",
            category: r.issue_category || "-",
            description: r.description || "-",
            priority: r.priority || "-",
            status: r.status || "-",
            date: r.report_date
              ? new Date(r.report_date)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "-")
              : "-",
          }))
        );
      }
    } catch (error) {
      console.error(
        "Load Maintenance Reports Error:",
        error
      );
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // ===================================================
  // EMPLOYEE ID CHANGE
  // NUMBERS ONLY
  // ===================================================

  const handleEmployeeIdChange = (e) => {
    const value = e.target.value;

    // Allow numbers only
    if (!/^\d*$/.test(value)) {
      return;
    }

    // Maximum 9 digits
    if (value.length > 9) {
      return;
    }

    setEmployeeId(value);

    if (value === "") {
      setErrors((previous) => ({
        ...previous,
        employeeId: "",
      }));
      return;
    }

    const result = validateEmployeeId(value);

    setErrors((previous) => ({
      ...previous,
      employeeId: result.isValid
        ? ""
        : result.message,
    }));
  };

  // ===================================================
  // ASSET ID CHANGE
  //
  // Allowed:
  // LAP / DES / MON / KEY / WEB / PRO /
  // MOU / CPU / PRI / HEA / SCN
  //
  // Then 001 - 999
  // ===================================================

  const handleAssetIdChange = (e) => {
    let value = e.target.value.toUpperCase();

    // Remove spaces automatically
    value = value.replace(/\s/g, "");

    // Only letters and numbers
    if (!/^[A-Z0-9]*$/.test(value)) {
      return;
    }

    // Maximum 6 characters
    if (value.length > 6) {
      return;
    }

    // First 3 characters
    if (value.length <= 3) {
      // First three positions must be letters
      if (!/^[A-Z]*$/.test(value)) {
        return;
      }

      // If 3 letters entered, check prefix
      if (
        value.length === 3 &&
        !ASSET_PREFIXES.includes(value)
      ) {
        setAssetId(value);

        setErrors((previous) => ({
          ...previous,
          assetId:
            "Invalid Asset ID prefix. Use LAP, DES, MON, KEY, WEB, PRO, MOU, CPU, PRI, HEA or SCN",
        }));

        return;
      }
    }

    // After first 3 characters, only numbers
    if (
      value.length > 3 &&
      !/^[A-Z]{3}\d*$/.test(value)
    ) {
      return;
    }

    setAssetId(value);

    // Empty
    if (value === "") {
      setErrors((previous) => ({
        ...previous,
        assetId: "",
      }));
      return;
    }

    // Validate complete Asset ID
    if (value.length === 6) {
      const result = validateAssetId(value);

      setErrors((previous) => ({
        ...previous,
        assetId: result.isValid
          ? ""
          : result.message,
      }));
    } else {
      setErrors((previous) => ({
        ...previous,
        assetId: "",
      }));
    }
  };

  // ===================================================
  // ISSUE CATEGORY CHANGE
  // ===================================================

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setIssueCategory(value);

    setErrors((previous) => ({
      ...previous,
      issueCategory:
        value === ""
          ? "Issue category is required"
          : "",
    }));
  };

  // ===================================================
  // DESCRIPTION CHANGE
  // ===================================================

  const handleDescriptionChange = (e) => {
    const value = e.target.value;

    if (value.length > 500) {
      return;
    }

    setDescription(value);

    if (value === "") {
      setErrors((previous) => ({
        ...previous,
        description: "",
      }));
      return;
    }

    const result = validateDescription(value);

    setErrors((previous) => ({
      ...previous,
      description: result.isValid
        ? ""
        : result.message,
    }));
  };

  // ===================================================
  // PRIORITY CHANGE
  // ===================================================

  const handlePriorityChange = (e) => {
    const value = e.target.value;

    setPriority(value);

    setErrors((previous) => ({
      ...previous,
      priority: "",
    }));
  };

  // ===================================================
  // FORM VALIDATION
  // ===================================================

  const validateForm = () => {
    const newErrors = {};

    // Employee ID
    const employeeResult =
      validateEmployeeId(employeeId);

    if (!employeeResult.isValid) {
      newErrors.employeeId =
        employeeResult.message;
    }

    // Asset ID
    const assetResult =
      validateAssetId(assetId);

    if (!assetResult.isValid) {
      newErrors.assetId =
        assetResult.message;
    }

    // Issue Category
    if (!issueCategory) {
      newErrors.issueCategory =
        "Issue category is required";
    }

    // Description
    const descriptionResult =
      validateDescription(description);

    if (!descriptionResult.isValid) {
      newErrors.description =
        descriptionResult.message;
    }

    // Priority
    if (!priority) {
      newErrors.priority =
        "Priority is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ===================================================
  // SUBMIT REQUEST
  // ===================================================

  const submitRequest = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/maintenance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            employeeId,
            assetId: assetId.toUpperCase(),
            issueCategory,
            description: description.trim(),
            priority,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to submit maintenance request."
        );
        return;
      }

      alert(
        "✅ Maintenance request submitted successfully!"
      );

      // Reload reports after submission
      await loadReports();

      // Clear form
      clearForm();
    } catch (error) {
      console.error(
        "Submit Maintenance Error:",
        error
      );

      alert(
        "Unable to connect to server. Please make sure the backend is running."
      );
    }
  };

  // ===================================================
  // CLEAR FORM
  // ===================================================

  const clearForm = () => {
    setEmployeeId("");
    setAssetId("");
    setIssueCategory("");
    setDescription("");
    setPriority("");
    setErrors({});
  };

  // ===================================================
  // STATUS CLASS
  // ===================================================

  const getStatusClass = (status) => {
    return `status-${String(status)
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };

  // ===================================================
  // PAGINATION / VISIBLE REPORTS
  // ===================================================

  const visibleReports =
    pageSize === "All"
      ? reports
      : reports.slice(0, Number(pageSize));

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="report-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="report-nav">

        <div className="report-nav-logo">

          <span className="report-nav-title">
            ITAMS
          </span>

          <span className="report-nav-sub">
            IT Asset Management System
          </span>

        </div>

        <div className="report-nav-right">

          <span className="report-nav-user">
            {username}
          </span>

          <span className="report-nav-divider">
            |
          </span>

          <button
            className="report-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* =================================================
          BODY
      ================================================= */}

      <div className="report-body">

        <div className="report-header">

          <h1 className="report-page-title">
            Report Maintenance
          </h1>

          <p className="report-page-sub">
            Report issues related to IT assets.
          </p>

        </div>

        {/* =================================================
            FORM CARD
        ================================================= */}

        <div className="report-card">

          <h2 className="report-card-title">
            Maintenance Request Form
          </h2>

          <div className="form-grid">

            {/* =================================================
                EMPLOYEE ID
            ================================================= */}

            <div className="form-group">

              <label>
                Employee ID *
              </label>

              <input
                type="text"
                className={`report-input ${
                  errors.employeeId
                    ? "report-input-error"
                    : ""
                }`}
                value={employeeId}
                onChange={handleEmployeeIdChange}
                placeholder="Enter Employee ID (e.g., 260821001)"
                maxLength={9}
                inputMode="numeric"
              />

              {errors.employeeId && (
                <span className="report-error-text">
                  ⚠️ {errors.employeeId}
                </span>
              )}

              <small>
                Format: YYMMDD + 3 employee numbers
              </small>

            </div>

            {/* =================================================
                ASSET ID
            ================================================= */}

            <div className="form-group">

              <label>
                Asset ID *
              </label>

              <input
                type="text"
                className={`report-input ${
                  errors.assetId
                    ? "report-input-error"
                    : ""
                }`}
                value={assetId}
                onChange={handleAssetIdChange}
                placeholder="e.g., LAP001"
                maxLength={6}
                autoCapitalize="characters"
              />

              {errors.assetId && (
                <span className="report-error-text">
                  ⚠️ {errors.assetId}
                </span>
              )}

              <small>
                Format: LAP001 / DES001 / MON001 / KEY001 /
                WEB001 / PRO001 / MOU001 / CPU001 /
                PRI001 / HEA001 / SCN001
              </small>

            </div>

            {/* =================================================
                ISSUE CATEGORY
            ================================================= */}

            <div className="form-group">

              <label>
                Issue Category *
              </label>

              <select
                className={`report-select ${
                  errors.issueCategory
                    ? "report-input-error"
                    : ""
                }`}
                value={issueCategory}
                onChange={handleCategoryChange}
              >

                <option value="">
                  Select Category
                </option>

                <option value="Hardware Issue">
                  Hardware Issue
                </option>

                <option value="Software Issue">
                  Software Issue
                </option>

                <option value="Performance Issue">
                  Performance Issue
                </option>

                <option value="Security Issue">
                  Security Issue
                </option>

                <option value="Network Issue">
                  Network Issue
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

              {errors.issueCategory && (
                <span className="report-error-text">
                  ⚠️ {errors.issueCategory}
                </span>
              )}

            </div>

          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="form-group">

            <label>
              Issue Description *
            </label>

            <textarea
              className={`report-textarea ${
                errors.description
                  ? "report-input-error"
                  : ""
              }`}
              rows="4"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter issue description (minimum 10 characters)"
              maxLength={500}
            />

            {errors.description && (
              <span className="report-error-text">
                ⚠️ {errors.description}
              </span>
            )}

            <small>
              {description.length}/500 characters
            </small>

          </div>

          {/* =================================================
              PRIORITY
          ================================================= */}

          <div className="priority-group">

            <label>
              Priority *
            </label>

            <div className="radio-group">

              <label className="radio-option">

                <input
                  type="radio"
                  value="Low"
                  checked={priority === "Low"}
                  onChange={handlePriorityChange}
                />

                <span className="priority-low">
                  Low
                </span>

              </label>

              <label className="radio-option">

                <input
                  type="radio"
                  value="Medium"
                  checked={priority === "Medium"}
                  onChange={handlePriorityChange}
                />

                <span className="priority-medium">
                  Medium
                </span>

              </label>

              <label className="radio-option">

                <input
                  type="radio"
                  value="High"
                  checked={priority === "High"}
                  onChange={handlePriorityChange}
                />

                <span className="priority-high">
                  High
                </span>

              </label>

            </div>

            {errors.priority && (
              <span className="report-error-text">
                ⚠️ {errors.priority}
              </span>
            )}

          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="buttons">

            <button
              type="button"
              className="submit-btn"
              onClick={submitRequest}
            >
              Submit Request
            </button>

            <button
              type="button"
              className="clear-btn"
              onClick={clearForm}
            >
              Clear
            </button>

          </div>

        </div>

        {/* =================================================
            MAINTENANCE REQUEST TABLE
        ================================================= */}

        <div className="table-card">

          <h2 className="report-card-title">
            My Maintenance Requests
          </h2>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Request ID</th>
                  <th>Asset ID</th>
                  <th>Issue Category</th>
                  <th>Issue Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Report Date</th>
                </tr>

              </thead>

              <tbody>

                {visibleReports.length > 0 ? (

                  visibleReports.map((report) => (

                    <tr key={report.id}>

                      <td className="report-id">
                        {report.id}
                      </td>

                      <td className="asset-id">
                        {report.assetId}
                      </td>

                      {/* ISSUE CATEGORY */}
                      <td>
                        {report.category}
                      </td>

                      {/* ISSUE DESCRIPTION */}
                      <td className="desc-cell">
                        {report.description}
                      </td>

                      {/* PRIORITY */}
                      <td>

                        <span
                          className={`priority-badge priority-${String(
                            report.priority
                          ).toLowerCase()}`}
                        >
                          {report.priority}
                        </span>

                      </td>

                      {/* STATUS */}
                      <td>

                        <span
                          className={`status-badge ${getStatusClass(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>

                      </td>

                      {/* REPORT DATE */}
                      <td>
                        {report.date}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="no-data"
                    >
                      No maintenance requests found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* =================================================
              PAGE SIZE DROPDOWN
          ================================================= */}

          <div className="report-pagination-row">

            <select
              className="report-page-size"
              value={pageSize}
              onChange={(e) => {
                const value = e.target.value;

                setPageSize(
                  value === "All"
                    ? "All"
                    : Number(value)
                );
              }}
            >

              {PAGE_SIZE_OPTIONS.map((option) => (

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

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          className="report-back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>

    </div>
  );
};

export default ReportMaintenance;
