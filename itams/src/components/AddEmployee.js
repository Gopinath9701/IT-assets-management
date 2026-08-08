import React, { useState } from "react";
import "./AddEmployee.css";

const AddEmployee = () => {

  const [employee, setEmployee] = useState({
    employeeName: "",
    employeeId: "",
    email: "",
    department: "",
    designation: "",
    phone: "",
    joiningDate: "",
  });

  const [errors, setErrors] = useState({});

  // ==========================
  // Regular Expressions
  // ==========================

  const nameRegex = /^[A-Za-z ]+$/;
  const empIdRegex = /^EMP\d{3}$/;
  const emailRegex = /^[A-Za-z0-9._%+-]{3,}@itams\.com$/;
  const designationRegex = /^[A-Za-z ]+$/;

  // Updated to match Selenium Test
  const phoneRegex = /^[6-9]\d{9}$/;

  // ==========================
  // Handle Change
  // ==========================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ==========================
  // Validation
  // ==========================

  const validateForm = () => {

    let newErrors = {};

    // ----------------------------
    // Employee Name
    // ----------------------------

    if (!employee.employeeName.trim()) {

      newErrors.employeeName =
        "Employee Name is required.";

    }

    else if (employee.employeeName.trim().length < 4) {

      newErrors.employeeName =
        "Employee Name must contain at least 4 characters.";

    }

    else if (employee.employeeName.trim().length > 20) {

      newErrors.employeeName =
        "Employee Name cannot exceed 20 characters.";

    }

    else if (!nameRegex.test(employee.employeeName)) {

      newErrors.employeeName =
        "Only alphabets and spaces are allowed.";

    }

    // ----------------------------
    // Employee ID
    // ----------------------------

    if (!employee.employeeId.trim()) {

      newErrors.employeeId =
        "Employee ID is required.";

    }

    else if (employee.employeeId.includes(" ")) {

      newErrors.employeeId =
        "Spaces are not allowed.";

    }

    else if (employee.employeeId.length !== 6) {

      newErrors.employeeId =
        "Employee ID must be exactly 6 characters.";

    }

    else if (!employee.employeeId.startsWith("EMP")) {

      newErrors.employeeId =
        "Employee ID must start with EMP.";

    }

    else if (!empIdRegex.test(employee.employeeId)) {

      newErrors.employeeId =
        "Employee ID must be EMP followed by 3 digits.";

    }

    // ----------------------------
    // Email
    // ----------------------------

    if (!employee.email.trim()) {

      newErrors.email =
        "Email is required.";

    }

    else if (employee.email.includes(" ")) {

      newErrors.email =
        "Spaces are not allowed.";

    }

    else if (employee.email.length > 60) {

      newErrors.email =
        "Email is too long.";

    }

    else if (!employee.email.endsWith("@itams.com")) {

      newErrors.email =
        "Email must end with @itams.com.";

    }

    else if (!emailRegex.test(employee.email)) {

      newErrors.email =
        "Please enter a valid Gmail address.";

    }

    // ----------------------------
    // Department
    // ----------------------------

    if (!employee.department) {

      newErrors.department =
        "Please select Department.";

    }

    // ----------------------------
    // Designation
    // ----------------------------

    if (!employee.designation.trim()) {

      newErrors.designation =
        "Designation is required.";

    }

    else if (employee.designation.trim().length < 4) {

      newErrors.designation =
        "Designation must contain at least 4 characters.";

    }

    else if (employee.designation.trim().length > 20) {

      newErrors.designation =
        "Designation cannot exceed 20 characters.";

    }

    else if (!designationRegex.test(employee.designation)) {

      newErrors.designation =
        "Only alphabets and spaces are allowed.";

    }

    // ----------------------------
    // Phone
    // ----------------------------

    if (!employee.phone.trim()) {

      newErrors.phone =
        "Phone Number is required.";

    }

    else if (employee.phone.includes(" ")) {

      newErrors.phone =
        "Spaces are not allowed.";

    }

    else if (!phoneRegex.test(employee.phone)) {

      newErrors.phone =
        "Enter a valid 10-digit mobile number.";

    }

    // ----------------------------
    // Joining Date
    // ----------------------------

    if (!employee.joiningDate) {

      newErrors.joiningDate =
        "Date of Joining is required.";

    }

    else {

      const today = new Date();
      today.setHours(0,0,0,0);

      const joiningDate =
        new Date(employee.joiningDate);

      joiningDate.setHours(0,0,0,0);

      const companyStartDate =
        new Date("2000-01-01");

      if (joiningDate > today) {

        newErrors.joiningDate =
          "Date of Joining cannot be a future date.";

      }

      else if (joiningDate < companyStartDate) {

        newErrors.joiningDate =
          "Please enter a valid Date of Joining.";

      }

    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };
    // ==========================
  // Handle Submit
  // ==========================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    alert("Employee Added Successfully!");

    console.log(employee);

    setEmployee({
      employeeName: "",
      employeeId: "",
      email: "",
      department: "",
      designation: "",
      phone: "",
      joiningDate: "",
    });

    setErrors({});
  };

  // ==========================
  // Handle Cancel
  // ==========================

  const handleCancel = () => {
    setEmployee({
      employeeName: "",
      employeeId: "",
      email: "",
      department: "",
      designation: "",
      phone: "",
      joiningDate: "",
    });

    setErrors({});
  };

  return (
    <div className="add-employee-page">

      <header className="employee-header">

        <div className="logo-section">
          <h1>ITAMS</h1>
          <p>IT Asset Management System</p>
        </div>

        <div className="user-section">
          <span>username</span>
          <span className="divider">|</span>

          <button className="logout-btn">
            Logout
          </button>
        </div>

      </header>

      <div className="employee-container">

        <h1>Add Employee</h1>

        <p className="subtitle">
          Fill in the employee details below.
        </p>

        <form
          className="employee-card"
          onSubmit={handleSubmit}
        >

          <h2>Employee Information</h2>

          <div className="form-grid">

            {/* Employee Name */}

            <div className="form-group">

              <label>Employee Name</label>

              <input
                type="text"
                name="employeeName"
                placeholder="Enter full name"
                value={employee.employeeName}
                onChange={handleChange}
                className={errors.employeeName ? "input-error" : ""}
              />

              {errors.employeeName && (
                <span className="error">
                  {errors.employeeName}
                </span>
              )}

            </div>

            {/* Employee ID */}

            <div className="form-group">

              <label>Employee ID</label>

              <input
                type="text"
                name="employeeId"
                placeholder="Enter employee ID"
                value={employee.employeeId}
                onChange={handleChange}
                className={errors.employeeId ? "input-error" : ""}
              />

              {errors.employeeId && (
                <span className="error">
                  {errors.employeeId}
                </span>
              )}

            </div>

            {/* Email */}

            <div className="form-group">

              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={employee.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
              />

              {errors.email && (
                <span className="error">
                  {errors.email}
                </span>
              )}

            </div>

            {/* Department */}

            <div className="form-group">

              <label>Department</label>

              <select
                name="department"
                value={employee.department}
                onChange={handleChange}
                className={errors.department ? "input-error" : ""}
              >
                <option value="">Select Department</option>
                <option value="HR">HR</option>
                <option value="Asset Manager">Asset Manager</option>
                <option value="Inventory">Inventory</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Administration">Administration</option>
              </select>

              {errors.department && (
                <span className="error">
                  {errors.department}
                </span>
              )}

            </div>

            {/* Designation */}

            <div className="form-group">

              <label>Designation</label>

              <input
                type="text"
                name="designation"
                placeholder="Enter designation"
                value={employee.designation}
                onChange={handleChange}
                className={errors.designation ? "input-error" : ""}
              />

              {errors.designation && (
                <span className="error">
                  {errors.designation}
                </span>
              )}

            </div>

            {/* Phone */}

            <div className="form-group">

              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={employee.phone}
                onChange={handleChange}
                maxLength={10}
                className={errors.phone ? "input-error" : ""}
              />

              {errors.phone && (
                <span className="error">
                  {errors.phone}
                </span>
              )}

            </div>

            {/* Date of Joining */}

            <div className="form-group">

              <label>Date of Joining</label>

              <input
                type="date"
                name="joiningDate"
                value={employee.joiningDate}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className={errors.joiningDate ? "input-error" : ""}
              />

              {errors.joiningDate && (
                <span className="error">
                  {errors.joiningDate}
                </span>
              )}

            </div>

          </div>

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
    </div>
  );
};

export default AddEmployee;
