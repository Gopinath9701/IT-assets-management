import React, { useState } from "react";
import "./DepartmentManagement.css";

// Validation function for Department Name
const validateDepartmentName = (name) => {
  if (!name || name.trim() === "") {
    return { isValid: false, message: "Department name is required" };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: "Department name must be at least 2 characters long" };
  }
  if (/[^A-Za-z0-9\s()-]/.test(name.trim())) {
    return { isValid: false, message: "Department name contains invalid characters" };
  }
  return { isValid: true, message: "" };
};

// Validation function for Department Head - Letters, spaces, and numbers ONLY
const validateDepartmentHead = (head) => {
  if (!head || head.trim() === "") {
    return { isValid: false, message: "Department head is required" };
  }
  if (head.trim().length < 2) {
    return { isValid: false, message: "Department head must be at least 2 characters long" };
  }
  if (!/^[A-Za-z0-9\s]+$/.test(head.trim())) {
    return { isValid: false, message: "Department head should only contain letters, numbers, and spaces" };
  }
  return { isValid: true, message: "" };
};

// Validation function for Employee Count
const validateEmployeeCount = (count) => {
  if (!count || count.trim() === "") {
    return { isValid: false, message: "Number of employees is required" };
  }
  const num = Number(count);
  if (isNaN(num) || !Number.isInteger(num)) {
    return { isValid: false, message: "Employee count must be a valid number" };
  }
  if (num < 0) {
    return { isValid: false, message: "Employee count cannot be negative" };
  }
  if (num > 1000) {
    return { isValid: false, message: "Employee count cannot exceed 1000" };
  }
  return { isValid: true, message: "" };
};

const DepartmentManagement = ({
  username = "username",
  onLogout,
  onBack,
}) => {

  const [search, setSearch] = useState("");
  const [searchApplied, setSearchApplied] = useState("");

  const [departmentName, setDepartmentName] = useState("");
  const [departmentHead, setDepartmentHead] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");

  const [errors, setErrors] = useState({});

  const [departments, setDepartments] = useState([
    { id: "DEP001", name: "Information Technology (IT)", head: "Head 1", employees: 25 },
    { id: "DEP002", name: "Human Resources (HR)", head: "Head 2", employees: 10 },
    { id: "DEP003", name: "Finance", head: "Head 3", employees: 15 },
    { id: "DEP004", name: "Marketing", head: "Head 4", employees: 12 },
    { id: "DEP005", name: "Sales", head: "Head 5", employees: 20 },
    { id: "DEP006", name: "Administration", head: "Head 6", employees: 18 },
  ]);

  const generateDepartmentId = () => {
    const count = departments.length + 1;
    return `DEP${String(count).padStart(3, "0")}`;
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchApplied.toLowerCase())
  );

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchApplied(search);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const nameResult = validateDepartmentName(departmentName);
    if (!nameResult.isValid) {
      newErrors.departmentName = nameResult.message;
    }

    const headResult = validateDepartmentHead(departmentHead);
    if (!headResult.isValid) {
      newErrors.departmentHead = headResult.message;
    }

    const countResult = validateEmployeeCount(employeeCount);
    if (!countResult.isValid) {
      newErrors.employeeCount = countResult.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addDepartment = () => {
    if (!validateForm()) {
      return;
    }

    const newId = generateDepartmentId();
    const newDept = {
      id: newId,
      name: departmentName.trim(),
      head: departmentHead.trim(),
      employees: parseInt(employeeCount)
    };

    setDepartments([...departments, newDept]);
    setDepartmentName("");
    setDepartmentHead("");
    setEmployeeCount("");
    setErrors({});
    alert("✅ Department added successfully!");
  };

  const handleCancel = () => {
    setDepartmentName("");
    setDepartmentHead("");
    setEmployeeCount("");
    setErrors({});
  };

  const handleFieldChange = (setter, field) => (e) => {
    setter(e.target.value);
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <div className="dm-page">

      <nav className="dm-nav">
        <div className="dm-nav-logo">
          <span className="dm-nav-title">ITAMS</span>
          <span className="dm-nav-sub">IT Asset Management System</span>
        </div>
        <div className="dm-nav-right">
          <span className="dm-nav-user">{username}</span>
          <span className="dm-nav-divider">|</span>
          <button className="dm-logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div className="dm-body">

        <h1 className="dm-page-title">Department Management</h1>
        <p className="dm-page-sub">Manage organization departments.</p>

        {/* Search Card */}
        <div className="dm-card">
          <h2 className="dm-card-title">Search Department</h2>
          <div className="dm-search-row">
            <input
              className="dm-input"
              type="text"
              placeholder="Enter Department Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <button
              className="dm-btn-primary"
              onClick={() => setSearchApplied(search)}
            >
              Search
            </button>
          </div>
        </div>

        {/* Add Department Card */}
        <div className="dm-card">
          <h2 className="dm-card-title">Add New Department</h2>
          
          <div className="dm-add-form">
            <div className="dm-form-group">
              <input
                className={`dm-input ${errors.departmentName ? "dm-input-error" : ""}`}
                type="text"
                placeholder="Department Name"
                value={departmentName}
                onChange={handleFieldChange(setDepartmentName, "departmentName")}
              />
              {errors.departmentName && (
                <span className="dm-error-text">⚠️ {errors.departmentName}</span>
              )}
            </div>

            <div className="dm-form-group">
              <input
                className={`dm-input ${errors.departmentHead ? "dm-input-error" : ""}`}
                type="text"
                placeholder="Department Head"
                value={departmentHead}
                onChange={handleFieldChange(setDepartmentHead, "departmentHead")}
              />
              {errors.departmentHead && (
                <span className="dm-error-text">⚠️ {errors.departmentHead}</span>
              )}
            </div>

            <div className="dm-form-group">
              <input
                className={`dm-input ${errors.employeeCount ? "dm-input-error" : ""}`}
                type="number"
                placeholder="Number of Employees"
                value={employeeCount}
                onChange={handleFieldChange(setEmployeeCount, "employeeCount")}
              />
              {errors.employeeCount && (
                <span className="dm-error-text">⚠️ {errors.employeeCount}</span>
              )}
            </div>

            <div className="dm-btn-row">
              <button className="dm-btn-add" onClick={addDepartment}>
                Add
              </button>
              <button className="dm-btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Department List */}
        <div className="dm-card">
          <h2 className="dm-card-title">Department List</h2>
          <div className="dm-table-wrapper">
            <table className="dm-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Department Head</th>
                  <th>Number of Employees</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept) => (
                    <tr key={dept.id}>
                      <td>{dept.name}</td>
                      <td>{dept.head}</td>
                      <td>{dept.employees}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="dm-no-data">No Department Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <button className="dm-back-btn" onClick={onBack}>Back</button>

      </div>
    </div>
  );
};

export default DepartmentManagement;
