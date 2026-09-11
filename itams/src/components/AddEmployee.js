import React, { useState, useEffect } from "react";
import "./AddEmployee.css";

// Designations are scoped per department - a Finance employee shouldn't
// be offered "Software Developer", an IT employee shouldn't be offered
// "Accountant", etc. Keep this in sync with the identical mapping in
// UpdateEmployee.js. Departments themselves come from the real
// departments table (see the useEffect below) so a department added via
// Department Management shows up here immediately; any department not
// covered by this curated map falls back to GENERIC_DESIGNATIONS.
const DESIGNATIONS_BY_DEPARTMENT = {
  IT: [
    "Software Developer",
    "Senior Developer",
    "System Administrator",
    "QA Engineer",
    "DevOps Engineer",
    "Technical Lead",
    "IT Manager",
  ],
  HR: [
    "HR Executive",
    "Recruiter",
    "HR Generalist",
    "Talent Acquisition Specialist",
    "HR Manager",
  ],
  Finance: [
    "Accountant",
    "Financial Analyst",
    "Accounts Executive",
    "Auditor",
    "Finance Manager",
  ],
  Marketing: [
    "Marketing Executive",
    "Content Strategist",
    "SEO Specialist",
    "Brand Manager",
    "Marketing Manager",
  ],
  Sales: [
    "Sales Executive",
    "Account Executive",
    "Business Development Executive",
    "Sales Manager",
  ],
  Operations: [
    "Operations Executive",
    "Logistics Coordinator",
    "Process Analyst",
    "Operations Manager",
  ],
  "Software Development": [
    "Software Developer",
    "Senior Developer",
    "Backend Developer",
    "Frontend Developer",
    "Full Stack Developer",
    "Software Development Manager",
  ],
};

const GENERIC_DESIGNATIONS = [
  "Executive",
  "Senior Executive",
  "Team Lead",
  "Manager",
];

const AddEmployee = ({ username = "username", onLogout, onBack }) => {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [departments, setDepartments] = useState([]);

  const [errors, setErrors] = useState({});

  // Departments are fetched live from the departments table (managed via
  // Department Management) instead of a hardcoded list, so adding/removing
  // a department there is immediately reflected in this dropdown.
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/departments", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDepartments(data.departments.map((d) => d.name));
        }
      })
      .catch(() => {});
  }, []);

  // =========================================================
  // DATE HELPERS
  // =========================================================

  const getToday = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getPreviousSevenDays = () => {
    const date = getToday();
    date.setDate(date.getDate() - 7);
    return date;
  };

  const getDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =========================================================
  // EMPLOYEE NAME VALIDATION
  // =========================================================

  const validateEmployeeName = (value) => {
    if (!value || value.length === 0) {
      return "Employee Name is required.";
    }

    if (value.startsWith(" ")) {
      return "Employee Name cannot start with a space.";
    }

    if (value.endsWith(" ")) {
      return "Employee Name cannot end with a space.";
    }

    if (value.trim().length < 4) {
      return "Employee Name must contain at least 4 characters.";
    }

    if (/ {2,}/.test(value)) {
      return "Only a single space is allowed between words.";
    }

    if (!/^[A-Za-z ]+$/.test(value)) {
      return "Employee Name can contain only letters and spaces.";
    }

    return "";
  };

  // Employee ID and Email are NOT user input - the backend generates both
  // server-side (employeeController.js never reads either field from the
  // request body) and returns the real values in the response. There's
  // nothing to validate here because there's nothing for the user to type.

  // =========================================================
  // DEPARTMENT VALIDATION
  // =========================================================

  const validateDepartment = (value) => {
    if (!value) {
      return "Please select Department.";
    }

    return "";
  };

  // =========================================================
  // DESIGNATION VALIDATION
  // =========================================================

  const validateDesignation = (value, dept) => {
    if (!dept) {
      return "Select Department before selecting Designation.";
    }

    if (!value) {
      return "Designation is required.";
    }

    const validDesignations = DESIGNATIONS_BY_DEPARTMENT[dept] || GENERIC_DESIGNATIONS;

    if (!validDesignations.includes(value)) {
      return "Please select a valid Designation for this Department.";
    }

    return "";
  };

  // =========================================================
  // PHONE VALIDATION
  // =========================================================

  const validatePhone = (value) => {
    if (!value) {
      return "Phone Number is required.";
    }

    if (!/^\d+$/.test(value)) {
      return "Phone Number must contain only digits.";
    }

    if (value.length !== 10) {
      return "Phone Number must contain exactly 10 digits.";
    }

    if (!/^[6-9]\d{9}$/.test(value)) {
      return "Enter a valid 10-digit Indian mobile number.";
    }

    return "";
  };

  // =========================================================
  // DATE OF JOINING VALIDATION
  // =========================================================

  const validateJoiningDate = (value) => {
    if (!value) {
      return "Date of Joining is required.";
    }

    const selectedDate = new Date(`${value}T00:00:00`);

    if (Number.isNaN(selectedDate.getTime())) {
      return "Please enter a valid Date of Joining.";
    }

    const today = getToday();
    const sevenDaysAgo = getPreviousSevenDays();

    if (selectedDate > today) {
      return "Date of Joining cannot be a future date.";
    }

    if (selectedDate < sevenDaysAgo) {
      return "Date of Joining can only be today or within the previous 7 days.";
    }

    return "";
  };

  // =========================================================
  // FULL FORM VALIDATION
  // =========================================================

  const validateForm = () => {
    const newErrors = {};

    const nameError = validateEmployeeName(employeeName);
    if (nameError) {
      newErrors.employeeName = nameError;
    }

    const dateError = validateJoiningDate(dateOfJoining);
    if (dateError) {
      newErrors.dateOfJoining = dateError;
    }

    const departmentError = validateDepartment(department);
    if (departmentError) {
      newErrors.department = departmentError;
    }

    const designationError = validateDesignation(designation, department);
    if (designationError) {
      newErrors.designation = designationError;
    }

    const phoneError = validatePhone(phone);
    if (phoneError) {
      newErrors.phone = phoneError;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================================================
  // FIELD CHANGE HANDLERS
  // =========================================================

  const handleNameChange = (e) => {
    // collapse multiple spaces into a single space
    const value = e.target.value.replace(/ {2,}/g, " ");

    setEmployeeName(value);

    setErrors((prev) => ({
      ...prev,
      employeeName: validateEmployeeName(value),
    }));
  };

  // No handleEmployeeIdChange / handleEmailChange - both fields are
  // read-only, populated from the backend's response after a successful
  // submit (see handleSubmit).

  const handleDepartmentChange = (e) => {
    const value = e.target.value;

    setDepartment(value);

    // The previously-selected designation almost certainly isn't valid for
    // the new department (e.g. "Accountant" was fine under Finance but not
    // under IT) - clear it rather than silently keep an invalid pairing.
    setDesignation("");

    setErrors((prev) => ({
      ...prev,
      department: validateDepartment(value),
      designation: "",
    }));
  };

  const handleDesignationChange = (e) => {
    const value = e.target.value;

    setDesignation(value);

    setErrors((prev) => ({
      ...prev,
      designation: validateDesignation(value, department),
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    const limitedValue = value.substring(0, 10);

    setPhone(limitedValue);

    setErrors((prev) => ({
      ...prev,
      phone: limitedValue
        ? validatePhone(limitedValue)
        : "Phone Number is required.",
    }));
  };

  const handleDateChange = (e) => {
    const value = e.target.value;

    setDateOfJoining(value);

    const dateError = validateJoiningDate(value);

    setErrors((prev) => ({
      ...prev,
      dateOfJoining: dateError,
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/employees",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            // No employeeId/email here - the backend never reads either
            // from the request, it generates both itself.
            employeeName,
            department,
            designation,
            phone: `+91${phone}`,
            joiningDate: dateOfJoining,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add employee.");
        return;
      }

      alert(
        `✅ Employee added successfully! Employee ID: ${data.employeeId} | Email: ${data.email}`
      );

      setEmployeeName("");
      setEmployeeId("");
      setEmail("");
      setDepartment("");
      setDesignation("");
      setPhone("");
      setDateOfJoining("");
      setErrors({});
    } catch (error) {
      console.error("Add Employee Error:", error);

      alert(
        "Unable to connect to server. Please make sure the backend is running."
      );
    }
  };

  // =========================================================
  // CANCEL
  // =========================================================

  const handleCancel = () => {
    setEmployeeName("");
    setEmployeeId("");
    setEmail("");
    setDepartment("");
    setDesignation("");
    setPhone("");
    setDateOfJoining("");
    setErrors({});
  };

  // =========================================================
  // DATE LIMITS
  // =========================================================

  const todayString = getDateString(getToday());
  const minDateString = getDateString(getPreviousSevenDays());

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="add-employee-page">

      {/* HEADER */}
      <header className="employee-header">

        <div className="logo-section">

          <div className="logo">
            ITAMS
          </div>

          <div className="logo-subtitle">
            IT Asset Management System
          </div>

        </div>

        <div className="user-section">

          <span>
            {username}
          </span>

          <span className="divider">
            |
          </span>

          <button
            type="button"
            className="logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* MAIN */}
      <main className="employee-container">

        <h1>
          Add Employee
        </h1>

        <p className="subtitle">
          Fill in the employee details below.
        </p>

        <div className="employee-card">

          <h2>
            Employee Information
          </h2>

          <hr />

          <form
            onSubmit={handleSubmit}
            noValidate
          >

            <div className="form-grid">

              {/* =================================================
                  ROW 1 - EMPLOYEE NAME
              ================================================= */}

              <div className="form-group employee-name-field">

                <label>
                  Employee Name *
                </label>

                <input
                  type="text"
                  placeholder="Enter full name"
                  value={employeeName}
                  onChange={handleNameChange}
                  className={
                    errors.employeeName
                      ? "input-error"
                      : ""
                  }
                />

                {errors.employeeName && (
                  <div className="error">
                    {errors.employeeName}
                  </div>
                )}

              </div>


              {/* =================================================
                  ROW 1 - DATE OF JOINING
              ================================================= */}

              <div className="form-group date-field">

                <label>
                  Date of Joining *
                </label>

                <input
                  type="date"
                  value={dateOfJoining}
                  onChange={handleDateChange}
                  min={minDateString}
                  max={todayString}
                  className={
                    errors.dateOfJoining
                      ? "input-error"
                      : ""
                  }
                />

                {errors.dateOfJoining && (
                  <div className="error">
                    {errors.dateOfJoining}
                  </div>
                )}

              </div>


              {/* =================================================
                  ROW 2 - EMPLOYEE ID
              ================================================= */}

              <div className="form-group employee-id-field">

                <label>
                  Employee ID (Automatically Generated)
                </label>

                <input
                  type="text"
                  placeholder="Assigned automatically after you submit"
                  value={employeeId}
                  readOnly
                />

              </div>


              {/* =================================================
                  ROW 2 - EMAIL
              ================================================= */}

              <div className="form-group email-field">

                <label>
                  Email (Automatically Generated)
                </label>

                <input
                  type="email"
                  placeholder="Assigned automatically after you submit"
                  value={email}
                  readOnly
                />

              </div>


              {/* =================================================
                  ROW 2 - PHONE
              ================================================= */}

              <div className="form-group phone-field">

                <label>
                  Phone Number *
                </label>

                <div
                  style={{
                    position: "relative",
                    width: "100%",
                  }}
                >

                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "16px",
                      color: "#1f2937",
                      zIndex: 1,
                      pointerEvents: "none",
                    }}
                  >
                    +91
                  </span>

                  <input
                    type="text"
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={10}
                    inputMode="numeric"
                    style={{
                      paddingLeft: "50px",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                    className={
                      errors.phone
                        ? "input-error"
                        : ""
                    }
                  />

                </div>

                {errors.phone && (
                  <div className="error">
                    {errors.phone}
                  </div>
                )}

              </div>


              {/* =================================================
                  ROW 3 - DEPARTMENT
              ================================================= */}

              <div className="form-group department-field">

                <label>
                  Department *
                </label>

                <select
                  value={department}
                  onChange={handleDepartmentChange}
                  className={
                    errors.department
                      ? "input-error"
                      : ""
                  }
                >

                  <option value="">
                    Select Department
                  </option>

                  {departments.map((dept) => (
                    <option
                      key={dept}
                      value={dept}
                    >
                      {dept}
                    </option>
                  ))}

                </select>

                {errors.department && (
                  <div className="error">
                    {errors.department}
                  </div>
                )}

              </div>


              {/* =================================================
                  ROW 3 - DESIGNATION
              ================================================= */}

              <div className="form-group designation-field">

                <label>
                  Designation *
                </label>

                <select
                  value={designation}
                  onChange={handleDesignationChange}
                  disabled={!department}
                  className={
                    errors.designation
                      ? "input-error"
                      : ""
                  }
                >

                  <option value="">
                    {department
                      ? "Select Designation"
                      : "Select Department first"}
                  </option>

                  {(DESIGNATIONS_BY_DEPARTMENT[department] || GENERIC_DESIGNATIONS).map(
                    (title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    )
                  )}

                </select>

                {errors.designation && (
                  <div className="error">
                    {errors.designation}
                  </div>
                )}

              </div>

            </div>


            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="button-group">

              <button
                type="submit"
                className="save-btn"
              >
                Save Employee
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>


        {/* BACK */}

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="back-btn"
          >
            ← Back
          </button>
        )}

      </main>

    </div>
  );
};

export default AddEmployee;
