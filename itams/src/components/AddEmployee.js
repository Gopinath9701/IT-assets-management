import React, { useState } from "react";
import "./AddEmployee.css";

const DEPARTMENTS = [
  "IT",
  "HR",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
];

const AddEmployee = ({ username = "username", onLogout, onBack }) => {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");

  const [errors, setErrors] = useState({});

  // =========================================================
  // DATE HELPERS
  // =========================================================

  const formatDateForId = (dateValue) => {
    if (!dateValue) return "";

    const [year, month, day] = dateValue.split("-");

    return (
      year.substring(2, 4) +
      month.padStart(2, "0") +
      day.padStart(2, "0")
    );
  };

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

  // =========================================================
  // EMPLOYEE ID VALIDATION
  // =========================================================

  const validateEmployeeId = (value, joiningDate) => {
    if (!value) {
      return "Employee ID is required.";
    }

    if (/\s/.test(value)) {
      return "Employee ID cannot contain spaces.";
    }

    if (!/^\d+$/.test(value)) {
      return "Employee ID must contain only numbers.";
    }

    if (!/^\d{9}$/.test(value)) {
      return "Employee ID must contain exactly 9 digits.";
    }

    // YYMMDD + 3 digit employee number
    const employeeNumber = value.substring(6);

    if (!/^\d{3}$/.test(employeeNumber)) {
      return "Last 3 digits must be the employee number.";
    }

    if (!joiningDate) {
      return "Select Date of Joining before entering Employee ID.";
    }

    const expectedDatePart = formatDateForId(joiningDate);
    const enteredDatePart = value.substring(0, 6);

    if (enteredDatePart !== expectedDatePart) {
      return `Employee ID must start with ${expectedDatePart}, matching Date of Joining.`;
    }

    return "";
  };

  // =========================================================
  // EMAIL VALIDATION
  // =========================================================

  const validateEmail = (value, id) => {
    if (!value) {
      return "Email is required.";
    }

    if (/\s/.test(value)) {
      return "Email cannot contain spaces.";
    }

    if (!id) {
      return "Enter Employee ID before entering Email.";
    }

    // Must be exactly: employeeIDa@gmail.com
    const expectedEmail = `${id}a@gmail.com`;

    if (value !== expectedEmail) {
      return `Email must be ${expectedEmail}.`;
    }

    return "";
  };

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

  const validateDesignation = (value) => {
    if (!value || value.length === 0) {
      return "Designation is required.";
    }

    if (value.startsWith(" ")) {
      return "Designation cannot start with a space.";
    }

    if (value.endsWith(" ")) {
      return "Designation cannot end with a space.";
    }

    if (value.trim().length < 2) {
      return "Designation must contain at least 2 characters.";
    }

    if (/ {2,}/.test(value)) {
      return "Only a single space is allowed between words.";
    }

    if (!/^[A-Za-z]+( [A-Za-z]+)*$/.test(value)) {
      return "Designation can contain only letters and single spaces between words.";
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

    if (employeeId) {
      const expectedDatePart = formatDateForId(value);
      const enteredDatePart = employeeId.substring(0, 6);

      if (
        /^\d{9}$/.test(employeeId) &&
        enteredDatePart !== expectedDatePart
      ) {
        return `Date of Joining must match Employee ID (${enteredDatePart}).`;
      }
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

    const idError = validateEmployeeId(employeeId, dateOfJoining);
    if (idError) {
      newErrors.employeeId = idError;
    }

    const emailError = validateEmail(email, employeeId);
    if (emailError) {
      newErrors.email = emailError;
    }

    const departmentError = validateDepartment(department);
    if (departmentError) {
      newErrors.department = departmentError;
    }

    const designationError = validateDesignation(designation);
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

  const handleEmployeeIdChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    const limitedValue = value.substring(0, 9);

    setEmployeeId(limitedValue);

    setErrors((prev) => ({
      ...prev,
      employeeId: limitedValue
        ? validateEmployeeId(limitedValue, dateOfJoining)
        : "Employee ID is required.",
      email: email
        ? validateEmail(email, limitedValue)
        : prev.email,
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    setErrors((prev) => ({
      ...prev,
      email: validateEmail(value, employeeId),
    }));
  };

  const handleDepartmentChange = (e) => {
    const value = e.target.value;

    setDepartment(value);

    setErrors((prev) => ({
      ...prev,
      department: validateDepartment(value),
    }));
  };

  const handleDesignationChange = (e) => {
    let value = e.target.value;

    // allow only letters and spaces (blocks numbers and all symbols)
    value = value.replace(/[^A-Za-z ]/g, "");

    // collapse multiple spaces into a single space
    value = value.replace(/ {2,}/g, " ");

    setDesignation(value);

    setErrors((prev) => ({
      ...prev,
      designation: validateDesignation(value),
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
      employeeId: employeeId
        ? validateEmployeeId(employeeId, value)
        : prev.employeeId,
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
            employeeName,
            email,
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
        `✅ Employee added successfully! Employee ID: ${data.employeeId}`
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
                  Employee ID *
                </label>

                <input
                  type="text"
                  placeholder="YYMMDD001"
                  value={employeeId}
                  onChange={handleEmployeeIdChange}
                  maxLength={9}
                  inputMode="numeric"
                  className={
                    errors.employeeId
                      ? "input-error"
                      : ""
                  }
                />

                {errors.employeeId && (
                  <div className="error">
                    {errors.employeeId}
                  </div>
                )}

              </div>


              {/* =================================================
                  ROW 2 - EMAIL
              ================================================= */}

              <div className="form-group email-field">

                <label>
                  Email *
                </label>

                <input
                  type="email"
                  placeholder="YYMMDD001a@gmail.com"
                  value={email}
                  onChange={handleEmailChange}
                  className={
                    errors.email
                      ? "input-error"
                      : ""
                  }
                />

                {errors.email && (
                  <div className="error">
                    {errors.email}
                  </div>
                )}

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

                  {DEPARTMENTS.map((dept) => (
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

                <input
                  type="text"
                  placeholder="Enter designation"
                  value={designation}
                  onChange={handleDesignationChange}
                  className={
                    errors.designation
                      ? "input-error"
                      : ""
                  }
                />

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
