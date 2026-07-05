import React, { useState } from "react";
import "./ViewEmployeeList.css";

const ViewEmployeeList = ({
  username = "username",
  onLogout,
  onBack,
}) => {

  const [searchId, setSearchId] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const employees = [
    {
      id: "EMP001",
      name: "Emp1",
      department: "Dept 1",
      status: "Active",
      phone: "9876543210",
      email: "emp1@itams.com",
      joiningDate: "10-01-2025",
      assets: [
        {
          assetId: "AST001",
          assetType: "Laptop",
          assignedDate: "15-02-2026",
        },
        {
          assetId: "AST008",
          assetType: "Monitor",
          assignedDate: "15-02-2026",
        },
        {
          assetId: "AST015",
          assetType: "Keyboard",
          assignedDate: "20-03-2026",
        },
      ],
    },

    {
      id: "EMP002",
      name: "Emp2",
      department: "Dept 2",
      status: "Active",
      phone: "9876543211",
      email: "emp2@itams.com",
      joiningDate: "11-01-2025",
      assets: [
        {
          assetId: "AST021",
          assetType: "Laptop",
          assignedDate: "01-04-2026",
        },
      ],
    },

    {
      id: "EMP003",
      name: "Emp3",
      department: "Dept 3",
      status: "On Leave",
      phone: "9876543212",
      email: "emp3@itams.com",
      joiningDate: "15-02-2025",
      assets: [
        {
          assetId: "AST033",
          assetType: "Desktop",
          assignedDate: "12-05-2026",
        },
      ],
    },

    {
      id: "EMP004",
      name: "Emp4",
      department: "Dept 1",
      status: "Inactive",
      phone: "9876543213",
      email: "emp4@itams.com",
      joiningDate: "18-02-2025",
      assets: [],
    },

    {
      id: "EMP005",
      name: "Emp5",
      department: "Dept 2",
      status: "Active",
      phone: "9876543214",
      email: "emp5@itams.com",
      joiningDate: "22-03-2025",
      assets: [],
    },
  ];

  const filteredEmployees = employees.filter((emp) =>
    emp.id.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className="view-page">

      <header className="view-header">

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

      <div className="view-container">

        <h1>View Employee List</h1>

        <p>
          View employee information and assigned assets.
        </p>

        <div className="search-card">

          <h2>Search Employee</h2>

          <div className="search-row">

            <label>Employee ID</label>

            <input
              type="text"
              placeholder="Enter Employee ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />

            <button className="search-btn">
              Search
            </button>

          </div>

        </div>

        <div className="employee-card">

          <h2>Employee List</h2>

          <table>

            <thead>

              <tr>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>
                              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.department}</td>
                    <td>{emp.status}</td>

                    <td>
                      <button
                        className="view-btn"
                        onClick={() => setSelectedEmployee(emp)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No Employee Found</td>
                </tr>
              )}
            </tbody>

          </table>

        </div>

        {selectedEmployee && (

          <div className="popup-overlay">

            <div className="popup-card">

              <div className="popup-header">

                <h2>Employee Details</h2>

                <button
                  className="close-btn"
                  onClick={() => setSelectedEmployee(null)}
                >
                  ✕
                </button>

              </div>

              <div className="popup-body">

                <p><strong>Employee ID :</strong> {selectedEmployee.id}</p>

                <p><strong>Name :</strong> {selectedEmployee.name}</p>

                <p><strong>Email :</strong> {selectedEmployee.email}</p>

                <p><strong>Department :</strong> {selectedEmployee.department}</p>

                <p><strong>Status :</strong> {selectedEmployee.status}</p>

                <p><strong>Phone :</strong> {selectedEmployee.phone}</p>

                <p><strong>Date of Joining :</strong> {selectedEmployee.joiningDate}</p>

                <h3>Assigned Assets</h3>

                <table className="asset-table">

                  <thead>

                    <tr>
                      <th>Asset ID</th>
                      <th>Asset Type</th>
                      <th>Assigned Date</th>
                    </tr>

                  </thead>

                  <tbody>

                    {selectedEmployee.assets.length > 0 ? (

                      selectedEmployee.assets.map((asset, index) => (

                        <tr key={index}>

                          <td>{asset.assetId}</td>

                          <td>{asset.assetType}</td>

                          <td>{asset.assignedDate}</td>

                        </tr>

                      ))

                    ) : (

                      <tr>

                        <td colSpan="3">
                          No Assets Assigned
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};

export default ViewEmployeeList;
            
