import React, { useState, useEffect } from "react";
import "./Maintenance.css";

const PAGE_SIZE_OPTIONS = [10, 30, 50, "All"];

const Maintenance = ({
  username = "username",
  onLogout,
  onBack,
  onSidebarNavigate,
}) => {
  const [activeSidebar, setActiveSidebar] = useState("maintenance");

  const [tickets, setTickets] = useState([]);
  const [inProgressTickets, setInProgressTickets] = useState([]);
  const [history, setHistory] = useState([]);

  const [queuePageSize, setQueuePageSize] = useState(10);
  const [inProgressPageSize, setInProgressPageSize] = useState(10);
  const [historyPageSize, setHistoryPageSize] = useState(10);

  const displayedTickets =
    queuePageSize === "All" ? tickets : tickets.slice(0, queuePageSize);
  const displayedInProgressTickets =
    inProgressPageSize === "All"
      ? inProgressTickets
      : inProgressTickets.slice(0, inProgressPageSize);
  const displayedHistory =
    historyPageSize === "All" ? history : history.slice(0, historyPageSize);

  // Load maintenance requests from backend on mount
  useEffect(() => {
    loadMaintenanceData();
  }, []);

  const loadMaintenanceData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
      const resp = await fetch("http://localhost:5000/api/maintenance", { headers });
      const data = await resp.json();
      if (!data.success) return;

      const reports = data.reports || [];
      const fmt = (r) => ({
        ticket: r.id,
        requestId: r.request_id,
        assetId: r.asset_id || "-",
        employeeId: r.employee_id,
        assetType: r.asset_id ? r.asset_id.substring(0, 3) : "-",
        issue: r.description,
        priority: r.priority,
        reported: r.report_date
          ? new Date(r.report_date).toLocaleDateString("en-GB").replace(/\//g, "-")
          : "-",
        status: r.status,
        repairStarted: "-",
        technician: "-",
        completed: "-",
      });

      setTickets(reports.filter((r) => r.status === "Pending").map(fmt));
      setInProgressTickets(reports.filter((r) => r.status === "In Progress").map(fmt));
      setHistory(reports.filter((r) => r.status === "Completed").map(fmt));
    } catch (err) {
      console.error("Load maintenance error:", err);
    }
  };

  const updateStatus = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`http://localhost:5000/api/maintenance/${requestId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await resp.json();
      if (!resp.ok) { alert(data.message || "Failed to update status."); return false; }
      return true;
    } catch (err) {
      alert("Unable to connect to server.");
      return false;
    }
  };

  const handleSidebarClick = (id) => {
    setActiveSidebar(id);

    if (id === "dashboard") {
      onSidebarNavigate?.("dashboard");
    } else if (id === "asset-management") {
      onSidebarNavigate?.("asset-management");
    } else if (id === "asset-assignment") {
      onSidebarNavigate?.("asset-assignment");
    } else if (id === "request-approval") {
      onSidebarNavigate?.("request-approval");
    } else if (id === "maintenance") {
      setActiveSidebar("maintenance");
    }
  };

  const startRepair = async (ticket) => {
    const confirmed = window.confirm(`Start repair for Ticket ${ticket.ticket}?`);
    if (!confirmed) return;
    const ok = await updateStatus(ticket.requestId, "In Progress");
    if (ok) {
      alert(`Repair started for Ticket ${ticket.ticket}`);
      loadMaintenanceData();
    }
  };

  const completeRepair = async (ticket) => {
    const confirmed = window.confirm(`Mark Ticket ${ticket.ticket} as repaired?`);
    if (!confirmed) return;
    const ok = await updateStatus(ticket.requestId, "Completed");
    if (ok) {
      alert(`Ticket ${ticket.ticket} marked as repaired.`);
      loadMaintenanceData();
    }
  };

  return (
    <div className="maintenance-page">

      {/* ================= TOP NAVBAR ================= */}

      <nav className="maintenance-top-nav">

        <div className="maintenance-logo">

          <div className="maintenance-logo-title">
            ITAMS
          </div>

          <div className="maintenance-logo-subtitle">
            IT Asset Management System
          </div>

        </div>

        <div className="maintenance-user-area">

          <span>{username}</span>

          <span className="maintenance-divider"></span>

          <button
            className="maintenance-logout"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ================= BODY ================= */}

      <div className="maintenance-body">

        {/* ================= SIDEBAR ================= */}

        <aside className="maintenance-sidebar">

          <div
            className={
              "maintenance-sidebar-item " +
              (activeSidebar === "dashboard"
                ? "maintenance-sidebar-active"
                : "")
            }
            onClick={() =>
              handleSidebarClick("dashboard")
            }
          >
            Dashboard
          </div>

          <div
            className={
              "maintenance-sidebar-item " +
              (activeSidebar === "asset-management"
                ? "maintenance-sidebar-active"
                : "")
            }
            onClick={() =>
              handleSidebarClick("asset-management")
            }
          >
            Asset Management
          </div>

          <div
            className={
              "maintenance-sidebar-item " +
              (activeSidebar === "asset-assignment"
                ? "maintenance-sidebar-active"
                : "")
            }
            onClick={() =>
              handleSidebarClick("asset-assignment")
            }
          >
            Asset Assignment
          </div>

          <div
            className={
              "maintenance-sidebar-item " +
              (activeSidebar === "request-approval"
                ? "maintenance-sidebar-active"
                : "")
            }
            onClick={() =>
              handleSidebarClick("request-approval")
            }
          >
            Request Approval
          </div>

          <div
            className={
              "maintenance-sidebar-item " +
              (activeSidebar === "maintenance"
                ? "maintenance-sidebar-active"
                : "")
            }
            onClick={() =>
              handleSidebarClick("maintenance")
            }
          >
            Maintenance
          </div>

        </aside>


        {/* ================= MAIN CONTENT ================= */}

        <main className="maintenance-main-content">

          <h1>Maintenance</h1>

          <p className="maintenance-description">
            Manage reported asset issues. Tickets are generated
            automatically in First Come First Serve order.
          </p>


          {/* ================= QUEUE ================= */}

          <section className="maintenance-section">

            <h2>1. Maintenance Ticket Queue</h2>

            <div className="maintenance-info-box">

              <div className="maintenance-info-icon">
                i
              </div>

              <div>
                <strong>
                  Tickets are generated automatically in the
                  order issues are reported (First Come First Serve).
                </strong>

                <br />

                Issues are solved based on priority order:
                <strong> High → Medium → Low.</strong>{" "}
                For the same priority, First Come First Serve.
              </div>

            </div>


            <div className="maintenance-table-wrapper">

              <table className="maintenance-table">

                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Asset ID</th>
                    <th>Employee ID</th>
                    <th>Asset Type</th>
                    <th>Issue</th>
                    <th>Priority</th>
                    <th>Reported Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {displayedTickets.length > 0 ? (

                    displayedTickets.map((ticket) => (

                      <tr key={ticket.ticket}>

                        <td>{ticket.ticket}</td>

                        <td>{ticket.assetId}</td>

                        <td>{ticket.employeeId}</td>

                        <td>{ticket.assetType}</td>

                        <td>{ticket.issue}</td>

                        <td>
                          <span
                            className={`priority-badge priority-${ticket.priority.toLowerCase()}`}
                          >
                            {ticket.priority}
                          </span>
                        </td>

                        <td>{ticket.reported}</td>

                        <td>
                          <span className="status-badge status-pending">
                            {ticket.status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="maintenance-action-button"
                            onClick={() =>
                              startRepair(ticket)
                            }
                          >
                            Start Repair
                          </button>
                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td
                        colSpan="9"
                        className="maintenance-empty"
                      >
                        No pending maintenance tickets.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            <div className="maintenance-pagination">
              <span className="maintenance-pagination-info">
                Showing {displayedTickets.length} of {tickets.length} tickets
              </span>
              <select
                value={queuePageSize}
                onChange={(e) => {
                  const value = e.target.value;
                  setQueuePageSize(value === "All" ? "All" : Number(value));
                }}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

          </section>


          {/* ================= IN PROGRESS ================= */}

          <section className="maintenance-section">

            <h2>2. In Progress Tickets</h2>

            <div className="maintenance-table-wrapper">

              <table className="maintenance-table">

                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Asset ID</th>
                    <th>Employee ID</th>
                    <th>Asset Type</th>
                    <th>Issue</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {displayedInProgressTickets.length > 0 ? (

                    displayedInProgressTickets.map((ticket) => (

                      <tr key={ticket.ticket}>

                        <td>{ticket.ticket}</td>
                        <td>{ticket.assetId}</td>
                        <td>{ticket.employeeId}</td>
                        <td>{ticket.assetType}</td>
                        <td>{ticket.issue}</td>

                        <td>
                          <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                            {ticket.priority}
                          </span>
                        </td>

                        <td>
                          <span className="status-badge status-progress">
                            {ticket.status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="maintenance-action-button"
                            onClick={() => completeRepair(ticket)}
                          >
                            Repaired
                          </button>
                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td colSpan="8" className="maintenance-empty">
                        No tickets currently in progress.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            <div className="maintenance-pagination">
              <span className="maintenance-pagination-info">
                Showing {displayedInProgressTickets.length} of {inProgressTickets.length} tickets
              </span>
              <select
                value={inProgressPageSize}
                onChange={(e) => {
                  const value = e.target.value;
                  setInProgressPageSize(value === "All" ? "All" : Number(value));
                }}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

          </section>


          {/* ================= HISTORY ================= */}

          <section className="maintenance-section">

            <h2>
              3. Maintenance History (Completed Tickets)
            </h2>

            <div className="maintenance-table-wrapper">

              <table className="maintenance-table">

                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Asset ID</th>
                    <th>Employee ID</th>
                    <th>Asset Type</th>
                    <th>Issue</th>
                    <th>Priority</th>
                    <th>Reported Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {displayedHistory.length > 0 ? displayedHistory.map((ticket) => (

                    <tr key={ticket.ticket}>

                      <td>{ticket.ticket}</td>
                      <td>{ticket.assetId}</td>
                      <td>{ticket.employeeId}</td>
                      <td>{ticket.assetType}</td>
                      <td>{ticket.issue}</td>

                      <td>
                        <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                          {ticket.priority}
                        </span>
                      </td>

                      <td>{ticket.reported}</td>

                      <td>
                        <span className="status-badge status-completed">
                          {ticket.status}
                        </span>
                      </td>

                    </tr>

                  )) : (
                    <tr>
                      <td colSpan="8" className="maintenance-empty">
                        No completed tickets.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

            <div className="maintenance-pagination">
              <span className="maintenance-pagination-info">
                Showing {displayedHistory.length} of {history.length} tickets
              </span>
              <select
                value={historyPageSize}
                onChange={(e) => {
                  const value = e.target.value;
                  setHistoryPageSize(value === "All" ? "All" : Number(value));
                }}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

          </section>


          {/* ================= BACK ================= */}

          <div className="maintenance-bottom">

            <button
              className="maintenance-back-button"
              onClick={onBack}
            >
              Back
            </button>

          </div>

        </main>

      </div>

    </div>
  );
};

export default Maintenance;
