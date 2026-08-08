import React, { useState } from "react";
import "./ReportMaintenance.css";

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
  return { isValid: true, message: "" };
};

// Validation function for Asset ID
const validateAssetId = (id) => {
  if (!id || id.trim() === "") {
    return { isValid: false, message: "Asset ID is required" };
  }
  if (id !== id.trim()) {
    return { isValid: false, message: "Asset ID should not have leading or trailing spaces" };
  }
  if (/\s/.test(id)) {
    return { isValid: false, message: "Asset ID should not contain spaces" };
  }
  if (/[^A-Za-z0-9]/.test(id)) {
    return { isValid: false, message: "Asset ID should not contain special characters" };
  }
  if (!id.startsWith("AST")) {
    return { isValid: false, message: "Asset ID must start with 'AST'" };
  }
  if (id.length !== 6) {
    return { isValid: false, message: "Asset ID must be exactly 6 characters long (AST + 3 alphanumeric characters)" };
  }
  const lastThree = id.substring(3);
  if (!/^[A-Za-z0-9]{3}$/.test(lastThree)) {
    return { isValid: false, message: "Last 3 characters must be alphanumeric (letters or numbers)" };
  }
  return { isValid: true, message: "" };
};

// Validation function for Issue Description
const validateDescription = (desc) => {
  if (!desc || desc.trim() === "") {
    return { isValid: false, message: "Issue description is required" };
  }
  if (desc.trim().length < 10) {
    return { isValid: false, message: "Issue description must be at least 10 characters long" };
  }
  if (desc.trim().length > 500) {
    return { isValid: false, message: "Issue description cannot exceed 500 characters" };
  }
  return { isValid: true, message: "" };
};

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

  // Validation error states
  const [errors, setErrors] = useState({});

  const [reports, setReports] = useState([
    {
      id: "MR001",
      assetId: "AST001",
      category: "Hardware Issue",
      description: "Laptop screen is not responding.",
      priority: "High",
      status: "Pending",
      date: "30-06-2026",
    },
    {
      id: "MR002",
      assetId: "AST002",
      category: "Software Issue",
      description: "Printer is not printing documents.",
      priority: "Medium",
      status: "In Progress",
      date: "29-06-2026",
    },
    {
      id: "MR003",
      assetId: "AST003",
      category: "Performance Issue",
      description: "System getting hanged frequently.",
      priority: "Low",
      status: "Completed",
      date: "27-06-2026",
    },
  ]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    const empResult = validateEmployeeId(employeeId);
    if (!empResult.isValid) {
      newErrors.employeeId = empResult.message;
    }

    const assetResult = validateAssetId(assetId);
    if (!assetResult.isValid) {
      newErrors.assetId = assetResult.message;
    }

    if (!issueCategory) {
      newErrors.issueCategory = "Issue category is required";
    }

    const descResult = validateDescription(description);
    if (!descResult.isValid) {
      newErrors.description = descResult.message;
    }

    if (!priority) {
      newErrors.priority = "Priority is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitRequest = () => {
    if (!validateForm()) {
      return;
    }

    const newReport = {
      id: `MR00${reports.length + 1}`,
      assetId,
      category: issueCategory,
      description,
      priority,
      status: "Pending",
      date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
    };

    setReports([newReport, ...reports]);
    alert("✅ Maintenance request submitted successfully!");

    setEmployeeId("");
    setAssetId("");
    setIssueCategory("");
    setDescription("");
    setPriority("");
    setErrors({});
  };

  const clearForm = () => {
    setEmployeeId("");
    setAssetId("");
    setIssueCategory("");
    setDescription("");
    setPriority("");
    setErrors({});
  };

  // Clear specific error when user types
  const handleFieldChange = (setter, field) => (e) => {
    setter(e.target.value);
    setErrors({ ...errors, [field]: "" });
  };

  const getStatusClass = (status) => {
    return `status-${status.toLowerCase().replace(" ", "-")}`;
  };

  return (
    <div className="report-page">

      {/* Navbar */}
      <nav className="report-nav">
        <div className="report-nav-logo">
          <span className="report-nav-title">ITAMS</span>
          <span className="report-nav-sub">IT Asset Management System</span>
        </div>
        <div className="report-nav-right">
          <span className="report-nav-user">{username}</span>
          <span className="report-nav-divider">|</span>
          <button className="report-logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div className="report-body">

        <div className="report-header">
          <h1 className="report-page-title">Report Maintenance</h1>
          <p className="report-page-sub">Report issues related to IT assets.</p>
        </div>

        <div className="report-card">

          <h2 className="report-card-title">Maintenance Request Form</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>Employee ID *</label>
              <input
                className={`report-input ${errors.employeeId ? "report-input-error" : ""}`}
                value={employeeId}
                onChange={handleFieldChange(setEmployeeId, "employeeId")}
                placeholder="Enter Employee ID (e.g., EMP001)"
              />
              {errors.employeeId && (
                <span className="report-error-text">⚠️ {errors.employeeId}</span>
              )}
            </div>

            <div className="form-group">
              <label>Asset ID *</label>
              <input
                className={`report-input ${errors.assetId ? "report-input-error" : ""}`}
                value={assetId}
                onChange={handleFieldChange(setAssetId, "assetId")}
                placeholder="Enter Asset ID (e.g., AST001)"
              />
              {errors.assetId && (
                <span className="report-error-text">⚠️ {errors.assetId}</span>
              )}
            </div>

            <div className="form-group">
              <label>Issue Category *</label>
              <select
                className={`report-select ${errors.issueCategory ? "report-input-error" : ""}`}
                value={issueCategory}
                onChange={handleFieldChange(setIssueCategory, "issueCategory")}
              >
                <option value="">Select Category</option>
                <option value="Hardware Issue">Hardware Issue</option>
                <option value="Software Issue">Software Issue</option>
                <option value="Performance Issue">Performance Issue</option>
                <option value="Security Issue">Security Issue</option>
                <option value="Network Issue">Network Issue</option>
                <option value="Other">Other</option>
              </select>
              {errors.issueCategory && (
                <span className="report-error-text">⚠️ {errors.issueCategory}</span>
              )}
            </div>

          </div>

          <div className="form-group">
            <label>Issue Description *</label>
            <textarea
              className={`report-textarea ${errors.description ? "report-input-error" : ""}`}
              rows="4"
              value={description}
              onChange={handleFieldChange(setDescription, "description")}
              placeholder="Enter issue description (min 10 characters)"
            />
            {errors.description && (
              <span className="report-error-text">⚠️ {errors.description}</span>
            )}
          </div>

          <div className="priority-group">
            <label>Priority *</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  value="Low"
                  checked={priority === "Low"}
                  onChange={handleFieldChange(setPriority, "priority")}
                />
                <span className="priority-low">Low</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  value="Medium"
                  checked={priority === "Medium"}
                  onChange={handleFieldChange(setPriority, "priority")}
                />
                <span className="priority-medium">Medium</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  value="High"
                  checked={priority === "High"}
                  onChange={handleFieldChange(setPriority, "priority")}
                />
                <span className="priority-high">High</span>
              </label>
            </div>
            {errors.priority && (
              <span className="report-error-text">⚠️ {errors.priority}</span>
            )}
          </div>

          <div className="buttons">
            <button className="submit-btn" onClick={submitRequest}>
              Submit Request
            </button>
            <button className="clear-btn" onClick={clearForm}>
              Clear
            </button>
          </div>

        </div>

        <div className="table-card">
          <h2 className="report-card-title">My Maintenance Requests</h2>
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
                  reports.map((r) => (
                    <tr key={r.id}>
                      <td className="report-id">{r.id}</td>
                      <td className="asset-id">{r.assetId}</td>
                      <td>{r.category}</td>
                      <td className="desc-cell">{r.description}</td>
                      <td>
                        <span className={`priority-badge priority-${r.priority.toLowerCase()}`}>
                          {r.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>{r.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No maintenance requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <button className="report-back-btn" onClick={onBack}>← Back</button>

      </div>
    </div>
  );
};

export default ReportMaintenance;
