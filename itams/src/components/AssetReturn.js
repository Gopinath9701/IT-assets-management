import React, { useState } from "react";
import "./AssetReturn.css";

const PAGE_SIZE_OPTIONS = [10, 30, 50, "All"];

// Local date parts, not toISOString() (which is UTC) — under IST that can
// roll the date by one: a timestamp like 20:00 UTC is already 1:30am the
// NEXT day in IST, so .toISOString().slice(0,10) would report the wrong
// calendar day for anything stored/read near a day boundary.
const toLocalIso = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
const todayIso = () => toLocalIso(new Date());

const AssetReturn = ({ username = "username", onLogout, onBack }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeIdError, setEmployeeIdError] = useState("");
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [returnHistory, setReturnHistory] = useState([]);
  const [historyPageSize, setHistoryPageSize] = useState(10);

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
  const [returnError, setReturnError] = useState("");

  // =====================================================
  // EMPLOYEE ID VALIDATION
  // =====================================================

  const validateEmployeeId = (id) => {
    if (!id || id.length === 0) {
      return "Employee ID is required.";
    }

    if (id.trim() !== id) {
      return "Employee ID should not have leading or trailing spaces.";
    }

    if (/\s/.test(id)) {
      return "Employee ID should not contain spaces.";
    }

    if (!/^\d+$/.test(id)) {
      return "Employee ID must contain numbers only.";
    }

    if (id.length !== 9) {
      return "Employee ID must be exactly 9 digits.";
    }

    const yy = id.substring(0, 2);
    const mm = id.substring(2, 4);
    const dd = id.substring(4, 6);
    const employeeNumber = id.substring(6, 9);

    if (!/^\d{3}$/.test(employeeNumber)) {
      return "Last 3 digits must be the employee number.";
    }

    if (employeeNumber === "000") {
      return "Employee number cannot be 000.";
    }

    if (!/^\d{2}$/.test(yy)) {
      return "First 2 digits must represent YY.";
    }

    const month = Number(mm);

    if (!/^\d{2}$/.test(mm) || month < 1 || month > 12) {
      return "MM must be between 01 and 12.";
    }

    const day = Number(dd);

    if (!/^\d{2}$/.test(dd) || day < 1 || day > 31) {
      return "DD must be between 01 and 31.";
    }

    const fullYear = 2000 + Number(yy);

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
      return "Employee ID contains an invalid calendar date.";
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (employeeDate > today) {
      return "Employee ID date cannot be in the future.";
    }

    return "";
  };

  // =====================================================
  // SEARCH EMPLOYEE — loads their current assignments
  // =====================================================

  const handleSearch = async () => {
    setSuccessMessage("");
    const error = validateEmployeeId(employeeId);
    if (error) { setEmployeeIdError(error); return; }
    setEmployeeIdError("");

    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

      const resp = await fetch(
        "http://localhost:5000/api/asset-assignments/history",
        { headers }
      );
      const data = await resp.json();
      if (!data.success) { setSuccessMessage("Could not load assignments."); return; }

      const allForEmployee = (data.history || []).filter(
        (h) => h.employee_id === employeeId
      );

      // Active (not yet returned)
      const active = allForEmployee.filter((h) => h.status === "Assigned");
      setAssignedAssets(
        active.map((h) => {
          // asset_name_id format: "Model (ASSETID)" — extract ID from inside parens
          const assetIdMatch = h.asset_name_id
            ? h.asset_name_id.match(/\(([^)]+)\)$/)
            : null;
          const assetId = assetIdMatch ? assetIdMatch[1] : h.asset_name_id || "-";
          return {
            assignmentId: h.assignment_id,
            assetId,
            assetType: h.asset_type || "-",
            assignedDate: h.assigned_date
              ? new Date(h.assigned_date).toLocaleDateString("en-GB").replace(/\//g, "-")
              : "-",
            // ISO form kept alongside the display string above so the return
            // modal's date picker can set min= to this exact date.
            assignedDateIso: h.assigned_date
              ? toLocalIso(new Date(h.assigned_date))
              : null,
          };
        })
      );

      // Returned history
      const returned = allForEmployee.filter((h) => h.status === "Returned");
      setReturnHistory(
        returned.map((h) => {
          const assetIdMatch = h.asset_name_id
            ? h.asset_name_id.match(/\(([^)]+)\)$/)
            : null;
          const assetId = assetIdMatch ? assetIdMatch[1] : h.asset_name_id || "-";
          return {
            assetId,
            employeeId: h.employee_id,
            assetType: h.asset_type || "-",
            returnDate: h.returned_date
              ? new Date(h.returned_date).toLocaleDateString("en-GB").replace(/\//g, "-")
              : "-",
            condition: h.condition || "-",
            remarks: h.remarks || "-",
          };
        })
      );

      setSuccessMessage(
        active.length > 0
          ? `Found ${active.length} assigned asset(s) for this employee.`
          : "No currently assigned assets found for this employee."
      );
    } catch (err) {
      console.error("Search Error:", err);
      setSuccessMessage("Unable to connect to server.");
    }
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

    setReturnForm({
      returnDate: todayIso(),
      condition: "Good",
      remarks: "",
    });

    setReturnDateError("");
    setConditionError("");
    setRemarksError("");
    setReturnError("");
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
    setReturnError("");
  };

  // =====================================================
  // RETURN DATE VALIDATION
  // Return Date is a native <input type="date">, whose value is always
  // either "" or a real, well-formed YYYY-MM-DD calendar date (the browser
  // guarantees this) — plain string comparison is enough for before/after
  // checks since zero-padded ISO dates sort lexicographically in date
  // order, with no Date-object/timezone parsing to get wrong.
  // =====================================================

  const validateReturnDate = (dateString) => {
    if (!dateString) {
      return "Return Date is required.";
    }

    if (dateString > todayIso()) {
      return "Return Date cannot be a future date.";
    }

    if (
      selectedAsset &&
      selectedAsset.assignedDateIso &&
      dateString < selectedAsset.assignedDateIso
    ) {
      return "Return Date cannot be before Assigned Date.";
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
  // RETURN ASSET — calls backend
  // =====================================================

  const handleReturn = async () => {
    setSuccessMessage("");
    if (!selectedAsset) return;

    const employeeError = validateEmployeeId(employeeId);
    if (employeeError) { setEmployeeIdError(employeeError); return; }
    setEmployeeIdError("");

    const dateError = validateReturnDate(returnForm.returnDate);
    if (dateError) { setReturnDateError(dateError); return; }
    setReturnDateError("");

    const conditionErrorMessage = validateCondition(returnForm.condition);
    if (conditionErrorMessage) { setConditionError(conditionErrorMessage); return; }
    setConditionError("");

    const remarksErrorMessage = validateRemarks(returnForm.remarks);
    if (remarksErrorMessage) { setRemarksError(remarksErrorMessage); return; }
    setRemarksError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/asset-assignments/${selectedAsset.assignmentId}/return`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            // returnForm.returnDate is already YYYY-MM-DD (native date input).
            returnDate: returnForm.returnDate,
            condition: returnForm.condition,
            remarks: returnForm.remarks.trim() || null,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setReturnError(data.message || "Failed to return asset.");
        return;
      }

      closeModal();
      setSuccessMessage("Asset returned successfully!");
      // Refresh the list
      handleSearch();
    } catch (err) {
      console.error("Return Error:", err);
      setReturnError("Unable to connect to server.");
    }
  };

  return (
    <div className="asset-return-page">

      {/* HEADER */}

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

          <span>{username}</span>

          <span className="header-divider"></span>

          <button onClick={onLogout}>
            Logout
          </button>

        </div>

      </header>

      {/* MAIN CONTENT */}

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

        {/* SEARCH EMPLOYEE */}

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

        {/* ASSIGNED ASSETS */}

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

        {/* RETURN HISTORY */}

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

                {(historyPageSize === "All"
                  ? returnHistory
                  : returnHistory.slice(0, historyPageSize)
                ).map(
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

        {/* BOTTOM */}

        <div className="bottom-row">

          <button
            className="back-button"
            onClick={onBack}
          >
            ← Back
          </button>

          <span className="page-size-info">
            Showing{" "}
            {historyPageSize === "All"
              ? returnHistory.length
              : Math.min(historyPageSize, returnHistory.length)}{" "}
            of {returnHistory.length} returns
          </span>

          <select
            className="page-size"
            value={historyPageSize}
            onChange={(e) => {
              const value = e.target.value;
              setHistoryPageSize(value === "All" ? "All" : Number(value));
            }}
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

        </div>

      </main>

      {/* RETURN MODAL */}

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
                  type="date"
                  value={returnForm.returnDate}
                  onChange={(e) => {
                    setReturnForm({
                      ...returnForm,
                      returnDate:
                        e.target.value,
                    });

                    setReturnDateError("");
                  }}
                  min={
                    selectedAsset?.assignedDateIso ||
                    undefined
                  }
                  max={todayIso()}
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

            {returnError && (
              <div className="validation-error">
                ⚠ {returnError}
              </div>
            )}

            {/* MODAL BUTTONS */}

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
