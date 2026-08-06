import React, { useState } from "react";
import "./DepartmentManagement.css";

const DepartmentManagement = ({
  username = "username",
  onLogout,
  onBack,
}) => {

  const [search, setSearch]               = useState("");
  const [searchApplied, setSearchApplied] = useState("");

  const [departmentName, setDepartmentName] = useState("");
  const [departmentHead, setDepartmentHead] = useState("");
  const [employeeCount, setEmployeeCount]   = useState("");

  const [departments, setDepartments] = useState([
    { id: "DEP001", name: "Information Technology (IT)", head: "Head 1", employees: 25 },
    { id: "DEP002", name: "Human Resources (HR)",        head: "Head 2", employees: 10 },
    { id: "DEP003", name: "Finance",                     head: "Head 3", employees: 15 },
    { id: "DEP004", name: "Marketing",                   head: "Head 4", employees: 12 },
    { id: "DEP005", name: "Sales",                       head: "Head 5", employees: 20 },
    { id: "DEP006", name: "Administration",              head: "Head 6", employees: 18 },
  ]);

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchApplied.toLowerCase())
  );

  const addDepartment = () => {
    if (departmentName === "" || departmentHead === "" || employeeCount === "") {
      alert("Please fill all fields.");
      return;
    }
    const newId = `DEP${String(departments.length + 1).padStart(3, "0")}`;
    setDepartments([
      ...departments,
      { id: newId, name: departmentName, head: departmentHead, employees: employeeCount },
    ]);
    setDepartmentName("");
    setDepartmentHead("");
    setEmployeeCount("");
  };

  const deleteDepartment = (id) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
  };

  return (
    <div className="dm-page">

      {/* Navbar */}
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

      {/* Body */}
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
              onKeyDown={(e) => e.key === "Enter" && setSearchApplied(search)}
            />
            <button
              className="dm-btn-primary"
              onClick={() => setSearchApplied(search)}
            >
              Search
            </button>
          </div>
        </div>

        {/* Add + List Card */}
        <div className="dm-card">
          <h2 className="dm-card-title">Add New Department</h2>
          <div className="dm-add-row">
            <input
              className="dm-input"
              type="text"
              placeholder="Department Name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
            />
            <input
              className="dm-input"
              type="text"
              placeholder="Department Head"
              value={departmentHead}
              onChange={(e) => setDepartmentHead(e.target.value)}
            />
            <input
              className="dm-input"
              type="number"
              placeholder="Number of Employees"
              value={employeeCount}
              onChange={(e) => setEmployeeCount(e.target.value)}
            />
            <button className="dm-btn-add" onClick={addDepartment}>
              Add
            </button>
          </div>

          {/* Department List */}
          <h2 className="dm-card-title dm-list-title">Department List</h2>
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

        {/* Back */}
        <button className="dm-back-btn" onClick={onBack}>Back</button>

      </div>
    </div>
  );
};

export default DepartmentManagement;
