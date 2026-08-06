import React, { useState } from "react";
import "./UpdateEmployee.css";

const UpdateEmployee = ({
  username = "username",
  onLogout,
  onBack,
}) => {

  // ===========================
  // Search
  // ===========================

  const [search, setSearch] = useState("");

  const [searchError, setSearchError] = useState("");

  // ===========================
  // Employee Data
  // ===========================

  const [employee, setEmployee] = useState({
    employeeId: "",
    employeeName: "",
    email: "",
    department: "",
    designation: "",
    phone: "",
    joiningDate: "",
  });

  // ===========================
  // Error State
  // ===========================

  const [errors, setErrors] = useState({});

  // ===========================
  // Regular Expressions
  // ===========================

  const empIdRegex = /^EMP\d{3}$/;

  const nameRegex = /^[A-Za-z ]+$/;

  const emailRegex =
    /^[A-Za-z0-9._%+-]{3,}@gmail\.com$/;

  const designationRegex =
    /^[A-Za-z ]+$/;

  // Selenium compatible

  const phoneRegex =
    /^\+91[6-9]\d{9}$/;

  // ===========================
  // Handle Change
  // ===========================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setEmployee({
      ...employee,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });

  };

  // ===========================
  // Search Validation
  // ===========================

  const validateSearch = () => {

    if (!search.trim()) {

      setSearchError(
        "Please enter Employee ID or Email."
      );

      return false;

    }

    if (search.includes(" ")) {

      setSearchError(
        "Spaces are not allowed."
      );

      return false;

    }

    if (search.startsWith("EMP")) {

      if (!empIdRegex.test(search)) {

        setSearchError(
          "Please enter a valid Employee ID."
        );

        return false;

      }

    }

    else {

      if (!emailRegex.test(search)) {

        setSearchError(
          "Please enter a valid Gmail address."
        );

        return false;

      }

    }

    setSearchError("");

    return true;

  };

  // ===========================
  // Search
  // ===========================

  const handleSearch = () => {

    if (!validateSearch()) {

      return;

    }

    // Frontend dummy data

    setEmployee({

      employeeId: "EMP101",

      employeeName: "Satwika",

      email: "satwika@gmail.com",

      department: "HR",

      designation: "HR Executive",

      phone: "+919876543210",

      joiningDate: "2025-07-01",

    });

    alert(
      "Search functionality will be connected to the database later."
    );

  };
  // ===========================
// Form Validation
// ===========================

const validateForm = () => {

  let newErrors = {};

  // ===========================
  // Employee Name
  // ===========================

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
      "Employee Name should contain only alphabets and spaces.";

  }

  // ===========================
  // Email
  // ===========================

  if (!employee.email.trim()) {

    newErrors.email =
      "Email is required.";

  }

  else if (employee.email.includes(" ")) {

    newErrors.email =
      "Spaces are not allowed.";

  }

  else if (!emailRegex.test(employee.email)) {

    newErrors.email =
      "Please enter a valid Gmail address.";

  }

  // ===========================
  // Department
  // ===========================

  if (!employee.department) {

    newErrors.department =
      "Please select Department.";

  }

  // ===========================
  // Designation
  // ===========================

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
      "Designation should contain only alphabets and spaces.";

  }

  // ===========================
  // Phone Number
  // ===========================

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
      "Enter a valid Indian mobile number.";

  }

  // ===========================
  // Date of Joining
  // ===========================

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
// ===========================
// Update Employee
// ===========================

const handleUpdate = (e) => {

  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  alert("Employee Updated Successfully!");

  console.log(employee);

};

// ===========================
// Cancel
// ===========================

const handleCancel = () => {

  setEmployee({

    employeeId: "",

    employeeName: "",

    email: "",

    department: "",

    designation: "",

    phone: "",

    joiningDate: "",

  });

  setErrors({});

  setSearch("");

  setSearchError("");

  if (onBack) {
    onBack();
  }

};

// ===========================
// JSX
// ===========================

return (

<div className="update-page">

  {/* Header */}

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

  <div className="update-container">

    <h1>Update Employee Details</h1>

    <p>

      Search and update employee information.

    </p>

    {/* Search */}

    <div className="search-card">

      <h2>Search Employee</h2>

      <div className="search-row">

        <input

          type="text"

          placeholder="Employee ID or Gmail"

          value={search}

          onChange={(e) => {

            setSearch(e.target.value);

            setSearchError("");

          }}

          className={searchError ? "input-error" : ""}

        />

        <button

          type="button"

          className="search-btn"

          onClick={handleSearch}

        >

          Search

        </button>

      </div>

      {searchError && (

        <span className="error">

          {searchError}

        </span>

      )}

    </div>

    <form

      className="employee-card"

      onSubmit={handleUpdate}

    >

      <h2>Employee Details</h2>

    <div className="form-grid">
              {/* Employee ID */}

        <div className="form-group">
          <label>Employee ID</label>

          <input
            type="text"
            name="employeeId"
            value={employee.employeeId}
            readOnly
            placeholder="Employee ID"
          />
        </div>

        {/* Employee Name */}

        <div className="form-group">
          <label>Employee Name</label>

          <input
            type="text"
            name="employeeName"
            value={employee.employeeName}
            onChange={handleChange}
            placeholder="Employee Name"
            className={errors.employeeName ? "input-error" : ""}
          />

          {errors.employeeName && (
            <span className="error">{errors.employeeName}</span>
          )}
        </div>

        {/* Email */}

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
            className={errors.email ? "input-error" : ""}
          />

          {errors.email && (
            <span className="error">{errors.email}</span>
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
            <span className="error">{errors.department}</span>
          )}
        </div>

        {/* Designation */}

        <div className="form-group">
          <label>Designation</label>

          <input
            type="text"
            name="designation"
            value={employee.designation}
            onChange={handleChange}
            placeholder="Designation"
            className={errors.designation ? "input-error" : ""}
          />

          {errors.designation && (
            <span className="error">{errors.designation}</span>
          )}
        </div>

        {/* Phone */}

        <div className="form-group">
          <label>Phone Number</label>

          <input
            type="text"
            name="phone"
            value={employee.phone}
            onChange={handleChange}
            placeholder="+91xxxxxxxxxx"
            maxLength={13}
            className={errors.phone ? "input-error" : ""}
          />

          {errors.phone && (
            <span className="error">{errors.phone}</span>
          )}
        </div>

        {/* Date */}

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
            <span className="error">{errors.joiningDate}</span>
          )}
        </div>

      </div>

      <div className="button-group">

        <button
          type="submit"
          className="update-btn"
        >
          Update Employee
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

export default UpdateEmployee;
