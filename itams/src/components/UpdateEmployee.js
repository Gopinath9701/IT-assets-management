import React, { useState } from "react";
import "./UpdateEmployee.css";

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

// Validation for Employee ID
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

// Validation for Employee Name
const validateEmployeeName = (name) => {
  if (!name || name.trim() === "") {
    return { isValid: false, message: "Employee name is required" };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: "Employee name must be at least 2 characters long" };
  }
  if (name.trim().length > 100) {
    return { isValid: false, message: "Employee name cannot exceed 100 characters" };
  }
  if (/[^A-Za-z\s]/.test(name.trim())) {
    return { isValid: false, message: "Employee name should only contain letters and spaces" };
  }
  return { isValid: true, message: "" };
};

// Validation for Department
const validateDepartment = (dept) => {
  if (!dept || dept.trim() === "") {
    return { isValid: false, message: "Department is required" };
  }
  if (dept.trim().length < 2) {
    return { isValid: false, message: "Department must be at least 2 characters long" };
  }
  if (/[^A-Za-z0-9\s&-]/.test(dept.trim())) {
    return { isValid: false, message: "Department contains invalid characters" };
  }
  return { isValid: true, message: "" };
};

// Validation for Designation
const validateDesignation = (designation) => {
  if (!designation || designation.trim() === "") {
    return { isValid: false, message: "Designation is required" };
  }
  if (designation.trim().length < 2) {
    return { isValid: false, message: "Designation must be at least 2 characters long" };
  }
  if (/[^A-Za-z0-9\s-]/.test(designation.trim())) {
    return { isValid: false, message: "Designation contains invalid characters" };
  }
  return { isValid: true, message: "" };
};

// Validation for Phone Number
const validatePhoneNumber = (phone) => {
  if (!phone || phone.trim() === "") {
    return { isValid: false, message: "Phone number is required" };
  }
  const phoneStr = phone.trim();
  if (!/^[0-9]{10}$/.test(phoneStr)) {
    return { isValid: false, message: "Phone number must be exactly 10 digits" };
  }
  return { isValid: true, message: "" };
};

// Validation for Email
const validateEmail = (email) => {
  if (!email || email.trim() === "") {
    return { isValid: false, message: "Email is required" };
  }
  const emailStr = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }
  return { isValid: true, message: "" };
};

// ==========================================
// SAMPLE EMPLOYEE DATA
// ==========================================
const EMPLOYEE_DATA = {
  "EMP001": {
    id: "EMP001",
    name: "Emp1",
    department: "IT",
    designation: "Developer",
    phone: "9876543210",
    email: "emp1@itams.com",
  },
  "EMP002": {
    id: "EMP002",
    name: "Emp2",
    department: "HR",
    designation: "Manager",
    phone: "9876543211",
    email: "emp2@itams.com",
  },
  "EMP003": {
    id: "EMP003",
    name: "Emp3",
    department: "Finance",
    designation: "Accountant",
    phone: "9876543212",
    email: "emp3@itams.com",
  },
};

const DEPARTMENTS = ["IT", "HR", "Finance", "Marketing", "Sales", "Operations", "Administration"];
const DESIGNATIONS = ["Developer", "Manager", "Accountant", "Analyst", "Executive", "Assistant", "Lead", "Director"];

// ==========================================
// MAIN COMPONENT
// ==========================================
const UpdateEmployee = ({ username = "username", onLogout, onBack }) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearchValid, setIsSearchValid] = useState(true);
  const [isSearchTouched, setIsSearchTouched] = useState(false);

  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    department: "",
    designation: "",
    phone: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Handle search input change with validation
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setIsSearchTouched(false);
    setSearchError("");

    if (value.trim() === "") {
      setIsSearchValid(true);
      return;
    }

    const result = validateEmployeeId(value);
    setIsSearchValid(result.isValid);
    if (!result.isValid) {
      setSearchError(result.message);
    }
  };

  // Handle search
  const handleSearch = () => {
    setIsSearchTouched(true);
    setSearchError("");

    if (searchInput.trim() === "") {
      setSearchError("Please enter an Employee ID to search");
      setIsSearchValid(false);
      setEmployee(null);
      return;
    }

    const result = validateEmployeeId(searchInput);
    if (!result.isValid) {
      setSearchError(result.message);
      setIsSearchValid(false);
      setEmployee(null);
      return;
    }

    // Check if employee exists
    const empId = searchInput.trim().toUpperCase();
    const foundEmployee = EMPLOYEE_DATA[empId];
    if (foundEmployee) {
      setEmployee(foundEmployee);
      setFormData({ ...foundEmployee });
      setFormErrors({});
      setUpdateSuccess(false);
      setSearchError("");
      setIsSearchValid(true);
    } else {
      setSearchError(`Employee ID "${empId}" not found in the system`);
      setIsSearchValid(false);
      setEmployee(null);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Handle form field change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
    setUpdateSuccess(false);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    const nameResult = validateEmployeeName(formData.name);
    if (!nameResult.isValid) errors.name = nameResult.message;

    const deptResult = validateDepartment(formData.department);
    if (!deptResult.isValid) errors.department = deptResult.message;

    const desigResult = validateDesignation(formData.designation);
    if (!desigResult.isValid) errors.designation = desigResult.message;

    const phoneResult = validatePhoneNumber(formData.phone);
    if (!phoneResult.isValid) errors.phone = phoneResult.message;

    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) errors.email = emailResult.message;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle update
  const handleUpdate = () => {
    if (!validateForm()) {
      return;
    }

    // Update employee data (in real app, this would be an API call)
    EMPLOYEE_DATA[formData.id] = { ...formData };
    setEmployee({ ...formData });
    setUpdateSuccess(true);
    alert(`✅ Employee ${formData.id} updated successfully!`);
  };

  // Handle cancel
  const handleCancel = () => {
    if (employee) {
      setFormData({ ...employee });
      setFormErrors({});
      setUpdateSuccess(false);
    }
  };

  return (
    <div className="update-page">

      {/* ── Top Navbar ── */}
      <header className="update-header">
        <div className="logo-section">
          <h1>ITAMS</h1>
          <p>IT Asset Management System</p>
        </div>
        <div className="user-section">
          <span>{username}</span>
          <span className="divider">|</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      {/* ── Main Container ── */}
      <div className="update-container">

        <h1>Update Employee Details</h1>
        <p>Search and update employee information.</p>

        {/* ── Search Card ── */}
        <div className="search-card">
          <h2>Search Employee</h2>
          <div className="search-row">
            <input
              className={`search-input ${(!isSearchValid && isSearchTouched) || (searchError && isSearchTouched) ? "input-error" : ""}`}
              type="text"
              placeholder="Enter Employee ID (e.g., EMP001)"
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
          {searchError && isSearchTouched && (
            <div className="search-error">⚠️ {searchError}</div>
          )}
          <div className="search-hint">
            <small>Format: EMP + 3 alphanumeric characters (e.g., EMP001, EMPA12, EMP1AB)</small>
          </div>
        </div>

        {/* ── Employee Details Card ── */}
        <div className="employee-card">
          <h2>Employee Details</h2>

          {employee ? (
            <div className="employee-form">
              <div className="form-grid">
                {/* Employee ID - Read Only */}
                <div className="form-group">
                  <label>Employee ID (Read Only)</label>
                  <input
                    type="text"
                    value={formData.id}
                    readOnly
                    className="readonly-input"
                  />
                </div>

                {/* Employee Name - Editable */}
                <div className="form-group">
                  <label>Employee Name (Editable) *</label>
                  <input
                    className={`${formErrors.name ? "input-error" : ""}`}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter employee name"
                  />
                  {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                </div>

                {/* Department - Editable */}
                <div className="form-group">
                  <label>Department (Editable) *</label>
                  <select
                    className={`${formErrors.department ? "input-error" : ""}`}
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {formErrors.department && <span className="field-error">{formErrors.department}</span>}
                </div>

                {/* Designation - Editable */}
                <div className="form-group">
                  <label>Designation (Editable) *</label>
                  <select
                    className={`${formErrors.designation ? "input-error" : ""}`}
                    name="designation"
                    value={formData.designation}
                    onChange={handleFormChange}
                  >
                    <option value="">Select Designation</option>
                    {DESIGNATIONS.map((desig) => (
                      <option key={desig} value={desig}>{desig}</option>
                    ))}
                  </select>
                  {formErrors.designation && <span className="field-error">{formErrors.designation}</span>}
                </div>

                {/* Phone Number - Editable */}
                <div className="form-group">
                  <label>Phone Number (Editable) *</label>
                  <input
                    className={`${formErrors.phone ? "input-error" : ""}`}
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="Enter 10-digit phone number"
                  />
                  {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
                </div>

                {/* Email - Editable */}
                <div className="form-group">
                  <label>Email (Editable) *</label>
                  <input
                    className={`${formErrors.email ? "input-error" : ""}`}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Enter email address"
                  />
                  {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                </div>
              </div>

              {updateSuccess && (
                <div className="success-message">
                  ✅ Employee details updated successfully!
                </div>
              )}

              <div className="button-group">
                <button className="update-btn" onClick={handleUpdate}>
                  Update Details
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="no-employee-message">
              <p>🔍 Search for an employee to view and update details.</p>
            </div>
          )}
        </div>

        {/* ── Back Button ── */}
        <button className="back-btn" onClick={onBack}>← Back</button>

      </div>
    </div>
  );
};

export default UpdateEmployee;
