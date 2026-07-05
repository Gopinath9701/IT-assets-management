import React, { useState } from "react";
import "./DepartmentManagement.css";

const DepartmentManagement = ({
  username = "username",
  onLogout,
  onBack,
}) => {

  const [search, setSearch] = useState("");

  const [departmentId, setDepartmentId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [departmentHead, setDepartmentHead] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");

  // Show/Hide Add Department Form
  const [showFields, setShowFields] = useState(false);

  const [departments, setDepartments] = useState([
    {
      id: "DEP001",
      name: "Information Technology (IT)",
      head: "Head 1",
      employees: 25,
    },
    {
      id: "DEP002",
      name: "Human Resources (HR)",
      head: "Head 2",
      employees: 10,
    },
    {
      id: "DEP003",
      name: "Finance",
      head: "Head 3",
      employees: 15,
    },
    {
      id: "DEP004",
      name: "Marketing",
      head: "Head 4",
      employees: 12,
    },
    {
      id: "DEP005",
      name: "Sales",
      head: "Head 5",
      employees: 20,
    },
    {
      id: "DEP006",
      name: "Administration",
      head: "Head 6",
      employees: 8,
    },
  ]);
  const filteredDepartments = departments.filter((dept) =>
  dept.name.toLowerCase().includes(search.toLowerCase())
);

const addDepartment = () => {

  if (
    departmentId === "" ||
    departmentName === "" ||
    departmentHead === "" ||
    employeeCount === ""
  ) {
    alert("Please fill all fields.");
    return;
  }

  setDepartments([
    ...departments,
    {
      id: departmentId,
      name: departmentName,
      head: departmentHead,
      employees: employeeCount,
    },
  ]);

  setDepartmentId("");
  setDepartmentName("");
  setDepartmentHead("");
  setEmployeeCount("");

  // Hide the form after adding
  setShowFields(false);
};

const deleteDepartment = (id) => {
  setDepartments(
    departments.filter((dept) => dept.id !== id)
  );
};

return (
   
  <div className="department-page">

    <div className="department-container">

      <h1>Department Management</h1>

      <p>Manage organization departments.</p>

      <div className="department-card">

        <h3>Search Department</h3>

        <div className="search-row">
          <input
            type="text"
            placeholder="Enter Department Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button>Search</button>
        </div>

        <hr />

       <h3
  style={{
    cursor: "pointer",
    color: "#1d5fd0",
    display: "inline-block",
  }}
  onClick={() => setShowFields(true)}
>
  Add New Department
</h3>

{showFields && (
          



<div className="add-row">

  <input
    type="text"
    placeholder="Department ID"
    value={departmentId}
    onChange={(e) => setDepartmentId(e.target.value)}
  />

  <input
    type="text"
    placeholder="Department Name"
    value={departmentName}
    onChange={(e) => setDepartmentName(e.target.value)}
  />

  <input
    type="text"
    placeholder="Department Head"
    value={departmentHead}
    onChange={(e) => setDepartmentHead(e.target.value)}
  />

  <input
    type="number"
    placeholder="Number of Employees"
    value={employeeCount}
    onChange={(e) => setEmployeeCount(e.target.value)}
  />

  <button onClick={addDepartment}>
    Add
  </button>

</div>

)}

        <hr />
              <h3>Department List</h3>

        <table>

          <thead>
            <tr>
              <th>Department ID</th>
              <th>Department Name</th>
              <th>Department Head</th>
              <th>Number of Employees</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredDepartments.length > 0 ? (

              filteredDepartments.map((dept) => (

                <tr key={dept.id}>

                  <td>{dept.id}</td>
                  <td>{dept.name}</td>
                  <td>{dept.head}</td>
                  <td>{dept.employees}</td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() => deleteDepartment(dept.id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="5">
                  No Department Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  </div>

);

};

export default DepartmentManagement;