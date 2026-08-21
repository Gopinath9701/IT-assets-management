import React, { useState } from "react";
import "./UpdateEmployee.css";

// ======================================================
// VALIDATION FUNCTIONS
// ======================================================

// Employee ID must be exactly YYMMDD001
// Example: 260819001
const validateEmployeeId = (id) => {
  if (!id || id.trim() === "") {
    return {
      isValid: false,
      message: "Employee ID is required.",
    };
  }

  if (id !== id.trim()) {
    return {
      isValid: false,
      message: "Employee ID must not have leading or trailing spaces.",
    };
  }

  if (/\s/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID must not contain spaces.",
    };
  }

  if (!/^\d{9}$/.test(id)) {
    return {
      isValid: false,
      message: "Employee ID must contain exactly 9 digits (YYMMDD001).",
    };
  }

  const year = Number(id.substring(0, 2));
  const month = Number(id.substring(2, 4));
  const day = Number(id.substring(4, 6));
  const employeeNumber = Number(id.substring(6, 9));

  if (month < 1 || month > 12) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid month.",
    };
  }

  if (day < 1 || day > 31) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid day.",
    };
  }

  if (employeeNumber < 1 || employeeNumber > 999) {
    return {
      isValid: false,
      message: "Last 3 digits must be between 001 and 999.",
    };
  }

  const fullYear = 2000 + year;
  const date = new Date(fullYear, month - 1, day);

  if (
    date.getFullYear() !== fullYear ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return {
      isValid: false,
      message: "Employee ID contains an invalid date.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// ======================================================
// EMPLOYEE NAME VALIDATION
// ======================================================

const validateEmployeeName = (name) => {
  if (!name || name === "") {
    return {
      isValid: false,
      message: "Employee name is required.",
    };
  }

  if (name !== name.trim()) {
    return {
      isValid: false,
      message: "Employee name must not start or end with a space.",
    };
  }

  if (/\s{2,}/.test(name)) {
    return {
      isValid: false,
      message: "Multiple spaces are not allowed.",
    };
  }

  if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name)) {
    return {
      isValid: false,
      message: "Employee name should contain only letters and single spaces.",
    };
  }

  if (name.length < 2) {
    return {
      isValid: false,
      message: "Employee name must be at least 2 characters long.",
    };
  }

  if (name.length > 100) {
    return {
      isValid: false,
      message: "Employee name cannot exceed 100 characters.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// ======================================================
// EMAIL VALIDATION
// ======================================================

const validateEmail = (email, employeeId) => {
  if (!email || email === "") {
    return {
      isValid: false,
      message: "Email is required.",
    };
  }

  if (email !== email.trim()) {
    return {
      isValid: false,
      message: "Email must not have leading or trailing spaces.",
    };
  }

  if (/\s/.test(email)) {
    return {
      isValid: false,
      message: "Spaces are not allowed in email.",
    };
  }

  const expectedEmail = `${employeeId}@gmail.com`;

  if (email !== expectedEmail) {
    return {
      isValid: false,
      message: `Email must match Employee ID: ${expectedEmail}`,
    };
  }

  if (!/^\d{9}@gmail\.com$/.test(email)) {
    return {
      isValid: false,
      message: "Email must end with @gmail.com and match Employee ID.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// ======================================================
// DEPARTMENT VALIDATION
// ======================================================

const validateDepartment = (department) => {
  if (!department || department.trim() === "") {
    return {
      isValid: false,
      message: "Department is required.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// ======================================================
// DESIGNATION VALIDATION
// ======================================================

const validateDesignation = (designation) => {
  if (!designation || designation.trim() === "") {
    return {
      isValid: false,
      message: "Designation is required.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// ======================================================
// PHONE VALIDATION
// ======================================================

const validatePhoneNumber = (phone) => {
  if (!phone || phone === "") {
    return {
      isValid: false,
      message: "Phone number is required.",
    };
  }

  if (phone !== phone.trim()) {
    return {
      isValid: false,
      message: "Phone number must not contain spaces.",
    };
  }

  if (!/^\d{10}$/.test(phone)) {
    return {
      isValid: false,
      message: "Phone number must contain exactly 10 digits.",
    };
  }

  if (phone[0] === "0") {
    return {
      isValid: false,
      message: "Indian mobile number cannot start with 0.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// ======================================================
// SAMPLE EMPLOYEE DATA
// ======================================================

const EMPLOYEE_DATA = {
  "260819001": {
    id: "260819001",
    name: "Emp1",
    email: "260819001@gmail.com",
    department: "IT",
    designation: "Developer",
    phone: "9876543210",
  },

  "260819002": {
    id: "260819002",
    name: "Emp2",
    email: "260819002@gmail.com",
    department: "HR",
    designation: "Manager",
    phone: "9876543211",
  },

  "260819003": {
    id: "260819003",
    name: "Emp3",
    email: "260819003@gmail.com",
    department: "Finance",
    designation: "Accountant",
    phone: "9876543212",
  },
};

// ======================================================
// DEPARTMENTS
// ======================================================

const DEPARTMENTS = [
  "IT",
  "HR",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
  "Administration",
];

// ======================================================
// DESIGNATIONS
// ======================================================

const DESIGNATIONS = [
  "Developer",
  "Manager",
  "Accountant",
  "Analyst",
  "Executive",
  "Assistant",
  "Lead",
  "Director",
];

// ======================================================
// MAIN COMPONENT
// ======================================================

const UpdateEmployee = ({
  username = "username",
  onLogout,
  onBack,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearchValid, setIsSearchValid] = useState(true);
  const [isSearchTouched, setIsSearchTouched] = useState(false);

  const [employee, setEmployee] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    department: "",
    designation: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // ====================================================
  // SEARCH INPUT
  // ====================================================

  const handleSearchChange = (e) => {
    // ONLY NUMBERS
    // MAXIMUM 9 DIGITS
    const onlyNumbers = e.target.value
      .replace(/\D/g, "")
      .slice(0, 9);

    setSearchInput(onlyNumbers);
    setIsSearchTouched(false);
    setSearchError("");
    setEmployee(null);
    setUpdateSuccess(false);

    if (onlyNumbers === "") {
      setIsSearchValid(true);
      return;
    }

    if (onlyNumbers.length < 9) {
      setIsSearchValid(false);
      setSearchError(
        "Employee ID must contain exactly 9 digits (YYMMDD001)."
      );
      return;
    }

    const result = validateEmployeeId(onlyNumbers);

    setIsSearchValid(result.isValid);

    if (!result.isValid) {
      setSearchError(result.message);
    }
  };

  // ====================================================
  // SEARCH EMPLOYEE
  // ====================================================

  const handleSearch = () => {
    setIsSearchTouched(true);
    setSearchError("");
    setUpdateSuccess(false);

    if (searchInput === "") {
      setSearchError("Employee ID is required.");
      setIsSearchValid(false);
      setEmployee(null);
      return;
    }

    const validationResult = validateEmployeeId(searchInput);

    if (!validationResult.isValid) {
      setSearchError(validationResult.message);
      setIsSearchValid(false);
      setEmployee(null);
      return;
    }

    const employeeId = searchInput;

    // ==================================================
    // FUTURE DATE CHECK
    // ==================================================

    const year = Number(employeeId.substring(0, 2));
    const month = Number(employeeId.substring(2, 4));
    const day = Number(employeeId.substring(4, 6));

    const employeeDate = new Date(
      2000 + year,
      month - 1,
      day
    );

    employeeDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (employeeDate > today) {
      setSearchError(
        `Employee ID "${employeeId}" was not found in the system.`
      );
      setIsSearchValid(false);
      setEmployee(null);
      return;
    }

    // ==================================================
    // FIND EXISTING EMPLOYEE
    // ==================================================

    let foundEmployee = EMPLOYEE_DATA[employeeId];

    // ==================================================
    // PAST / CURRENT DATE EMPLOYEE
    // ==================================================

    if (!foundEmployee) {
      const employeeNumber = Number(
        employeeId.substring(6, 9)
      );

      const departments = [
        "IT",
        "HR",
        "Finance",
        "Marketing",
        "Sales",
        "Operations",
        "Administration",
      ];

      const designations = [
        "Developer",
        "Manager",
        "Accountant",
        "Analyst",
        "Executive",
        "Assistant",
        "Lead",
        "Director",
      ];

      const department =
        departments[
          (employeeNumber - 1) % departments.length
        ];

      const designation =
        designations[
          (employeeNumber - 1) % designations.length
        ];

      const phoneNumber = String(
        9000000000 + employeeNumber
      );

      foundEmployee = {
        id: employeeId,
        name: `Emp${employeeNumber}`,
        email: `${employeeId}@gmail.com`,
        department: department,
        designation: designation,
        phone: phoneNumber,
      };

      EMPLOYEE_DATA[employeeId] = foundEmployee;
    }

    // ==================================================
    // SHOW EMPLOYEE
    // ==================================================

    setEmployee(foundEmployee);

    setFormData({
      id: foundEmployee.id,
      name: foundEmployee.name,
      email: foundEmployee.email,
      department: foundEmployee.department,
      designation: foundEmployee.designation,
      phone: foundEmployee.phone,
    });

    setFormErrors({});
    setUpdateSuccess(false);
    setSearchError("");
    setIsSearchValid(true);
  };

  // ====================================================
  // ENTER KEY SEARCH
  // ====================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // ====================================================
  // FORM CHANGE
  // ====================================================

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setUpdateSuccess(false);
  };

  // ====================================================
  // VALIDATE COMPLETE FORM
  // ====================================================

  const validateForm = () => {
    const errors = {};

    const idResult = validateEmployeeId(formData.id);

    if (!idResult.isValid) {
      errors.id = idResult.message;
    }

    const nameResult = validateEmployeeName(formData.name);

    if (!nameResult.isValid) {
      errors.name = nameResult.message;
    }

    const emailResult = validateEmail(
      formData.email,
      formData.id
    );

    if (!emailResult.isValid) {
      errors.email = emailResult.message;
    }

    const departmentResult = validateDepartment(
      formData.department
    );

    if (!departmentResult.isValid) {
      errors.department = departmentResult.message;
    }

    const designationResult = validateDesignation(
      formData.designation
    );

    if (!designationResult.isValid) {
      errors.designation = designationResult.message;
    }

    const phoneResult = validatePhoneNumber(
      formData.phone
    );

    if (!phoneResult.isValid) {
      errors.phone = phoneResult.message;
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // ====================================================
  // UPDATE EMPLOYEE
  // ====================================================

  const handleUpdate = () => {
    const isValid = validateForm();

    if (!isValid) {
      setUpdateSuccess(false);
      return;
    }

    EMPLOYEE_DATA[formData.id] = {
      ...formData,
    };

    setEmployee({
      ...formData,
    });

    setUpdateSuccess(true);

    alert(
      `✅ Employee ${formData.id} updated successfully!`
    );
  };

  // ====================================================
  // CANCEL
  // ====================================================

  const handleCancel = () => {
    if (!employee) {
      return;
    }

    setFormData({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      department: employee.department,
      designation: employee.designation,
      phone: employee.phone,
    });

    setFormErrors({});
    setUpdateSuccess(false);
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="update-page">

      {/* NAVBAR */}
      <header className="update-header">
        <div className="logo-section">
          <h1>ITAMS</h1>
          <p>IT Asset Management System</p>
        </div>

        <div className="user-section">
          <span>{username}</span>

          <span className="divider">|</span>

          <button
            className="logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <div className="update-container">

        <h1>Update Employee Details</h1>

        <p>
          Search and update employee information.
        </p>

        {/* SEARCH CARD */}
        <div className="search-card">

          <h2>Search Employee</h2>

          <div className="search-row">

            <input
              className={`search-input ${
                !isSearchValid && isSearchTouched
                  ? "input-error"
                  : ""
              }`}
              type="text"
              inputMode="numeric"
              maxLength={9}
              autoComplete="off"
              placeholder="Enter Employee ID (e.g., 260819001)"
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onPaste={(e) => {
                e.preventDefault();

                const pastedText =
                  e.clipboardData.getData("text");

                const onlyNumbers = pastedText
                  .replace(/\D/g, "")
                  .slice(0, 9);

                setSearchInput(onlyNumbers);
                setIsSearchTouched(false);
                setSearchError("");
                setEmployee(null);
                setUpdateSuccess(false);

                if (onlyNumbers === "") {
                  setIsSearchValid(true);
                  return;
                }

                if (onlyNumbers.length < 9) {
                  setIsSearchValid(false);
                  setSearchError(
                    "Employee ID must contain exactly 9 digits (YYMMDD001)."
                  );
                  return;
                }

                const result =
                  validateEmployeeId(onlyNumbers);

                setIsSearchValid(result.isValid);

                if (!result.isValid) {
                  setSearchError(result.message);
                }
              }}
            />

            <button
              className="search-btn"
              onClick={handleSearch}
            >
              Search
            </button>

          </div>

          {searchError && isSearchTouched && (
            <div className="search-error">
              ⚠️ {searchError}
            </div>
          )}

          <div className="search-hint">
            <small>
              Format: YYMMDD001 (e.g., 260819001)
            </small>
          </div>

        </div>

        {/* EMPLOYEE DETAILS */}
        <div className="employee-card">

          <h2>Employee Details</h2>

          {employee ? (

            <div className="employee-form">

              <div className="form-grid">

                {/* EMPLOYEE ID */}
                <div className="form-group">

                  <label>
                    Employee ID (Read Only)
                  </label>

                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    readOnly
                    className="readonly-input"
                  />

                  {formErrors.id && (
                    <span className="field-error">
                      {formErrors.id}
                    </span>
                  )}

                </div>

                {/* EMPLOYEE NAME */}
                <div className="form-group">

                  <label>
                    Employee Name *
                  </label>

                  <input
                    className={
                      formErrors.name
                        ? "input-error"
                        : ""
                    }
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter employee name"
                  />

                  {formErrors.name && (
                    <span className="field-error">
                      {formErrors.name}
                    </span>
                  )}

                </div>

                {/* EMAIL */}
                <div className="form-group">

                  <label>
                    Email *
                  </label>

                  <input
                    className={
                      formErrors.email
                        ? "input-error"
                        : ""
                    }
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="YYMMDD001@gmail.com"
                  />

                  {formErrors.email && (
                    <span className="field-error">
                      {formErrors.email}
                    </span>
                  )}

                </div>

                {/* DEPARTMENT */}
                <div className="form-group">

                  <label>
                    Department *
                  </label>

                  <select
                    className={
                      formErrors.department
                        ? "input-error"
                        : ""
                    }
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                  >

                    <option value="">
                      Select Department
                    </option>

                    {DEPARTMENTS.map((department) => (
                      <option
                        key={department}
                        value={department}
                      >
                        {department}
                      </option>
                    ))}

                  </select>

                  {formErrors.department && (
                    <span className="field-error">
                      {formErrors.department}
                    </span>
                  )}

                </div>

                {/* DESIGNATION */}
                <div className="form-group">

                  <label>
                    Designation *
                  </label>

                  <select
                    className={
                      formErrors.designation
                        ? "input-error"
                        : ""
                    }
                    name="designation"
                    value={formData.designation}
                    onChange={handleFormChange}
                  >

                    <option value="">
                      Select Designation
                    </option>

                    {DESIGNATIONS.map((designation) => (
                      <option
                        key={designation}
                        value={designation}
                      >
                        {designation}
                      </option>
                    ))}

                  </select>

                  {formErrors.designation && (
                    <span className="field-error">
                      {formErrors.designation}
                    </span>
                  )}

                </div>

                {/* PHONE */}
                <div className="form-group">

                  <label>
                    Phone Number *
                  </label>

                  <div className="phone-wrapper">

                    <span className="country-code">
                      +91
                    </span>

                    <input
                      className={
                        formErrors.phone
                          ? "input-error"
                          : ""
                      }
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        const onlyNumbers =
                          e.target.value.replace(/\D/g, "");

                        handleFormChange({
                          target: {
                            name: "phone",
                            value: onlyNumbers.slice(0, 10),
                          },
                        });
                      }}
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                    />

                  </div>

                  {formErrors.phone && (
                    <span className="field-error">
                      {formErrors.phone}
                    </span>
                  )}

                </div>

              </div>

              {/* SUCCESS */}
              {updateSuccess && (
                <div className="success-message">
                  ✅ Employee details updated successfully!
                </div>
              )}

              {/* BUTTONS */}
              <div className="button-group">

                <button
                  className="update-btn"
                  onClick={handleUpdate}
                >
                  Update Details
                </button>

                <button
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

              </div>

            </div>

          ) : (

            <div className="no-employee-message">

              <p>
                🔍 Search for an employee to view and
                update details.
              </p>

            </div>

          )}

        </div>

        {/* BACK */}
        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>
    </div>
  );
};

export default UpdateEmployee;
