import React, { useState } from "react";
import "./AssetManagement.css";

const AssetManagement = ({ username = "username", onLogout, onManageAssets, onAddAsset, onAssetDetails, onRequestApproval, onAssetAssignment }) => {
  const [activeSidebar, setActiveSidebar] = useState("asset-management");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "asset-management", label: "Asset Management" },
    { id: "asset-assignment", label: "Asset Assignment" },
    { id: "request-approval", label: "Request Approval" },
    { id: "maintenance", label: "Maintenance" },
  ];

  const actionCards = [
    {
      id: "add-asset",
      title: "Add Asset",
      description: "Add new asset information to the system",
      buttonLabel: "Add Asset",
    },
    {
      id: "manage-assets",
      title: "Manage Assets",
      description: "Edit or modify asset information and delete assets",
      buttonLabel: "Manage Assets",
    },
    {
      id: "asset-details",
      title: "Asset Details",
      description: "View detailed information about an asset",
      buttonLabel: "Asset Details",
    },
    {
      id: "employee-status",
      title: "Employee Status",
      description: "Check and view the status of employees",
      buttonLabel: "Employee Status",
    },
  ];

  return (
    <div className="am-page-wrapper">

      {/* ── Top Navbar ── */}
      <nav className="am-top-nav">
        <div className="am-nav-logo">
          <span className="am-nav-logo-title">ITAMS</span>
          <span className="am-nav-logo-sub">IT Asset Management System</span>
        </div>
        <div className="am-nav-right">
          <span className="am-nav-username">{username}</span>
          <div className="am-nav-divider" />
          <button className="am-logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="am-body-wrapper">

        {/* ── Sidebar ── */}
        <aside className="am-sidebar">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={
                "am-sidebar-item" +
                (activeSidebar === item.id ? " am-sidebar-item--active" : "")
              }
              onClick={() => {
                setActiveSidebar(item.id);
                if (item.id === "request-approval" && onRequestApproval) {
                  onRequestApproval();
                }
                if (item.id === "asset-assignment" && onAssetAssignment) {
                  onAssetAssignment();
                }
              }}
            >
              {item.label}
            </div>
          ))}
        </aside>

        {/* ── Main Content ── */}
        <main className="am-main-content">
          <h1 className="am-page-title">Asset Management</h1>
          <p className="am-page-subtitle">
            Manage and track all IT assets in the organization
          </p>

          {/* Cards Grid */}
          <div className="am-cards-grid">
            {actionCards.map((card) => (
              <div key={card.id} className="am-card">
                <h3 className="am-card-title">{card.title}</h3>
                <p className="am-card-desc">{card.description}</p>
                <button
                  className="am-card-btn"
                  onClick={
                    card.id === "manage-assets"
                      ? onManageAssets
                      : card.id === "add-asset"
                      ? onAddAsset
                      : card.id === "asset-details"
                      ? onAssetDetails
                      : undefined
                  }
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

export default AssetManagement;
