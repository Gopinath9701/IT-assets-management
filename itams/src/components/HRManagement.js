import React, { useState } from "react";

const HRManagement = ({
  username = "username",
  onLogout,
  onAddEmployee,
  onUpdateEmployee,
  onViewEmployeeList,
  onEmployeeStatus,
  onDepartmentManagement,
  onReportMaintenance,
}) => {


  const actionCards = [
    {
      id: "add-employee",
      title: "Add Employee",
      description: "Add new employee details to the system",
      buttonLabel: "Add Employee",
    },
    {
      id: "update-employee",
      title: "Update Employee Details",
      description: "Update or modify existing employee information",
      buttonLabel: "Update Details",
    },
    {
      id: "view-employee-list",
      title: "View Employee List",
      description: "View all employees in the organization",
      buttonLabel: "View List",
    },
    {
      id: "employee-status",
      title: "Employee Status",
      description: "View and manage employee status",
      buttonLabel: "View Status",
    },
    {
      id: "department-management",
      title: "Department Management",
      description: "Add, update or manage departments",
      buttonLabel: "Manage Departments",
    },
    {
      id: "report-maintenance",
      title: "Report Maintainance",
      description: "Report the issues caused by the assigned assets",
      buttonLabel: "Report Issue",
    },
  ];

  const statusStats = [
    { label: "Active Employees", value: 128 },
    { label: "On Leave", value: 12 },
    { label: "Resigned", value: 8 },
    { label: "Inactive", value: 4 },
    { label: "Total Employees", value: 152 },
  ];

  return (
<div style={styles.pageWrapper}>
  {/* Top Navbar */}
  <nav style={styles.topNav}>
    <div style={styles.navLogo}>
      <span style={styles.navLogoTitle}>ITAMS</span>
      <span style={styles.navLogoSub}>IT Asset Management System</span>
    </div>

    <div style={styles.navRight}>
      <span style={styles.navUsername}>{username}</span>
      <div style={styles.navDivider} />
      <button style={styles.logoutBtn} onClick={onLogout}>
        Logout
      </button>
    </div>
  </nav>

  <div style={styles.bodyWrapper}>
    

    {/* Main Content */}
    <main style={styles.mainContent}>
      <h1 style={styles.pageTitle}>HR Management</h1>

      <p style={styles.pageSubtitle}>
        Manage employee information, status and departments
      </p>

      {/* Action Cards */}
      <div style={styles.cardsGrid}>
        {actionCards.map((card) => (
          <div key={card.id} style={styles.card}>
            <h3 style={styles.cardTitle}>{card.title}</h3>

            <p style={styles.cardDesc}>{card.description}</p>

            <button
  style={styles.cardBtn}
onClick={() => {
  if (card.id === "add-employee") {
    onAddEmployee();
  } else if (card.id === "update-employee") {
    onUpdateEmployee();
  } else if (card.id === "view-employee-list") {
    onViewEmployeeList();
  } else if (card.id === "employee-status") {
    onEmployeeStatus();
  } else if (card.id === "department-management") {
    onDepartmentManagement();
  } else if (card.id === "report-maintenance") {
    onReportMaintenance();
  }
}}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "#f0f4ff";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "transparent";
  }}
>
  {card.buttonLabel}
</button>
          </div>
        ))}
      </div>

      {/* Employee Status */}
      <div style={styles.overviewSection}>
        <h2 style={styles.overviewTitle}>
          Employee Status Overview
        </h2>

        <div style={styles.statsRow}>
          {statusStats.map((stat) => (
            <div key={stat.label} style={styles.statCard}>
              <span style={styles.statLabel}>{stat.label}</span>

              <span style={styles.statValue}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
</div>
  );
};

const styles = {
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    fontFamily: "'Inter', sans-serif",
  },
  topNav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    height: "64px",
    borderBottom: "1px solid #e8edf4",
    backgroundColor: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLogo: {
    display: "flex",
    flexDirection: "column",
  },
  navLogoTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#0056d6",
    lineHeight: 1.1,
  },
  navLogoSub: {
    fontSize: "10px",
    color: "#6b778c",
    fontWeight: "500",
    marginTop: "2px",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  navUsername: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#172b4d",
  },
  navDivider: {
    width: "1px",
    height: "20px",
    backgroundColor: "#dfe1e6",
  },
  logoutBtn: {
    background: "none",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    color: "#172b4d",
    cursor: "pointer",
    padding: "0",
  },
  bodyWrapper: {
    display: "flex",
    flex: 1,
  },

  mainContent: {
    flex: 1,
    padding: "36px 40px",
  },
  pageTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#091e42",
    margin: "0 0 6px 0",
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#5e6c84",
    margin: "0 0 32px 0",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  card: {
    border: "1px solid #dfe1e6",
    borderRadius: "8px",
    padding: "28px 24px 24px",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "10px",
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#091e42",
    margin: "0",
  },
  cardDesc: {
    fontSize: "13px",
    color: "#5e6c84",
    lineHeight: "1.55",
    margin: "0",
    flex: 1,
  },
  cardBtn: {
    marginTop: "12px",
    padding: "9px 24px",
    border: "1.5px solid #172b4d",
    borderRadius: "6px",
    backgroundColor: "transparent",
    fontSize: "13px",
    fontWeight: "700",
    color: "#172b4d",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
    width: "100%",
  },
  overviewSection: {
    marginTop: "36px",
  },
  overviewTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#091e42",
    margin: "0 0 16px 0",
  },
  statsRow: {
    display: "flex",
    gap: "16px",
  },
  statCard: {
    flex: 1,
    border: "1px solid #dfe1e6",
    borderRadius: "8px",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#ffffff",
  },
  statLabel: {
    fontSize: "12px",
    color: "#5e6c84",
    fontWeight: "500",
    textAlign: "center",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#091e42",
  },
};

export default HRManagement;
