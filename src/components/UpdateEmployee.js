import React, { useState } from "react";
import "./UpdateEmployee.css";

const UpdateEmployee = ({
  username = "username",
  onLogout,
  onBack,
}) => {

  const [search, setSearch] = useState("");

  const [employee, setEmployee] = useState({
    employeeId: "",
    employeeName: "",
    email: "",
    department: "",
    designation: "",
    phone: "",
    joiningDate: "",
  });

  const handleSearch = () => {
    alert("Search functionality will be connected to the database later.");
  };

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    alert("Employee Updated Successfully!");
  };

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

        {/* Search Card */}

        <div className="search-card">

          <h2>Search Employee</h2>

          <div className="search-row">

            <input
              type="text"
              placeholder="Enter Employee ID or Email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              className="search-btn"
              onClick={handleSearch}
            >
              Search
            </button>

          </div>

        </div>

        {/* Employee Form */}

        <form
          className="employee-card"
          onSubmit={handleUpdate}
        >

          <h2>Employee Details</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>Employee ID</label>

              <input
                type="text"
                name="employeeId"
                value={employee.employeeId}
                onChange={handleChange}
                placeholder="Employee ID"
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Employee Name</label>

              <input
                type="text"
                name="employeeName"
                value={employee.employeeName}
                onChange={handleChange}
                placeholder="Employee Name"
              />
            </div>
           <div className="form-group">
            <label>Email</label>

<input
  type="email"
  name="email"
  value={employee.email}
  onChange={handleChange}
  placeholder="Email Address"
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
    <option>HR</option>
    <option>Asset Manager</option>
    <option>Inventory</option>
    <option>IT</option>
    <option>Finance</option>
    <option>Marketing</option>
    <option>Sales</option>
    <option>Administration</option>
  </select>
</div>

<div className="form-group">
  <label>Designation</label>

  <input
    type="text"
    name="designation"
    value={employee.designation}
    onChange={handleChange}
    placeholder="Designation"
  />
</div>

<div className="form-group">
  <label>Phone Number</label>

  <input
    type="text"
    name="phone"
    value={employee.phone}
    onChange={handleChange}
    placeholder="Phone Number"
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
              className="update-btn"
            >
              Update Employee
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={onBack}
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