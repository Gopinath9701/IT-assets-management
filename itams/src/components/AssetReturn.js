import React, { useState } from "react";
import "./AssetReturn.css";

const AssetReturn = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeIdError, setEmployeeIdError] = useState("");

  const [assignedAssets, setAssignedAssets] = useState([
    {
      assetId: "LAP001",
      assetType: "Laptop",
      assignedDate: "15-08-2026",
    },
    {
      assetId: "MON001",
      assetType: "Monitor",
      assignedDate: "15-08-2026",
    },
    {
      assetId: "KEY001",
      assetType: "Keyboard",
      assignedDate: "16-08-2026",
    },
  ]);

  const [returnHistory, setReturnHistory] = useState([
    {
      assetId: "LAP001",
      employeeId: "260815001",
      assetType: "Laptop",
      returnDate: "18-08-2026",
      condition: "Good",
      remarks: "-",
    },
    {
      assetId: "MON001",
      employeeId: "260815002",
      assetType: "Monitor",
      returnDate: "18-08-2026",
      condition: "Damaged",
      remarks: "Screen issue",
    },
    {
      assetId: "KEY001",
      employeeId: "260817001",
      assetType: "Keyboard",
      returnDate: "17-08-2026",
      condition: "Good",
      remarks: "-",
    },
  ]);

  const [selectedAsset, setSelectedAsset] = useState(null);

  const [returnForm, setReturnForm] = useState({
    returnDate: "",
    condition: "Good",
    remarks: "",
  });

  const [returnDateError, setReturnDateError] = useState("");
  const [conditionError, setConditionError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // =====================================================
  // EMPLOYEE ID VALIDATION
  //
  // FORMAT:
  // YYMMDD + 3 DIGITS
  //
  // Example:
  // 260815001
  //
  // 26  = Year
  // 08  = Month
  // 15  = Day
  // 001 = Employee Number
  //
  // RULES:
  // - Exactly 9 digits
  // - Numbers only
  // - No spaces
  // - Employee number cannot be 000
  // - Valid calendar date
  // - Date cannot be future
  // =====================================================

  const validateEmployeeId = (id) => {
    // Empty
    if (!id || id.length === 0) {
      return "Employee ID is required.";
    }

    // Leading / trailing spaces
    if (id.trim() !== id) {
      return "Employee ID should not have leading or trailing spaces.";
    }

    // Any spaces
    if (/\s/.test(id)) {
      return "Employee ID should not contain spaces.";
    }

    // Numbers only
    if (!/^\d+$/.test(id)) {
      return "Employee ID must contain numbers only.";
    }

    // Exactly 9 digits
    if (id.length !== 9) {
      return "Employee ID must be exactly 9 digits.";
    }

    // =====================================================
    // SPLIT ID
    // =====================================================

    const yy = id.substring(0, 2);
    const mm = id.substring(2, 4);
    const dd = id.substring(4, 6);
    const employeeNumber = id.substring(6, 9);

    // =====================================================
    // EMPLOYEE NUMBER
    // =====================================================

    if (!/^\d{3}$/.test(employeeNumber)) {
      return "Last 3 digits must be the employee number.";
    }

    if (employeeNumber === "000") {
      return "Employee number cannot be 000.";
    }

    // =====================================================
    // YEAR
    // =====================================================

    if (!/^\d{2}$/.test(yy)) {
      return "First 2 digits must represent YY.";
    }

    // =====================================================
    // MONTH
    // =====================================================

    const month = Number(mm);

    if (!/^\d{2}$/.test(mm) || month < 1 || month > 12) {
      return "MM must be between 01 and 12.";
    }

    // =====================================================
    // DAY
    // =====================================================

    const day = Number(dd);

    if (!/^\d{2}$/.test(dd) || day < 1 || day > 31) {
      return "DD must be between 01 and 31.";
    }

    // =====================================================
    // CREATE ACTUAL DATE
    // =====================================================

    const fullYear = 2000 + Number(yy);

    const employeeDate = new Date(
      fullYear,
      month - 1,
      day
    );

    employeeDate.setHours(0, 0, 0, 0);

    // =====================================================
    // CHECK REAL CALENDAR DATE
    // =====================================================

    if (
      employeeDate.getFullYear() !== fullYear ||
      employeeDate.getMonth() !== month - 1 ||
      employeeDate.getDate() !== day
    ) {
      return "Employee ID contains an invalid calendar date.";
    }

    // =====================================================
    // DATE CANNOT BE FUTURE
    // =====================================================

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (employeeDate > today) {
      return "Employee ID date cannot be in the future.";
    }

    // =====================================================
    // VALID
    // =====================================================

    return "";
  };

  // =====================================================
  // SEARCH EMPLOYEE
  // =====================================================

  const handleSearch = () => {
    setSuccessMessage("");

    const error = validateEmployeeId(employeeId);

    if (error) {
      setEmployeeIdError(error);
      return;
    }

    setEmployeeIdError("");

    setSuccessMessage("Employee ID is valid.");
  };

  // =====================================================
  // OPEN RETURN MODAL
  // =====================================================

  const openReturnModal = (asset) => {
    setSuccessMessage("");

    const employeeError = validateEmployeeId(employeeId);

    if (employeeError) {
      setEmployeeIdError(employeeError);
      return;
    }

    setEmployeeIdError("");

    setSelectedAsset(asset);

    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    setReturnForm({
      returnDate: `${day}-${month}-${year}`,
      condition: "Good",
      remarks: "",
    });

    setReturnDateError("");
    setConditionError("");
    setRemarksError("");
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    setSelectedAsset(null);

    setReturnForm({
      returnDate: "",
      condition: "Good",
      remarks: "",
    });

    setReturnDateError("");
    setConditionError("");
    setRemarksError("");
  };

  // =====================================================
  // DATE CONVERSION
  // DD-MM-YYYY -> DATE
  // =====================================================

  const convertToDate = (dateString) => {
    if (!dateString) {
      return null;
    }

    const parts = dateString.split("-");

    if (parts.length !== 3) {
      return null;
    }

    const day = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const year = Number(parts[2]);

    const date = new Date(year, month, day);

    date.setHours(0, 0, 0, 0);

    return date;
  };

  // =====================================================
  // RETURN DATE VALIDATION
  // =====================================================

  const validateReturnDate = (dateString) => {
    if (!dateString || dateString.trim() === "") {
      return "Return Date is required.";
    }

    if (/\s/.test(dateString)) {
      return "Return Date should not contain spaces.";
    }

    if (!/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      return "Return Date must be in DD-MM-YYYY format.";
    }

    const selectedDate = convertToDate(dateString);

    if (!selectedDate || isNaN(selectedDate.getTime())) {
      return "Please enter a valid Return Date.";
    }

    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();

    const originalParts = dateString.split("-");

    if (
      Number(originalParts[0]) !== day ||
      Number(originalParts[1]) !== month ||
      Number(originalParts[2]) !== year
    ) {
      return "Please enter a valid calendar date.";
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      return "Return Date cannot be a future date.";
    }

    if (selectedAsset) {
      const assignedDate = convertToDate(
        selectedAsset.assignedDate
      );

      if (
        assignedDate &&
        selectedDate < assignedDate
      ) {
        return "Return Date cannot be before Assigned Date.";
      }
    }

    return "";
  };

  // =====================================================
  // CONDITION VALIDATION
  // =====================================================

  const validateCondition = (condition) => {
    if (!condition || condition.trim() === "") {
      return "Return Condition is required.";
    }

    const validConditions = [
      "Good",
      "Damaged",
      "Faulty",
    ];

    if (!validConditions.includes(condition)) {
      return "Please select a valid Return Condition.";
    }

    return "";
  };

  // =====================================================
  // REMARKS VALIDATION
  // =====================================================

  const validateRemarks = (remarks) => {
    if (!remarks || remarks.trim() === "") {
      return "";
    }

    if (remarks.length > 250) {
      return "Remarks cannot exceed 250 characters.";
    }

    if (remarks.trim().length < 2) {
      return "Remarks must contain at least 2 characters.";
    }

    if (remarks !== remarks.trim()) {
      return "Remarks should not have leading or trailing spaces.";
    }

    if (/\s{2,}/.test(remarks)) {
      return "Remarks should not contain multiple consecutive spaces.";
    }

    if (!/^[A-Za-z0-9\s.,()&-]+$/.test(remarks)) {
      return "Remarks contains invalid characters.";
    }

    return "";
  };

  // =====================================================
  // RETURN ASSET
  // =====================================================

  const handleReturn = () => {
    setSuccessMessage("");

    if (!selectedAsset) {
      return;
    }

    // =====================================================
    // EMPLOYEE ID
    // =====================================================

    const employeeError =
      validateEmployeeId(employeeId);

    if (employeeError) {
      setEmployeeIdError(employeeError);
      return;
    }

    setEmployeeIdError("");

    // =====================================================
    // RETURN DATE
    // =====================================================

    const dateError =
      validateReturnDate(returnForm.returnDate);

    if (dateError) {
      setReturnDateError(dateError);
      return;
    }

    setReturnDateError("");

    // =====================================================
    // CONDITION
    // =====================================================

    const conditionErrorMessage =
      validateCondition(returnForm.condition);

    if (conditionErrorMessage) {
      setConditionError(conditionErrorMessage);
      return;
    }

    setConditionError("");

    // =====================================================
    // REMARKS
    // =====================================================

    const remarksErrorMessage =
      validateRemarks(returnForm.remarks);

    if (remarksErrorMessage) {
      setRemarksError(remarksErrorMessage);
      return;
    }

    setRemarksError("");

    // =====================================================
    // CREATE HISTORY
    // =====================================================

    const newHistory = {
      assetId: selectedAsset.assetId,
      employeeId: employeeId,
      assetType: selectedAsset.assetType,
      returnDate: returnForm.returnDate,
      condition: returnForm.condition,
      remarks:
        returnForm.remarks.trim() || "-",
    };

    // Add history
    setReturnHistory((prev) => [
      newHistory,
      ...prev,
    ]);

    // Remove returned asset
    setAssignedAssets((prev) =>
      prev.filter(
        (asset) =>
          asset.assetId !== selectedAsset.assetId
      )
    );

    closeModal();

    setSuccessMessage(
      "Asset returned successfully!"
    );
  };

  return (
    <div className="asset-return-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="asset-return-header">

        <div>

          <div className="asset-return-logo">
            ITAMS
          </div>

          <div className="asset-return-subtitle">
            IT Asset Management System
          </div>

        </div>

        <div className="asset-return-user">

          <span>username</span>

          <span className="header-divider"></span>

          <button>
            Logout
          </button>

        </div>

      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="asset-return-content">

        <h1>Asset Return</h1>

        <p className="page-description">
          Return assets assigned to employees.
        </p>

        {/* SUCCESS MESSAGE */}

        {successMessage && (
          <div className="success-message">
            ✓ {successMessage}
          </div>
        )}

        {/* =====================================================
            SEARCH EMPLOYEE
        ===================================================== */}

        <section className="return-section">

          <h2>
            1. Search Employee
          </h2>

          <div className="search-row">

            <div className="search-input-group">

              <label>
                Employee ID
              </label>

              <input
                className={
                  employeeIdError
                    ? "input-error"
                    : ""
                }
                type="text"
                value={employeeId}
                onChange={(e) => {
                  const value = e.target.value;

                  setEmployeeId(value);

                  setEmployeeIdError("");
                  setSuccessMessage("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="Enter Employee ID (e.g. 260815001)"
                maxLength={9}
              />

              {employeeIdError && (
                <div className="validation-error">
                  ⚠ {employeeIdError}
                </div>
              )}

              <div className="validation-hint">
                Format: YYMMDD + 3 employee digits
                (e.g., 260815001)
              </div>

            </div>

            <button
              className="search-button"
              onClick={handleSearch}
            >
              Search
            </button>

          </div>

        </section>

        {/* =====================================================
            ASSIGNED ASSETS
        ===================================================== */}

        <section className="return-section">

          <h2>
            2. Assigned Assets
          </h2>

          <div className="table-wrapper">

            <table className="asset-table">

              <thead>

                <tr>

                  <th>Asset ID</th>

                  <th>Asset Type</th>

                  <th>Assigned Date</th>

                  <th>Return</th>

                </tr>

              </thead>

              <tbody>

                {assignedAssets.length > 0 ? (

                  assignedAssets.map((asset) => (

                    <tr key={asset.assetId}>

                      <td>
                        {asset.assetId}
                      </td>

                      <td>
                        {asset.assetType}
                      </td>

                      <td>
                        {asset.assignedDate}
                      </td>

                      <td>

                        <button
                          className="return-button"
                          onClick={() =>
                            openReturnModal(asset)
                          }
                        >
                          Return
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="4"
                      className="no-assets"
                    >
                      No assigned assets found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* =====================================================
            RETURN HISTORY
        ===================================================== */}

        <section className="return-section">

          <h2>
            3. Asset Return History
          </h2>

          <div className="table-wrapper">

            <table className="asset-table history-table">

              <thead>

                <tr>

                  <th>Asset ID</th>
                  <th>Employee ID</th>
                  <th>Asset Type</th>
                  <th>Return Date</th>
                  <th>Condition</th>
                  <th>Remarks</th>

                </tr>

              </thead>

              <tbody>

                {returnHistory.map(
                  (item, index) => (

                    <tr
                      key={`${item.assetId}-${index}`}
                    >

                      <td>
                        {item.assetId}
                      </td>

                      <td>
                        {item.employeeId}
                      </td>

                      <td>
                        {item.assetType}
                      </td>

                      <td>
                        {item.returnDate}
                      </td>

                      <td>
                        {item.condition}
                      </td>

                      <td>
                        {item.remarks}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* =====================================================
            BOTTOM
        ===================================================== */}

        <div className="bottom-row">

          <button
            className="back-button"
            onClick={() =>
              window.history.back()
            }
          >
            ← Back
          </button>

          <select className="page-size">

            <option>10</option>
            <option>20</option>
            <option>50</option>

          </select>

        </div>

      </main>

      {/* =====================================================
          RETURN MODAL
      ===================================================== */}

      {selectedAsset && (

        <div className="modal-overlay">

          <div className="return-modal">

            <div className="modal-header">

              <h2>
                Return Asset
              </h2>

              <button
                className="close-button"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <div className="modal-form">

              {/* Asset ID */}

              <div className="form-group">

                <label>
                  Asset ID
                </label>

                <input
                  type="text"
                  value={selectedAsset.assetId}
                  readOnly
                />

              </div>

              {/* Employee ID */}

              <div className="form-group">

                <label>
                  Employee ID
                </label>

                <input
                  type="text"
                  value={employeeId}
                  readOnly
                />

              </div>

              {/* Asset Type */}

              <div className="form-group">

                <label>
                  Asset Type
                </label>

                <input
                  type="text"
                  value={selectedAsset.assetType}
                  readOnly
                />

              </div>

              {/* Return Date */}

              <div className="form-group">

                <label>
                  Return Date
                </label>

                <input
                  className={
                    returnDateError
                      ? "input-error"
                      : ""
                  }
                  type="text"
                  value={returnForm.returnDate}
                  onChange={(e) => {
                    setReturnForm({
                      ...returnForm,
                      returnDate:
                        e.target.value,
                    });

                    setReturnDateError("");
                  }}
                  placeholder="DD-MM-YYYY"
                  maxLength={10}
                />

                {returnDateError && (
                  <div className="validation-error">
                    ⚠ {returnDateError}
                  </div>
                )}

              </div>

              {/* Condition */}

              <div className="form-group full-width">

                <label>
                  Return Condition
                </label>

                <select
                  className={
                    conditionError
                      ? "input-error"
                      : ""
                  }
                  value={returnForm.condition}
                  onChange={(e) => {
                    setReturnForm({
                      ...returnForm,
                      condition:
                        e.target.value,
                    });

                    setConditionError("");
                  }}
                >

                  <option value="Good">
                    Good
                  </option>

                  <option value="Damaged">
                    Damaged
                  </option>

                  <option value="Faulty">
                    Faulty
                  </option>

                </select>

                {conditionError && (
                  <div className="validation-error">
                    ⚠ {conditionError}
                  </div>
                )}

              </div>

              {/* Remarks */}

              <div className="form-group full-width">

                <label>
                  Remarks (Optional)
                </label>

                <input
                  className={
                    remarksError
                      ? "input-error"
                      : ""
                  }
                  type="text"
                  value={returnForm.remarks}
                  onChange={(e) => {
                    setReturnForm({
                      ...returnForm,
                      remarks:
                        e.target.value,
                    });

                    setRemarksError("");
                  }}
                  placeholder="Enter remarks"
                  maxLength={250}
                />

                {remarksError && (
                  <div className="validation-error">
                    ⚠ {remarksError}
                  </div>
                )}

              </div>

            </div>

            {/* Modal Buttons */}

            <div className="modal-actions">

              <button
                className="confirm-button"
                onClick={handleReturn}
              >
                Confirm Return
              </button>

              <button
                className="cancel-button"
                onClick={closeModal}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AssetReturn;
