import React, { useState, useEffect } from "react";
import "./Maintenance.css";

const Maintenance = ({
  username = "username",
  onLogout,
  onBack,
  onSidebarNavigate,
}) => {
  const [activeSidebar, setActiveSidebar] = useState("maintenance");

  const [statusMessage, setStatusMessage] = useState("");
  const [statusMessageIsError, setStatusMessageIsError] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [inProgressTickets, setInProgressTickets] = useState([]);
  const [history, setHistory] = useState([]);

  // =====================================================
  // LOAD MAINTENANCE REQUESTS
  // =====================================================

  useEffect(() => {
    loadMaintenanceData();
  }, []);

  const loadMaintenanceData = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const resp = await fetch(
        "http://localhost:5000/api/maintenance",
        { headers }
      );

      const data = await resp.json();

      if (!data.success) return;

      const reports = data.reports || [];

      const fmt = (r) => ({
        ticket: r.id,
        requestId: r.request_id,
        assetId: r.asset_id || "-",
        employeeId: r.employee_id || "-",

        // Asset type from Asset ID prefix
        assetType: r.asset_id
          ? r.asset_id.substring(0, 3)
          : "-",

        // =================================================
        // NEW: ISSUE CATEGORY
        // =================================================
        issueCategory: r.issue_category || "-",

        // Issue description
        issue: r.description || "-",

        priority: r.priority || "-",

        reported: r.report_date
          ? new Date(r.report_date)
              .toLocaleDateString("en-GB")
              .replace(/\//g, "-")
          : "-",

        status: r.status || "Pending",

        repairStarted: "-",
        technician: "-",
        completed: "-",
      });

      setTickets(
        reports
          .filter((r) => r.status === "Pending")
          .map(fmt)
      );

      setInProgressTickets(
        reports
          .filter((r) => r.status === "In Progress")
          .map(fmt)
      );

      setHistory(
        reports
          .filter((r) => r.status === "Completed")
          .map(fmt)
      );
    } catch (err) {
      console.error("Load maintenance error:", err);
    }
  };

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const updateStatus = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const resp = await fetch(
        `http://localhost:5000/api/maintenance/${requestId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await resp.json();

      if (!resp.ok) {
        setStatusMessageIsError(true);
        setStatusMessage(
          data.message || "Failed to update status."
        );
        return false;
      }

      return true;
    } catch (err) {
      setStatusMessageIsError(true);
      setStatusMessage("Unable to connect to server.");
      return false;
    }
  };

  // =====================================================
  // SIDEBAR
  // =====================================================

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

  // =====================================================
  // START REPAIR
  // =====================================================

  const askStartRepair = (ticket) => {
    setPendingConfirm({ type: "start", ticket });
  };

  const startRepair = async (ticket) => {
    const ok = await updateStatus(
      ticket.requestId,
      "In Progress"
    );

    if (ok) {
      setStatusMessageIsError(false);
      setStatusMessage(
        `Repair started for Ticket ${ticket.ticket}`
      );

      loadMaintenanceData();
    }
  };

  // =====================================================
  // COMPLETE REPAIR
  // =====================================================

  const askCompleteRepair = (ticket) => {
    setPendingConfirm({ type: "complete", ticket });
  };

  const completeRepair = async (ticket) => {
    const ok = await updateStatus(
      ticket.requestId,
      "Completed"
    );

    if (ok) {
      setStatusMessageIsError(false);
      setStatusMessage(
        `Ticket ${ticket.ticket} marked as repaired.`
      );

      loadMaintenanceData();
    }
  };

  // =====================================================
  // CONFIRM MODAL ACTIONS
  // =====================================================

  const confirmPendingAction = async () => {
    if (!pendingConfirm) return;

    const { type, ticket } = pendingConfirm;
    setPendingConfirm(null);

    if (type === "start") {
      await startRepair(ticket);
    } else if (type === "complete") {
      await completeRepair(ticket);
    }
  };

  const cancelPendingAction = () => {
    setPendingConfirm(null);
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

          <span className="maintenance-divider">
            |
          </span>

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

          {statusMessage && (
            <div
              style={{
                color: statusMessageIsError ? "#d93025" : "#188038",
                fontSize: "13px",
                marginBottom: "10px",
              }}
            >
              {statusMessageIsError ? "⚠️ " : "✅ "}
              {statusMessage}
            </div>
          )}

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

                    {/* NEW COLUMN */}
                    <th>Issue Category</th>

                    <th>Issue</th>
                    <th>Priority</th>
                    <th>Reported Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {tickets.length > 0 ? (

                    tickets.map((ticket) => (

                      <tr key={ticket.ticket}>

                        <td>
                          {ticket.ticket}
                        </td>

                        <td>
                          {ticket.assetId}
                        </td>

                        <td>
                          {ticket.employeeId}
                        </td>

                        <td>
                          {ticket.assetType}
                        </td>

                        {/* NEW ISSUE CATEGORY VALUE */}
                        <td>
                          {ticket.issueCategory}
                        </td>

                        <td>
                          {ticket.issue}
                        </td>

                        <td>

                          <span
                            className={`priority-badge priority-${ticket.priority.toLowerCase()}`}
                          >
                            {ticket.priority}
                          </span>

                        </td>

                        <td>
                          {ticket.reported}
                        </td>

                        <td>

                          <span className="status-badge status-pending">
                            {ticket.status}
                          </span>

                        </td>

                        <td>

                          <button
                            className="maintenance-action-button"
                            onClick={() =>
                              askStartRepair(ticket)
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
                        colSpan="10"
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
                    <th>Issue Category</th>
                    <th>Issue</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {inProgressTickets.length > 0 ? (

                    inProgressTickets.map((ticket) => (

                      <tr key={ticket.ticket}>

                        <td>
                          {ticket.ticket}
                        </td>

                        <td>
                          {ticket.assetId}
                        </td>

                        <td>
                          {ticket.employeeId}
                        </td>

                        <td>
                          {ticket.assetType}
                        </td>

                        <td>
                          {ticket.issueCategory}
                        </td>

                        <td>
                          {ticket.issue}
                        </td>

                        <td>

                          <span
                            className={`priority-badge priority-${ticket.priority.toLowerCase()}`}
                          >
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
                            onClick={() =>
                              askCompleteRepair(ticket)
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
                        colSpan="9"
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
                    <th>Issue Category</th>
                    <th>Issue</th>
                    <th>Priority</th>
                    <th>Reported Date</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  {history.length > 0 ? (

                    history.map((ticket) => (

                      <tr key={ticket.ticket}>

                        <td>
                          {ticket.ticket}
                        </td>

                        <td>
                          {ticket.assetId}
                        </td>

                        <td>
                          {ticket.employeeId}
                        </td>

                        <td>
                          {ticket.assetType}
                        </td>

                        <td>
                          {ticket.issueCategory}
                        </td>

                        <td>
                          {ticket.issue}
                        </td>

                        <td>

                          <span
                            className={`priority-badge priority-${ticket.priority.toLowerCase()}`}
                          >
                            {ticket.priority}
                          </span>

                        </td>

                        <td>
                          {ticket.reported}
                        </td>

                        <td>

                          <span className="status-badge status-completed">
                            {ticket.status}
                          </span>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="9"
                        className="maintenance-empty"
                      >
                        No completed tickets.
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

      {pendingConfirm && (
        <div
          onClick={cancelPendingAction}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "24px",
              maxWidth: "360px",
              width: "90%",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <p style={{ margin: "0 0 20px", fontSize: "14px", color: "#202124" }}>
              {pendingConfirm.type === "start"
                ? `Start repair for Ticket ${pendingConfirm.ticket.ticket}?`
                : `Mark Ticket ${pendingConfirm.ticket.ticket} as repaired?`}
            </p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={cancelPendingAction}
                className="maintenance-back-button"
              >
                Cancel
              </button>

              <button
                onClick={confirmPendingAction}
                className="maintenance-action-button"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Maintenance;
