import React, { useState } from "react";

const AssetManagement = ({ username = "username", onLogout }) => {
  const [activeSidebar, setActiveSidebar] = useState("asset-management");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "asset-management", label: "Asset Management" },
    { id: "asset-assignment", label: "Asset Assignment" },
  ];

  const actionCards = [
    {
      id: "add-asset",
      title: "Add Asset",
      description: "Add new asset information to the system",
      buttonLabel: "Add Asset",
    },
    {
      id: "edit-asset",
      title: "Edit Asset",
      description: "Edit or modify existing asset information",
      buttonLabel: "Edit Asset",
    },
    {
      id: "delete-asset",
      title: "Delete Asset",
      description: "Delete asset information from the system",
      buttonLabel: "Delete Asset",
    },
    {
      id: "asset-details",
      title: "Asset Details",
      description: "View detailed information about an asset",
      buttonLabel: "Asset Details",
    },
    {
      id: "asset-search",
      title: "Asset Search",
      description: "Search and find assets in the organization",
      buttonLabel: "Asset Search",
    },
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
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.sidebarItem,
                ...(activeSidebar === item.id ? styles.sidebarItemActive : {}),
              }}
              onClick={() => setActiveSidebar(item.id)}
            >
              {item.label}
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main style={styles.mainContent}>
          <h1 style={styles.pageTitle}>Asset Management</h1>
          <p style={styles.pageSubtitle}>
            Manage and track all IT assets in the organization
          </p>

          {/* Cards Grid */}
          <div style={styles.cardsGrid}>
            {actionCards.map((card, index) => (
              <div
                key={card.id}
                style={{
                  ...styles.card,
                  ...(index >= 3 ? styles.cardWide : {}),
                }}
              >
                <h3 style={styles.cardTitle}>{card.title}</h3>
                <p style={styles.cardDesc}>{card.description}</p>
                <button
                  style={styles.cardBtn}
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
  sidebar: {
    width: "200px",
    minWidth: "200px",
    borderRight: "1px solid #e8edf4",
    padding: "16px 0",
    backgroundColor: "#ffffff",
  },
  sidebarItem: {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#172b4d",
    cursor: "pointer",
    borderRadius: "6px",
    margin: "2px 8px",
    transition: "background-color 0.15s ease",
  },
  sidebarItemActive: {
    backgroundColor: "#0056d6",
    color: "#ffffff",
    fontWeight: "600",
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
  cardWide: {
    gridColumn: "span 1",
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
};

export default AssetManagement;
