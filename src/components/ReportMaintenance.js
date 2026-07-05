import React, { useState } from "react";
import "./ReportMaintenance.css";

const ReportMaintenance = ({
  username = "username",
  onLogout,
  onBack,
}) => {
  const [employeeId, setEmployeeId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [issueCategory, setIssueCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");

  const [reports, setReports] = useState([
    {
      id: "MR001",
      assetId: "AST001",
      category: "Hardware Issue",
      description: "Laptop screen is not responding.",
      priority: "High",
      status: "Pending",
      date: "30-06-2026",
    },
    {
      id: "MR002",
      assetId: "AST002",
      category: "Software Issue",
      description: "Printer is not printing documents.",
      priority: "Medium",
      status: "In Progress",
      date: "29-06-2026",
    },
    {
      id: "MR003",
      assetId: "AST003",
      category: "Performance Issue",
      description: "System getting hanged frequently.",
      priority: "Low",
      status: "Completed",
      date: "27-06-2026",
    },
  ]);

  const submitRequest = () => {
    if (
      !employeeId ||
      !assetId ||
      !issueCategory ||
      !description ||
      !priority
    ) {
      alert("Please fill all fields.");
      return;
    }

    const newReport = {
      id: `MR00${reports.length + 1}`,
      assetId,
      category: issueCategory,
      description,
      priority,
      status: "Pending",
      date: new Date().toLocaleDateString(),
    };

    setReports([newReport, ...reports]);

    setEmployeeId("");
    setAssetId("");
    setIssueCategory("");
    setDescription("");
    setPriority("");
  };

  return (
    <div className="report-page">

      <div className="report-header">
        <h2>Report Maintenance</h2>
        <p>Report issues related to IT assets.</p>
      </div>

      <div className="report-card">

        <h3>Maintenance Request Form</h3>

        <div className="form-grid">

          <div>
            <label>Employee ID</label>
            <input
              value={employeeId}
              onChange={(e)=>setEmployeeId(e.target.value)}
              placeholder="Enter Employee ID"
            />
          </div>

          <div>
            <label>Asset ID</label>
            <input
              value={assetId}
              onChange={(e)=>setAssetId(e.target.value)}
              placeholder="Enter Asset ID"
            />
          </div>

          <div>
            <label>Issue Category</label>

            <select
              value={issueCategory}
              onChange={(e)=>setIssueCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option>Hardware Issue</option>
              <option>Software Issue</option>
              <option>Performance Issue</option>
              <option>Security Issue</option>
            </select>

          </div>

        </div>

        <label>Issue Description</label>

        <textarea
          rows="4"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          placeholder="Enter issue description"
        />

        <div className="priority">

          <label>Priority</label>

          <div className="radio-group">

            <label>
              <input
                type="radio"
                value="Low"
                checked={priority==="Low"}
                onChange={(e)=>setPriority(e.target.value)}
              />
              Low
            </label>

            <label>
              <input
                type="radio"
                value="Medium"
                checked={priority==="Medium"}
                onChange={(e)=>setPriority(e.target.value)}
              />
              Medium
            </label>

            <label>
              <input
                type="radio"
                value="High"
                checked={priority==="High"}
                onChange={(e)=>setPriority(e.target.value)}
              />
              High
            </label>

          </div>

        </div>

        <div className="buttons">

          <button
            className="submit-btn"
            onClick={submitRequest}
          >
            Submit Request
          </button>

          <button
            className="clear-btn"
            onClick={()=>{
              setEmployeeId("");
              setAssetId("");
              setIssueCategory("");
              setDescription("");
              setPriority("");
            }}
          >
            Clear
          </button>

        </div>

      </div>

      <div className="table-card">

        <h3>My Maintenance Requests</h3>

        <table>

          <thead>
            <tr>
              <th>Request ID</th>
              <th>Asset ID</th>
              <th>Issue Category</th>
              <th>Issue Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Report Date</th>
            </tr>
          </thead>

          <tbody>

            {reports.map((r)=>(
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.assetId}</td>
                <td>{r.category}</td>
                <td>{r.description}</td>
                <td>{r.priority}</td>
                <td>{r.status}</td>
                <td>{r.date}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ReportMaintenance;