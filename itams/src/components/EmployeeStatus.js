import React, { useState } from "react";
import "./EmployeeStatus.css";

const EmployeeStatus = ({ onBack }) => {
  const [search, setSearch] = useState("");

  const [employees, setEmployees] = useState([
    {
      id: "EMP001",
      name: "Employee 1",
      department: "IT",
      status: "Active",
    },
    {
      id: "EMP002",
      name: "Employee 2",
      department: "HR",
      status: "On Leave",
    },
    {
      id: "EMP003",
      name: "Employee 3",
      department: "Finance",
      status: "Inactive",
    },
    {
      id: "EMP004",
      name: "Employee 4",
      department: "Marketing",
      status: "Active",
    },
    {
      id: "EMP005",
      name: "Employee 5",
      department: "IT",
      status: "On Leave",
    },
    {
      id: "EMP006",
      name: "Employee 6",
      department: "Sales",
      status: "Inactive",
    },
    {
      id: "EMP007",
      name: "Employee 7",
      department: "Operations",
      status: "Active",
    },
    {
      id: "EMP008",
      name: "Employee 8",
      department: "Finance",
      status: "On Leave",
    },
  ]);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const changeStatus = (index, value) => {
    const updated = [...employees];
    updated[index].status = value;
    setEmployees(updated);
  };

  return (
    <div className="status-page">

      <div className="status-container">

        <h1>Employee Status</h1>

        <p>View and update employee status.</p>

        <div className="search-box">

          <h3>Search Employee</h3>

          <div className="search-row">

            <input
              type="text"
              placeholder="Enter Employee ID or Employee Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button>Search</button>

          </div>

        </div>

        <div className="table-card">

          <table>

            <thead>

              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Update</th>
              </tr>

            </thead>

            <tbody>

              {filteredEmployees.map((emp, index) => (

                <tr key={emp.id}>

                  <td>{emp.id}</td>

                  <td>{emp.name}</td>

                  <td>{emp.department}</td>

                  <td>{emp.status}</td>

                  <td>

                    <select
                      value={emp.status}
                      onChange={(e) =>
                        changeStatus(index, e.target.value)
                      }
                    >
                      <option>Active</option>
                      <option>On Leave</option>
                      <option>Inactive</option>
                    </select>

                    <button
                      className="update-btn"
                      onClick={() => alert("Status Updated Successfully")}
                    >
                      Update
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default EmployeeStatus;