import React, { useState } from "react";
import "./AssetManagement.css";
import AssetAssignment from "./AssetAssignment";
import RequestApproval from "./RequestApproval";
import AddAsset from "./AddAsset";
import ManageAsset from "./ManageAsset";
import AssetDetails from "./AssetDetails";
import EmployeeStatus from "./EmployeeStatus";  // ← ADD THIS IMPORT

const AssetManagement = ({ 
  username = "username", 
  onLogout, 
  onBack,
  onNavigateToAddAsset,
  onNavigateToManageAsset,
  onNavigateToAssetDetails,
  onNavigateToEmployeeStatus  // ← ADD THIS PROP
}) => {
  
  const [activeSidebar, setActiveSidebar] = useState("asset-management");
  const [currentPage, setCurrentPage] = useState("main");

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

  // ==========================================
  // NAVIGATION FUNCTIONS
  // ==========================================
  
  const goToMain = () => {
    setCurrentPage("main");
    setActiveSidebar("asset-management");
  };

  const goToAddAsset = () => {
    if (onNavigateToAddAsset) {
      onNavigateToAddAsset();
    } else {
      setCurrentPage("add-asset");
    }
  };

  const goToManageAssets = () => {
    if (onNavigateToManageAsset) {
      onNavigateToManageAsset();
    } else {
      setCurrentPage("manage-assets");
    }
  };

  const goToAssetDetails = () => {
    if (onNavigateToAssetDetails) {
      onNavigateToAssetDetails();
    } else {
      setCurrentPage("asset-details");
    }
  };

  // ✅ NEW: Go to Employee Status
  const goToEmployeeStatus = () => {
    console.log("🟢 Navigating to Employee Status page");
    if (onNavigateToEmployeeStatus) {
      onNavigateToEmployeeStatus();
    } else {
      setCurrentPage("employee-status");
    }
  };

  const goToAssignment = () => {
    setCurrentPage("assignment");
    setActiveSidebar("asset-assignment");
  };

  const goToApproval = () => {
    setCurrentPage("approval");
    setActiveSidebar("request-approval");
  };

  // ==========================================
  // SIDEBAR CLICK HANDLER - MAIN
  // ==========================================
  const handleSidebarClick = (item) => {
    console.log("AssetManagement sidebar clicked:", item.id);
    setActiveSidebar(item.id);
    
    if (item.id === "asset-management") {
      goToMain();
    } else if (item.id === "asset-assignment") {
      goToAssignment();
    } else if (item.id === "request-approval") {
      goToApproval();
    } else if (item.id === "dashboard") {
      goToMain();
    } else if (item.id === "maintenance") {
      goToMain();
    }
  };

  // ==========================================
  // HANDLE SIDEBAR NAVIGATION FROM CHILDREN
  // ==========================================
  const handleChildSidebarNavigate = (id) => {
    console.log("Child sidebar navigate:", id);
    setActiveSidebar(id);
    
    if (id === "asset-management") {
      goToMain();
    } else if (id === "asset-assignment") {
      goToAssignment();
    } else if (id === "request-approval") {
      goToApproval();
    } else if (id === "dashboard") {
      goToMain();
    } else if (id === "maintenance") {
      goToMain();
    }
  };

  // ==========================================
  // RENDER PAGES
  // ==========================================

  // Show AddAsset page
  if (currentPage === "add-asset") {
    return (
      <AddAsset
        username={username}
        onLogout={onLogout}
        onBack={goToMain}
      />
    );
  }

  // Show ManageAsset page
  if (currentPage === "manage-assets") {
    return (
      <ManageAsset
        username={username}
        onLogout={onLogout}
        onBack={goToMain}
        onSidebarNavigate={handleChildSidebarNavigate}
      />
    );
  }

  // Show AssetDetails page
  if (currentPage === "asset-details") {
    return (
      <AssetDetails
        username={username}
        onLogout={onLogout}
        onBack={goToMain}
        onSidebarNavigate={handleChildSidebarNavigate}
      />
    );
  }

  // ✅ NEW: Show EmployeeStatus page
  if (currentPage === "employee-status") {
    return (
      <EmployeeStatus
        username={username}
        onLogout={onLogout}
        onBack={goToMain}
      />
    );
  }

  // Show RequestApproval page
  if (currentPage === "approval") {
    return (
      <RequestApproval
        username={username}
        onLogout={onLogout}
        onBack={goToMain}
        onSidebarNavigate={handleChildSidebarNavigate}
      />
    );
  }

  // Show AssetAssignment page
  if (currentPage === "assignment") {
    return (
      <AssetAssignment
        username={username}
        onLogout={onLogout}
        onBack={goToMain}
        onSidebarNavigate={handleChildSidebarNavigate}
      />
    );
  }

  // ==========================================
  // MAIN ASSET MANAGEMENT VIEW
  // ==========================================
  return (
    <div className="am-page-wrapper">
      <nav className="am-top-nav">
        <div className="am-nav-logo">
          <span className="am-nav-logo-title">ITAMS</span>
          <span className="am-nav-logo-sub">IT Asset Management System</span>
        </div>
        <div className="am-nav-right">
          <span className="am-nav-username">{username}</span>
          <div className="am-nav-divider" />
          <button className="am-logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div className="am-body-wrapper">
        <aside className="am-sidebar">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={
                "am-sidebar-item" +
                (activeSidebar === item.id ? " am-sidebar-item--active" : "")
              }
              onClick={() => handleSidebarClick(item)}
            >
              {item.label}
            </div>
          ))}
        </aside>

        <main className="am-main-content">
          <h1 className="am-page-title">Asset Management</h1>
          <p className="am-page-subtitle">
            Manage and track all IT assets in the organization
          </p>

          <div className="am-cards-grid">
            {actionCards.map((card) => (
              <div key={card.id} className="am-card">
                <h3 className="am-card-title">{card.title}</h3>
                <p className="am-card-desc">{card.description}</p>
                <button
                  className="am-card-btn"
                  onClick={() => {
                    console.log("🟢 Card clicked:", card.id);
                    if (card.id === "add-asset") {
                      goToAddAsset();
                    } else if (card.id === "manage-assets") {
                      goToManageAssets();
                    } else if (card.id === "asset-details") {
                      goToAssetDetails();
                    } else if (card.id === "employee-status") {
                      goToEmployeeStatus();  // ✅ NOW WORKS!
                    }
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

export default AssetManagement;
