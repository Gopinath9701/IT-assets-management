import React, { useState } from "react";
import "./Maintenance.css";

const Maintenance = ({
  username = "username",
  onLogout,
  onBack,
  onSidebarNavigate,
}) => {
  const [activeSidebar, setActiveSidebar] = useState("maintenance");

  const [tickets, setTickets] = useState([
    {
      ticket: 1,
      assetId: "LAP001",
      employeeId: "250818001",
      assetType: "Laptop",
      issue: "Screen damaged",
      priority: "High",
      reported: "18-08-2026 09:00 AM",
      status: "Pending",
    },
    {
      ticket: 2,
      assetId: "MON001",
      employeeId: "250818002",
      assetType: "Monitor",
      issue: "Display issue",
      priority: "Medium",
      reported: "18-08-2026 09:10 AM",
      status: "Pending",
    },
    {
      ticket: 3,
      assetId: "KEY001",
      employeeId: "250818003",
      assetType: "Keyboard",
      issue: "Keys not working",
      priority: "Low",
      reported: "18-08-2026 09:25 AM",
      status: "Pending",
    },
  ]);

  const [inProgressTickets, setInProgressTickets] = useState([
    {
      ticket: 2,
      assetId: "MON001",
      employeeId: "250818002",
      assetType: "Monitor",
      issue: "Display issue",
      priority: "Medium",
      repairStarted: "18-08-2026 11:30 AM",
      technician: "Technician 1",
      status: "In Progress",
    },
    {
      ticket: 4,
      assetId: "PRN001",
      employeeId: "250818004",
      assetType: "Printer",
      issue: "Paper jam",
      priority: "High",
      repairStarted: "18-08-2026 12:05 PM",
      technician: "Technician 2",
      status: "In Progress",
    },
  ]);

  const [history, setHistory] = useState([
    {
      ticket: 5,
      assetId: "LAP002",
      employeeId: "250817001",
      assetType: "Laptop",
      issue: "Battery not charging",
      priority: "High",
      reported: "17-08-2026 10:15 AM",
      completed: "17-08-2026 04:20 PM",
      technician: "Technician 1",
      status: "Completed",
    },
    {
      ticket: 6,
      assetId: "MOU001",
      employeeId: "250817002",
      assetType: "Mouse",
      issue: "Scroll not working",
      priority: "Low",
      reported: "17-08-2026 02:40 PM",
      completed: "18-08-2026 10:00 AM",
      technician: "Technician 3",
      status: "Completed",
    },
  ]);

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

  const startRepair = (ticket) => {
    const confirmed = window.confirm(
      `Start repair for Ticket ${ticket.ticket}?`
    );

    if (!confirmed) return;

    const newInProgress = {
      ...ticket,
      repairStarted: "18-08-2026 03:15 PM",
      technician: "Technician 1",
      status: "In Progress",
    };

    setTickets((prev) =>
      prev.filter((item) => item.ticket !== ticket.ticket)
    );

    setInProgressTickets((prev) => [
      ...prev,
      newInProgress,
    ]);

    alert(`Repair started for Ticket ${ticket.ticket}`);
  };

  const completeRepair = (ticket) => {
    const confirmed = window.confirm(
      `Mark Ticket ${ticket.ticket} as repaired?`
    );

    if (!confirmed) return;

    const completedTicket = {
      ...ticket,
      reported: "18-08-2026 09:10 AM",
      completed: "18-08-2026 03:30 PM",
      status: "Completed",
    };

    setInProgressTickets((prev) =>
      prev.filter((item) => item.ticket !== ticket.ticket)
    );

    setHistory((prev) => [
      completedTicket,
      ...prev,
    ]);

    alert(`Ticket ${ticket.ticket} marked as repaired.`);
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
                    <th>Reported Date & Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {tickets.length > 0 ? (

                    tickets.map((ticket) => (

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
              <select>
                <option>10</option>
                <option>20</option>
                <option>50</option>
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
                    <th>Repair Started</th>
                    <th>Technician</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {inProgressTickets.length > 0 ? (

                    inProgressTickets.map((ticket) => (

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

                        <td>{ticket.repairStarted}</td>

                        <td>{ticket.technician}</td>

                        <td>
                          <span className="status-badge status-progress">
                            {ticket.status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="maintenance-action-button"
                            onClick={() =>
                              completeRepair(ticket)
                            }
                          >
                            Repaired
                          </button>
                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td
                        colSpan="10"
                        className="maintenance-empty"
                      >
                        No tickets currently in progress.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            <div className="maintenance-pagination">
              <select>
                <option>10</option>
                <option>20</option>
                <option>50</option>
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
                    <th>Reported Date & Time</th>
                    <th>Completed Date & Time</th>
                    <th>Technician</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {history.map((ticket) => (

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

                      <td>{ticket.completed}</td>

                      <td>{ticket.technician}</td>

                      <td>
                        <span className="status-badge status-completed">
                          {ticket.status}
                        </span>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            <div className="maintenance-pagination">
              <select>
                <option>10</option>
                <option>20</option>
                <option>50</option>
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
