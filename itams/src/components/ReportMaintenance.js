import React, { useState } from "react";
import "./ReportMaintenance.css";

// =====================================================
// EMPLOYEE ID VALIDATION
//
// FORMAT:
// YYDDMMXXX
//
// YY  = Year
// DD  = Day
// MM  = Month
// XXX = Employee Number (001 - 999)
//
// Past dates  -> ALLOWED
// Today's date -> ALLOWED
// Future dates -> NOT ALLOWED
//
// No spaces:
// Before ID -> NOT ALLOWED
// After ID  -> NOT ALLOWED
// Inside ID -> NOT ALLOWED
// =====================================================
const validateEmployeeId = (id) => {
  // EMPTY
  if (!id || id.length === 0) {
    return {
      isValid: false,
      message: "Employee ID is required",
    };
  }

  // LEADING / TRAILING SPACES
  if (id !== id.trim()) {
    return {
      isValid: false,
      message:
        "Employee ID should not have leading or trailing spaces",
    };
  }

  // ANY SPACE INSIDE
  if (/\s/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID should not contain spaces",
    };
  }

  // NUMBERS ONLY
  if (!/^\d+$/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID must contain numbers only",
    };
  }

  // EXACTLY 9 DIGITS
  if (id.length !== 9) {
    return {
      isValid: false,
      message:
        "Employee ID must be exactly 9 digits (YYDDMMXXX)",
    };
  }

  // =====================================================
  // SPLIT
  // YY DD MM XXX
  // =====================================================
  const yearShort = Number(id.substring(0, 2));
  const day = Number(id.substring(2, 4));
  const month = Number(id.substring(4, 6));
  const employeeNumber = Number(id.substring(6, 9));

  // YEAR
  const fullYear = 2000 + yearShort;

  // DAY
  if (day < 1 || day > 31) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid day",
    };
  }

  // MONTH
  if (month < 1 || month > 12) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid month",
    };
  }

  // EMPLOYEE NUMBER
  // 001 - 999
  if (employeeNumber < 1 || employeeNumber > 999) {
    return {
      isValid: false,
      message:
        "Employee number must be between 001 and 999",
    };
  }

  // =====================================================
  // VALID CALENDAR DATE
  // =====================================================
  const employeeDate = new Date(
    fullYear,
    month - 1,
    day
  );

  employeeDate.setHours(0, 0, 0, 0);

  // Prevent invalid dates such as:
  // 260231001 -> 31 February
  // 260431001 -> 31 April
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

  // =====================================================
  // FUTURE DATE CHECK
  // =====================================================
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
// FORMAT:
// LAP001
// MON001
// MOU001
// KEY001
// PRI001
// =====================================================
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

  if (!/^[A-Za-z0-9]+$/.test(id)) {
    return {
      isValid: false,
      message:
        "Asset ID should contain letters and numbers only",
    };
  }

  if (id.length !== 6) {
    return {
      isValid: false,
      message: "Asset ID must be exactly 6 characters",
    };
  }

  const prefix = id.substring(0, 3).toUpperCase();
  const numberPart = id.substring(3);

  const validPrefixes = [
    "LAP",
    "MON",
    "MOU",
    "KEY",
    "PRI",
  ];

  if (!validPrefixes.includes(prefix)) {
    return {
      isValid: false,
      message:
        "Asset ID must start with LAP, MON, MOU, KEY or PRI",
    };
  }

  if (!/^[0-9]{3}$/.test(numberPart)) {
    return {
      isValid: false,
      message:
        "Last 3 characters of Asset ID must be numbers",
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

  // No multiple spaces
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
  if (/([.,;:'"()[]*&#@!%$^])\1+/.test(desc)) {
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

  // Only normal characters and punctuation
  if (!/^[A-Za-z0-9\s.,!?;:'"()/%-]+$/.test(desc)) {
    return {
      isValid: false,
      message:
        "Issue description contains invalid characters",
    };
  }

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
// MAIN COMPONENT
// =====================================================
const ReportMaintenance = ({
  username = "username",
  onLogout,
  onBack,
}) => {
  const [employeeId, setEmployeeId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [issueCategory, setIssueCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");

  const [errors, setErrors] = useState({});

  // =====================================================
  // SAMPLE REPORTS
  // =====================================================
  const [reports, setReports] = useState([
    {
      id: "MR001",
      assetId: "LAP001",
      category: "Hardware Issue",
      description: "Laptop screen is not responding.",
      priority: "High",
      status: "Pending",
      date: "30-06-2026",
    },
    {
      id: "MR002",
      assetId: "PRI001",
      category: "Software Issue",
      description: "Printer is not printing documents.",
      priority: "Medium",
      status: "In Progress",
      date: "29-06-2026",
    },
    {
      id: "MR003",
      assetId: "MON001",
      category: "Performance Issue",
      description:
        "Monitor display is getting disconnected frequently.",
      priority: "Low",
      status: "Completed",
      date: "27-06-2026",
    },
  ]);

  // =====================================================
  // FORM VALIDATION
  // =====================================================
  const validateForm = () => {
    const newErrors = {};

    const employeeResult =
      validateEmployeeId(employeeId);

    if (!employeeResult.isValid) {
      newErrors.employeeId =
        employeeResult.message;
    }

    const assetResult =
      validateAssetId(assetId);

    if (!assetResult.isValid) {
      newErrors.assetId =
        assetResult.message;
    }

    if (!issueCategory) {
      newErrors.issueCategory =
        "Issue category is required";
    }

    const descriptionResult =
      validateDescription(description);

    if (!descriptionResult.isValid) {
      newErrors.description =
        descriptionResult.message;
    }

    if (!priority) {
      newErrors.priority =
        "Priority is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // SUBMIT
  // =====================================================
  const submitRequest = () => {
    if (!validateForm()) {
      return;
    }

    const nextNumber =
      reports.length + 1;

    const newReport = {
      id: `MR${String(nextNumber).padStart(
        3,
        "0"
      )}`,
      assetId: assetId.toUpperCase(),
      category: issueCategory,
      description: description.trim(),
      priority,
      status: "Pending",
      date: new Date()
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-"),
    };

    setReports((previous) => [
      newReport,
      ...previous,
    ]);

    alert(
      "✅ Maintenance request submitted successfully!"
    );

    setEmployeeId("");
    setAssetId("");
    setIssueCategory("");
    setDescription("");
    setPriority("");
    setErrors({});
  };

  // =====================================================
  // CLEAR
  // =====================================================
  const clearForm = () => {
    setEmployeeId("");
    setAssetId("");
    setIssueCategory("");
    setDescription("");
    setPriority("");
    setErrors({});
  };

  // =====================================================
  // FIELD CHANGE
  // =====================================================
  const handleFieldChange =
    (setter, field, validator) => (e) => {
      const value = e.target.value;

      setter(value);

      if (validator) {
        const result =
          validator(value);

        setErrors((previous) => ({
          ...previous,
          [field]:
            value === ""
              ? ""
              : result.isValid
              ? ""
              : result.message,
        }));
      } else {
        setErrors((previous) => ({
          ...previous,
          [field]: "",
        }));
      }
    };

  // =====================================================
  // STATUS CLASS
  // =====================================================
  const getStatusClass = (status) => {
    return `status-${status
      .toLowerCase()
      .replace(" ", "-")}`;
  };

  return (
    <div className="report-page">

      {/* NAVBAR */}
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

      {/* BODY */}
      <div className="report-body">

        <div className="report-header">

          <h1 className="report-page-title">
            Report Maintenance
          </h1>

          <p className="report-page-sub">
            Report issues related to IT assets.
          </p>

        </div>

        {/* FORM CARD */}
        <div className="report-card">

          <h2 className="report-card-title">
            Maintenance Request Form
          </h2>

          <div className="form-grid">

            {/* EMPLOYEE ID */}
            <div className="form-group">

              <label>
                Employee ID *
              </label>

              <input
                className={`report-input ${
                  errors.employeeId
                    ? "report-input-error"
                    : ""
                }`}
                value={employeeId}
                onChange={handleFieldChange(
                  setEmployeeId,
                  "employeeId",
                  validateEmployeeId
                )}
                placeholder="Enter Employee ID (e.g., 260821001)"
                maxLength={9}
              />

              {errors.employeeId && (
                <span className="report-error-text">
                  ⚠️ {errors.employeeId}
                </span>
              )}

              <small>
                Format: YYDDMM + 3 employee numbers
              </small>

            </div>

            {/* ASSET ID */}
            <div className="form-group">

              <label>
                Asset ID *
              </label>

              <input
                className={`report-input ${
                  errors.assetId
                    ? "report-input-error"
                    : ""
                }`}
                value={assetId}
                onChange={handleFieldChange(
                  setAssetId,
                  "assetId",
                  validateAssetId
                )}
                placeholder="e.g., LAP001"
                maxLength={6}
              />

              {errors.assetId && (
                <span className="report-error-text">
                  ⚠️ {errors.assetId}
                </span>
              )}

              <small>
                Format: LAP001 / MON001 / MOU001 /
                KEY001 / PRI001
              </small>

            </div>

            {/* CATEGORY */}
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
                onChange={handleFieldChange(
                  setIssueCategory,
                  "issueCategory"
                )}
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

          {/* DESCRIPTION */}
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
              onChange={handleFieldChange(
                setDescription,
                "description",
                validateDescription
              )}
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

          {/* PRIORITY */}
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
                  onChange={handleFieldChange(
                    setPriority,
                    "priority"
                  )}
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
                  onChange={handleFieldChange(
                    setPriority,
                    "priority"
                  )}
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
                  onChange={handleFieldChange(
                    setPriority,
                    "priority"
                  )}
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

          {/* BUTTONS */}
          <div className="buttons">

            <button
              className="submit-btn"
              onClick={submitRequest}
            >
              Submit Request
            </button>

            <button
              className="clear-btn"
              onClick={clearForm}
            >
              Clear
            </button>

          </div>

        </div>

        {/* TABLE */}
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

                {reports.length > 0 ? (

                  reports.map((report) => (

                    <tr key={report.id}>

                      <td className="report-id">
                        {report.id}
                      </td>

                      <td className="asset-id">
                        {report.assetId}
                      </td>

                      <td>
                        {report.category}
                      </td>

                      <td className="desc-cell">
                        {report.description}
                      </td>

                      <td>

                        <span
                          className={`priority-badge priority-${report.priority.toLowerCase()}`}
                        >
                          {report.priority}
                        </span>

                      </td>

                      <td>

                        <span
                          className={`status-badge ${getStatusClass(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>

                      </td>

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

        </div>

        {/* BACK */}
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
