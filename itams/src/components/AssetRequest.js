import React, { useState } from "react";
import "./AssetRequest.css";

// =====================================================
// INITIAL REQUEST DATA
// =====================================================

const INITIAL_REQUESTS = [
  {
    id: "AR001 (Automatic Generated)",
    assetType: "Laptop",
    employeeId: "260820001",
    status: "Pending",
    date: "01-07-2026",
  },
  {
    id: "AR002 (Automatic Generated)",
    assetType: "Monitor",
    employeeId: "250615002",
    status: "Approved",
    date: "28-06-2026",
  },
  {
    id: "AR003 (Automatic Generated)",
    assetType: "Keyboard",
    employeeId: "251025003",
    status: "Rejected",
    date: "25-06-2026",
  },
  {
    id: "AR004 (Automatic Generated)",
    assetType: "Printer",
    employeeId: "240920004",
    status: "Pending",
    date: "20-06-2026",
  },
];

// =====================================================
// ASSET TYPES
// =====================================================

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

// =====================================================
// PAGE SIZE OPTIONS
// =====================================================

const PAGE_SIZE_OPTIONS = [10, 30, 50, "All"];

// =====================================================
// VALIDATION - EMPLOYEE ID
// =====================================================
//
// Format:
// YYDDMM + 3 digit employee number
//
// Example:
// 260820001
//  ^^^^^^ ^^^
//  YYDDMM EMP NO
//
// IMPORTANT:
// We DO NOT compare YYDDMM with today's date.
// Old employees are allowed.
// =====================================================

const validateEmployeeId = (id) => {
  // Empty
  if (id.length === 0) {
    return {
      isValid: false,
      message: "Employee ID is required",
    };
  }

  // Spaces
  if (/\s/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID should not contain spaces",
    };
  }

  // Special characters / letters
  if (!/^[0-9]+$/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID must contain numbers only",
    };
  }

  // Exact length
  if (id.length !== 9) {
    return {
      isValid: false,
      message:
        "Employee ID must be exactly 9 digits (YYDDMM + 3-digit employee number)",
    };
  }

  // First 6 digits = YYDDMM
  const datePart = id.substring(0, 6);

  if (!/^[0-9]{6}$/.test(datePart)) {
    return {
      isValid: false,
      message:
        "First 6 digits must be in YYDDMM format",
    };
  }

  // Extract YY DD MM
  const year = Number(datePart.substring(0, 2));
  const day = Number(datePart.substring(2, 4));
  const month = Number(datePart.substring(4, 6));

  // Validate month
  if (month < 1 || month > 12) {
    return {
      isValid: false,
      message:
        "Invalid month in Employee ID. Month must be between 01 and 12",
    };
  }

  // Validate day
  if (day < 1 || day > 31) {
    return {
      isValid: false,
      message:
        "Invalid day in Employee ID. Day must be between 01 and 31",
    };
  }

  // Check actual calendar date
  // We use 2000 + YY only to validate the day/month combination.
  const fullYear = 2000 + year;

  const date = new Date(
    fullYear,
    month - 1,
    day
  );

  if (
    date.getFullYear() !== fullYear ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return {
      isValid: false,
      message:
        "Invalid date in Employee ID. Please use a valid YYDDMM date",
    };
  }

  // Last 3 digits = employee number
  const employeeNumber = id.substring(6);

  if (!/^[0-9]{3}$/.test(employeeNumber)) {
    return {
      isValid: false,
      message:
        "Last 3 characters must be a 3-digit employee number",
    };
  }

  // Employee number cannot be 000
  if (employeeNumber === "000") {
    return {
      isValid: false,
      message:
        "Employee number cannot be 000",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// =====================================================
// VALIDATION - PURPOSE
// =====================================================

const validatePurpose = (purpose) => {
  // Empty
  if (purpose.length === 0) {
    return {
      isValid: false,
      message: "Purpose is required",
    };
  }

  // Only spaces
  if (purpose.trim() === "") {
    return {
      isValid: false,
      message: "Purpose cannot contain only spaces",
    };
  }

  // Leading spaces
  if (purpose !== purpose.trimStart()) {
    return {
      isValid: false,
      message:
        "Purpose should not start with spaces",
    };
  }

  // Trailing spaces
  if (purpose !== purpose.trimEnd()) {
    return {
      isValid: false,
      message:
        "Purpose should not end with spaces",
    };
  }

  // Minimum 10 characters
  if (purpose.trim().length < 10) {
    return {
      isValid: false,
      message:
        "Purpose must be at least 10 characters long",
    };
  }

  // Maximum 500 characters
  if (purpose.length > 500) {
    return {
      isValid: false,
      message:
        "Purpose cannot exceed 500 characters",
    };
  }

  // Multiple spaces ARE ALLOWED.
  //
  // Allowed:
  // Letters
  // Numbers
  // Spaces
  // . , ( ) -
  //
  if (!/^[A-Za-z0-9\s.,()-]+$/.test(purpose)) {
    return {
      isValid: false,
      message:
        "Purpose should contain only letters, numbers, spaces, comma, full stop, brackets and hyphen",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// =====================================================
// VALIDATION - REQUIRED DATE
// =====================================================

const validateRequiredDate = (dateValue) => {
  // Empty
  if (!dateValue) {
    return {
      isValid: false,
      message: "Required Date is required",
    };
  }

  // Today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Selected date
  const selectedDate = new Date(
    `${dateValue}T00:00:00`
  );

  // Invalid date
  if (Number.isNaN(selectedDate.getTime())) {
    return {
      isValid: false,
      message: "Please select a valid date",
    };
  }

  selectedDate.setHours(0, 0, 0, 0);

  // Maximum date = 1 year from today
  const maxDate = new Date(today);
  maxDate.setFullYear(
    maxDate.getFullYear() + 1
  );
  maxDate.setHours(0, 0, 0, 0);

  // Past date
  if (selectedDate < today) {
    return {
      isValid: false,
      message:
        "Required Date cannot be a past date",
    };
  }

  // More than one year
  if (selectedDate > maxDate) {
    return {
      isValid: false,
      message:
        "Required Date cannot exceed one year from today",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// =====================================================
// GET TODAY DATE
// =====================================================

const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =====================================================
// GET MAX DATE
// =====================================================

const getMaxDate = () => {
  const maxDate = new Date();

  maxDate.setFullYear(
    maxDate.getFullYear() + 1
  );

  const year = maxDate.getFullYear();

  const month = String(
    maxDate.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    maxDate.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const AssetRequest = ({
  username = "username",
  onLogout,
  onBack,
}) => {
  // ===================================================
  // FORM STATES
  // ===================================================

  const [employeeId, setEmployeeId] =
    useState("");

  const [assetType, setAssetType] =
    useState("");

  const [purpose, setPurpose] =
    useState("");

  const [requiredDate, setRequiredDate] =
    useState("");

  // ===================================================
  // FORM ERRORS
  // ===================================================

  const [errors, setErrors] =
    useState({});

  // ===================================================
  // SEARCH STATES
  // ===================================================

  const [searchInput, setSearchInput] =
    useState("");

  const [searchId, setSearchId] =
    useState("");

  const [searchError, setSearchError] =
    useState("");

  // ===================================================
  // REQUEST DATA
  // ===================================================

  const [requests, setRequests] =
    useState(INITIAL_REQUESTS);

  // ===================================================
  // PAGINATION
  // ===================================================

  const [pageSize, setPageSize] =
    useState(10);

  // ===================================================
  // VALIDATE COMPLETE FORM
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

    // Asset Type
    if (assetType === "") {
      newErrors.assetType =
        "Asset Type is required";
    }

    // Purpose
    const purposeResult =
      validatePurpose(purpose);

    if (!purposeResult.isValid) {
      newErrors.purpose =
        purposeResult.message;
    }

    // Required Date
    const dateResult =
      validateRequiredDate(requiredDate);

    if (!dateResult.isValid) {
      newErrors.requiredDate =
        dateResult.message;
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ===================================================
  // HANDLE EMPLOYEE ID CHANGE
  // ===================================================

  const handleEmployeeIdChange = (e) => {
    const value = e.target.value;

    setEmployeeId(value);

    const result =
      validateEmployeeId(value);

    setErrors((previous) => ({
      ...previous,
      employeeId:
        value === ""
          ? ""
          : result.isValid
          ? ""
          : result.message,
    }));
  };

  // ===================================================
  // HANDLE ASSET TYPE CHANGE
  // ===================================================

  const handleAssetTypeChange = (e) => {
    const value = e.target.value;

    setAssetType(value);

    setErrors((previous) => ({
      ...previous,
      assetType:
        value === ""
          ? "Asset Type is required"
          : "",
    }));
  };

  // ===================================================
  // HANDLE PURPOSE CHANGE
  // ===================================================

  const handlePurposeChange = (e) => {
    const value = e.target.value;

    setPurpose(value);

    const result =
      validatePurpose(value);

    setErrors((previous) => ({
      ...previous,
      purpose:
        value === ""
          ? ""
          : result.isValid
          ? ""
          : result.message,
    }));
  };

  // ===================================================
  // HANDLE DATE CHANGE
  // ===================================================

  const handleDateChange = (e) => {
    const value = e.target.value;

    setRequiredDate(value);

    const result =
      validateRequiredDate(value);

    setErrors((previous) => ({
      ...previous,
      requiredDate:
        value === ""
          ? ""
          : result.isValid
          ? ""
          : result.message,
    }));
  };

  // ===================================================
  // SUBMIT REQUEST
  // ===================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid =
      validateForm();

    if (!isValid) {
      return;
    }

    // Generate request ID
    const nextNumber =
      requests.length + 1;

    const requestNumber =
      String(nextNumber).padStart(3, "0");

    const newRequest = {
      id: `AR${requestNumber} (Automatic Generated)`,

      assetType: assetType,

      employeeId: employeeId,

      status: "Pending",

      date: new Date()
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-"),
    };

    // Add request
    setRequests((previous) => [
      newRequest,
      ...previous,
    ]);

    alert(
      "✅ Asset Request Submitted Successfully!"
    );

    // Clear form
    handleCancel();
  };

  // ===================================================
  // CANCEL FORM
  // ===================================================

  const handleCancel = () => {
    setEmployeeId("");
    setAssetType("");
    setPurpose("");
    setRequiredDate("");

    setErrors({});
  };

  // ===================================================
  // SEARCH VALIDATION
  // ===================================================

  const validateSearch = (value) => {
    // Empty
    if (value.length === 0) {
      return {
        isValid: false,
        message: "Employee ID is required",
      };
    }

    // Spaces
    if (/\s/.test(value)) {
      return {
        isValid: false,
        message:
          "Employee ID should not contain spaces",
      };
    }

    // Numbers only
    if (!/^[0-9]+$/.test(value)) {
      return {
        isValid: false,
        message:
          "Employee ID must contain numbers only",
      };
    }

    // 9 digits
    if (value.length !== 9) {
      return {
        isValid: false,
        message:
          "Employee ID must be exactly 9 digits",
      };
    }

    // Validate date part
    const datePart =
      value.substring(0, 6);

    const year =
      Number(datePart.substring(0, 2));

    const day =
      Number(datePart.substring(2, 4));

    const month =
      Number(datePart.substring(4, 6));

    if (
      month < 1 ||
      month > 12
    ) {
      return {
        isValid: false,
        message:
          "Invalid month in Employee ID",
      };
    }

    if (
      day < 1 ||
      day > 31
    ) {
      return {
        isValid: false,
        message:
          "Invalid day in Employee ID",
      };
    }

    const fullYear =
      2000 + year;

    const date = new Date(
      fullYear,
      month - 1,
      day
    );

    if (
      date.getFullYear() !== fullYear ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return {
        isValid: false,
        message:
          "Invalid date in Employee ID",
      };
    }

    // Last 3 digits
    const employeeNumber =
      value.substring(6);

    if (
      employeeNumber === "000"
    ) {
      return {
        isValid: false,
        message:
          "Employee number cannot be 000",
      };
    }

    return {
      isValid: true,
      message: "",
    };
  };

  // ===================================================
  // HANDLE SEARCH
  // ===================================================

  const handleSearch = () => {
    const result =
      validateSearch(searchInput);

    if (!result.isValid) {
      setSearchError(
        result.message
      );

      setSearchId("");

      return;
    }

    setSearchError("");

    setSearchId(searchInput);
  };

  // ===================================================
  // SEARCH INPUT CHANGE
  // ===================================================

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchInput(value);

    setSearchError("");
  };

  // ===================================================
  // SEARCH ENTER KEY
  // ===================================================

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      handleSearch();
    }
  };

  // ===================================================
  // FILTER REQUESTS
  // ===================================================

  const filteredRequests =
    searchId.trim() === ""
      ? requests
      : requests.filter(
          (request) =>
            request.employeeId
              .toLowerCase()
              .includes(
                searchId.toLowerCase()
              )
        );

  // ===================================================
  // PAGINATION
  // ===================================================

  const visibleRequests =
    pageSize === "All"
      ? filteredRequests
      : filteredRequests.slice(
          0,
          Number(pageSize)
        );

  // ===================================================
  // STATUS CLASS
  // ===================================================

  const getStatusClass = (
    status
  ) => {
    return `ar-status-${status.toLowerCase()}`;
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="ar-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="ar-nav">

        <div className="ar-nav-logo">

          <span className="ar-nav-title">
            ITAMS
          </span>

          <span className="ar-nav-sub">
            IT Asset Management System
          </span>

        </div>

        <div className="ar-nav-right">

          <span className="ar-nav-user">
            {username}
          </span>

          <span className="ar-nav-divider">
            |
          </span>

          <button
            className="ar-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* =================================================
          BODY
      ================================================= */}

      <div className="ar-body">

        <h1 className="ar-page-title">
          Asset Request
        </h1>

        <p className="ar-page-sub">
          Request a new IT asset from the
          Asset Manager.
        </p>

        {/* =================================================
            REQUEST FORM
        ================================================= */}

        <div className="ar-card">

          <h2 className="ar-card-title">
            Asset Request Details
          </h2>

          <form
            onSubmit={handleSubmit}
            noValidate
          >

            {/* =================================================
                EMPLOYEE ID
            ================================================= */}

            <div className="ar-form-group">

              <label className="ar-label">
                Employee ID *
              </label>

              <input
                type="text"
                className={`ar-input ${
                  errors.employeeId
                    ? "ar-input-error"
                    : ""
                }`}
                placeholder="Enter Employee ID (e.g., 260820001)"
                value={employeeId}
                maxLength={9}
                inputMode="numeric"
                onChange={
                  handleEmployeeIdChange
                }
              />

              {errors.employeeId && (
                <span className="ar-error-text">
                  ⚠️ {errors.employeeId}
                </span>
              )}

              <div className="ar-validation-hint">
                <small>
                  Format: YYDDMM + 3-digit
                  employee number
                  (e.g., 260820001).
                  Old employee IDs are also
                  accepted.
                </small>
              </div>

            </div>

            {/* =================================================
                ASSET TYPE
            ================================================= */}

            <div className="ar-form-group">

              <label className="ar-label">
                Asset Type *
              </label>

              <select
                className={`ar-select ${
                  errors.assetType
                    ? "ar-input-error"
                    : ""
                }`}
                value={assetType}
                onChange={
                  handleAssetTypeChange
                }
              >

                <option value="">
                  Select Asset Type
                </option>

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

              {errors.assetType && (
                <span className="ar-error-text">
                  ⚠️ {errors.assetType}
                </span>
              )}

            </div>

            {/* =================================================
                PURPOSE
            ================================================= */}

            <div className="ar-form-group">

              <label className="ar-label">
                Purpose *
              </label>

              <textarea
                className={`ar-textarea ${
                  errors.purpose
                    ? "ar-input-error"
                    : ""
                }`}
                placeholder="Enter Purpose (minimum 10 characters)"
                rows={4}
                maxLength={500}
                value={purpose}
                onChange={
                  handlePurposeChange
                }
              />

              {errors.purpose && (
                <span className="ar-error-text">
                  ⚠️ {errors.purpose}
                </span>
              )}

              <div className="ar-character-count">
                {purpose.length > 0 && (
                  <small>
                    {purpose.length} / 500
                    characters
                  </small>
                )}
              </div>

            </div>

            {/* =================================================
                REQUIRED DATE
            ================================================= */}

            <div className="ar-form-group">

              <label className="ar-label">
                Required Date *
              </label>

              <input
                type="date"
                className={`ar-input ${
                  errors.requiredDate
                    ? "ar-input-error"
                    : ""
                }`}
                value={requiredDate}
                onChange={
                  handleDateChange
                }
                min={getTodayDate()}
                max={getMaxDate()}
              />

              {errors.requiredDate && (
                <span className="ar-error-text">
                  ⚠️ {errors.requiredDate}
                </span>
              )}

              <div className="ar-validation-hint">
                <small>
                  Date must be today or
                  within the next year
                </small>
              </div>

            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="ar-btn-row">

              <button
                type="submit"
                className="ar-submit-btn"
              >
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

        {/* =================================================
            SEARCH EMPLOYEE
        ================================================= */}

        <div className="ar-card">

          <h2 className="ar-card-title">
            Search Employee
          </h2>

          <div className="ar-form-group">

            <label className="ar-label">
              Employee ID
            </label>

            <div className="ar-search-row">

              <input
                type="text"
                className={`ar-input ${
                  searchError
                    ? "ar-input-error"
                    : ""
                }`}
                placeholder="Enter Employee ID"
                value={searchInput}
                maxLength={9}
                inputMode="numeric"
                onChange={
                  handleSearchChange
                }
                onKeyDown={
                  handleSearchKeyDown
                }
              />

              <button
                type="button"
                className="ar-search-btn"
                onClick={handleSearch}
              >
                Search
              </button>

            </div>

            {searchError && (
              <span className="ar-error-text">
                ⚠️ {searchError}
              </span>
            )}

          </div>

        </div>

        {/* =================================================
            REQUEST HISTORY
        ================================================= */}

        <div className="ar-card">

          <h2 className="ar-card-title">
            Request History
          </h2>

          <div className="ar-table-wrapper">

            <table className="ar-table">

              <thead>

                <tr>

                  <th>
                    Request ID
                  </th>

                  <th>
                    Asset Type
                  </th>

                  <th>
                    Employee ID
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Request Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {visibleRequests.length >
                0 ? (

                  visibleRequests.map(
                    (request) => (

                      <tr
                        key={request.id}
                      >

                        <td>
                          {request.id}
                        </td>

                        <td>
                          {request.assetType}
                        </td>

                        <td>

                          <span className="ar-employee-id">
                            {request.employeeId}
                          </span>

                        </td>

                        <td>

                          <span
                            className={`ar-status-badge ${getStatusClass(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>

                        </td>

                        <td>
                          {request.date}
                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="ar-no-data"
                    >
                      No Requests Found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* =================================================
              PAGE SIZE
          ================================================= */}

          <div className="ar-pagination-row">

            <select
              className="ar-page-size"
              value={pageSize}
              onChange={(e) => {

                const value =
                  e.target.value;

                setPageSize(
                  value === "All"
                    ? "All"
                    : Number(value)
                );

              }}
            >

              {PAGE_SIZE_OPTIONS.map(
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

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          className="ar-back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>

    </div>
  );
};

export default AssetRequest;
