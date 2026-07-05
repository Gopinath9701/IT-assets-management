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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmployee({
      ...employee,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Employee Added Successfully!");
    console.log(employee);
  };

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
  };

  return (
    <div className="add-employee-page">

      {/* Header */}
      <header className="employee-header">
        <div className="logo-section">
          <h1>ITAMS</h1>
          <p>IT Asset Management System</p>
        </div>

        <div className="user-section">
          <span>username</span>
          <span className="divider">|</span>
          <button className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Body */}
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

            <div className="form-group">
              <label>Employee Name</label>

              <input
                type="text"
                name="employeeName"
                placeholder="Enter full name"
                value={employee.employeeName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Employee ID</label>

              <input
                type="text"
                name="employeeId"
                placeholder="Enter employee ID"
                value={employee.employeeId}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={employee.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Department</label>

              <select
  name="department"
  value={employee.department}
  onChange={handleChange}
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
            </div>

            <div className="form-group">
              <label>Designation</label>

              <input
                type="text"
                name="designation"
                placeholder="Enter designation"
                value={employee.designation}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={employee.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Date of Joining</label>

              <input
                type="date"
                name="joiningDate"
                value={employee.joiningDate}
                onChange={handleChange}
              />
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