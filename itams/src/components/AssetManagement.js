import React, { useState } from "react";
import "./AssetManagement.css";

import AssetAssignment from "./AssetAssignment";
import RequestApproval from "./RequestApproval";
import AddAsset from "./AddAsset";
import ManageAsset from "./ManageAsset";
import AssetDetails from "./AssetDetails";
import EmployeeStatus from "./AssetEmployeeStatus";
import AssetReturn from "./AssetReturn";
import Maintenance from "./Maintenance";

const AssetManagement = ({
  username = "username",
  onLogout,
  onBack,
  onNavigateToAddAsset,
  onNavigateToManageAsset,
  onNavigateToAssetDetails,
  onNavigateToEmployeeStatus,
  onNavigateToAssetReturn,
}) => {

  const [activeSidebar, setActiveSidebar] =
    useState("asset-management");

  const [currentPage, setCurrentPage] =
    useState("main");


  // ==========================================
  // SIDEBAR ITEMS
  // ==========================================

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
    },
    {
      id: "asset-management",
      label: "Asset Management",
    },
    {
      id: "asset-assignment",
      label: "Asset Assignment",
    },
    {
      id: "request-approval",
      label: "Request Approval",
    },
    {
      id: "maintenance",
      label: "Maintenance",
    },
  ];


  // ==========================================
  // ACTION CARDS
  // ==========================================

  const actionCards = [
    {
      id: "add-asset",
      title: "Add Asset",
      description:
        "Add new asset information to the system",
      buttonLabel: "Add Asset",
    },

    {
      id: "manage-assets",
      title: "Manage Assets",
      description:
        "Edit or modify asset information and delete assets",
      buttonLabel: "Manage Assets",
    },

    {
      id: "asset-details",
      title: "Asset Details",
      description:
        "View detailed information about an asset",
      buttonLabel: "Asset Details",
    },

    {
      id: "employee-status",
      title: "Employee Status",
      description:
        "Check and view the status of employees",
      buttonLabel: "Employee Status",
    },

    {
      id: "asset-return",
      title: "Asset Return",
      description:
        "Return assets assigned to employees",
      buttonLabel: "Return",
    },
  ];


  // ==========================================
  // GO TO MAIN
  // ==========================================

  const goToMain = () => {

    setCurrentPage("main");

    setActiveSidebar(
      "asset-management"
    );
  };


  // ==========================================
  // GO TO ADD ASSET
  // ==========================================

  const goToAddAsset = () => {

    if (onNavigateToAddAsset) {

      onNavigateToAddAsset();

    } else {

      setCurrentPage("add-asset");

    }
  };


  // ==========================================
  // GO TO MANAGE ASSETS
  // ==========================================

  const goToManageAssets = () => {

    if (onNavigateToManageAsset) {

      onNavigateToManageAsset();

    } else {

      setCurrentPage("manage-assets");

    }
  };


  // ==========================================
  // GO TO ASSET DETAILS
  // ==========================================

  const goToAssetDetails = () => {

    if (onNavigateToAssetDetails) {

      onNavigateToAssetDetails();

    } else {

      setCurrentPage("asset-details");

    }
  };


  // ==========================================
  // GO TO EMPLOYEE STATUS
  // ==========================================

  const goToEmployeeStatus = () => {

    console.log(
      "Navigating to Employee Status"
    );

    if (onNavigateToEmployeeStatus) {

      onNavigateToEmployeeStatus();

    } else {

      setCurrentPage(
        "employee-status"
      );

    }
  };


  // ==========================================
  // GO TO ASSET RETURN
  // ==========================================

  const goToAssetReturn = () => {

    console.log(
      "Navigating to Asset Return"
    );

    if (onNavigateToAssetReturn) {

      onNavigateToAssetReturn();

    } else {

      setCurrentPage(
        "asset-return"
      );

    }
  };


  // ==========================================
  // GO TO ASSIGNMENT
  // ==========================================

  const goToAssignment = () => {

    setCurrentPage("assignment");

    setActiveSidebar(
      "asset-assignment"
    );
  };


  // ==========================================
  // GO TO APPROVAL
  // ==========================================

  const goToApproval = () => {

    setCurrentPage("approval");

    setActiveSidebar(
      "request-approval"
    );
  };


  // ==========================================
  // NEW: GO TO MAINTENANCE
  // ==========================================

  const goToMaintenance = () => {

    console.log(
      "Navigating to Maintenance"
    );

    setCurrentPage(
      "maintenance"
    );

    setActiveSidebar(
      "maintenance"
    );
  };


  // ==========================================
  // SIDEBAR CLICK
  // ==========================================

  const handleSidebarClick = (item) => {

    console.log(
      "Sidebar clicked:",
      item.id
    );

    if (
      item.id ===
      "asset-management"
    ) {

      goToMain();

    }

    else if (
      item.id ===
      "asset-assignment"
    ) {

      goToAssignment();

    }

    else if (
      item.id ===
      "request-approval"
    ) {

      goToApproval();

    }

    else if (
      item.id ===
      "maintenance"
    ) {

      goToMaintenance();

    }

    else if (
      item.id ===
      "dashboard"
    ) {

      goToMain();

    }
  };


  // ==========================================
  // CHILD SIDEBAR NAVIGATION
  // ==========================================

  const handleChildSidebarNavigate = (id) => {

    console.log(
      "Child sidebar navigate:",
      id
    );

    if (
      id ===
      "asset-management"
    ) {

      goToMain();

    }

    else if (
      id ===
      "asset-assignment"
    ) {

      goToAssignment();

    }

    else if (
      id ===
      "request-approval"
    ) {

      goToApproval();

    }

    else if (
      id ===
      "maintenance"
    ) {

      goToMaintenance();

    }

    else if (
      id ===
      "dashboard"
    ) {

      goToMain();

    }
  };


  // ==========================================
  // ADD ASSET PAGE
  // ==========================================

  if (
    currentPage ===
    "add-asset"
  ) {

    return (
      <AddAsset
        username={username}
        onLogout={onLogout}
        onBack={goToMain}
      />
    );
  }


  // ==========================================
  // MANAGE ASSET PAGE
  // ==========================================

  if (
    currentPage ===
    "manage-assets"
  ) {

    return (
      <ManageAsset
        username={username}
        onLogout={onLogout}
        onBack={goToMain}
        onSidebarNavigate={
          handleChildSidebarNavigate
        }
      />
    );
  }


  // ==========================================
  // ASSET DETAILS PAGE
  // ==========================================

  if (
    currentPage ===
    "asset-details"
  ) {

    return (
      <AssetDetails
        username={username}
        onLogout={onLogout}
        onBack={goToMain}
        onSidebarNavigate={
          handleChildSidebarNavigate
        }
      />
    );
  }


  // ==========================================
  // EMPLOYEE STATUS PAGE
  // ==========================================

  if (
    currentPage ===
    "employee-status"
  ) {

    return (
      <EmployeeStatus
        username={username}
        onLogout={onLogout}
        onBack={goToMain}
      />
    );
  }


  // ==========================================
  // ASSET RETURN PAGE
  // ==========================================

  if (
    currentPage ===
    "asset-return"
  ) {

    return (
      <AssetReturn
        username={username}
        onLogout={onLogout}
        onBack={goToMain}
      />
    );
  }


  // ==========================================
  // MAINTENANCE PAGE
  // ==========================================

  if (
    currentPage ===
    "maintenance"
  ) {

    return (
      <Maintenance
        username={username}
        onLogout={onLogout}
        onBack={goToMain}
        onSidebarNavigate={
          handleChildSidebarNavigate
        }
      />
    );
  }


  // ==========================================
  // REQUEST APPROVAL PAGE
  // ==========================================

  if (
    currentPage ===
    "approval"
  ) {

    return (
      <RequestApproval
        username={username}
        onLogout={onLogout}
        onBack={goToMain}
        onSidebarNavigate={
          handleChildSidebarNavigate
        }
      />
    );
  }


  // ==========================================
  // ASSET ASSIGNMENT PAGE
  // ==========================================

  if (
    currentPage ===
    "assignment"
  ) {

    return (
      <AssetAssignment
        username={username}
        onLogout={onLogout}
        onBack={goToMain}
        onSidebarNavigate={
          handleChildSidebarNavigate
        }
      />
    );
  }


  // ==========================================
  // MAIN ASSET MANAGEMENT PAGE
  // ==========================================

  return (

    <div className="am-page-wrapper">


      {/* TOP NAVIGATION */}

      <nav className="am-top-nav">

        <div className="am-nav-logo">

          <span className="am-nav-logo-title">
            ITAMS
          </span>

          <span className="am-nav-logo-sub">
            IT Asset Management System
          </span>

        </div>


        <div className="am-nav-right">

          <span className="am-nav-username">
            {username}
          </span>

          <div className="am-nav-divider" />

          <button
            className="am-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* BODY */}

      <div className="am-body-wrapper">


        {/* SIDEBAR */}

        <aside className="am-sidebar">

          {sidebarItems.map(
            (item) => (

              <div
                key={item.id}

                className={
                  "am-sidebar-item" +
                  (
                    activeSidebar ===
                    item.id
                      ? " am-sidebar-item--active"
                      : ""
                  )
                }

                onClick={() =>
                  handleSidebarClick(item)
                }
              >

                {item.label}

              </div>

            )
          )}

        </aside>


        {/* MAIN CONTENT */}

        <main className="am-main-content">

          <h1 className="am-page-title">
            Asset Management
          </h1>

          <p className="am-page-subtitle">
            Manage and track all IT assets
            in the organization
          </p>


          <div className="am-cards-grid">

            {actionCards.map(
              (card) => (

                <div
                  key={card.id}
                  className="am-card"
                >

                  <h3 className="am-card-title">
                    {card.title}
                  </h3>


                  <p className="am-card-desc">
                    {card.description}
                  </p>


                  <button
                    className="am-card-btn"

                    onClick={() => {

                      if (
                        card.id ===
                        "add-asset"
                      ) {

                        goToAddAsset();

                      }

                      else if (
                        card.id ===
                        "manage-assets"
                      ) {

                        goToManageAssets();

                      }

                      else if (
                        card.id ===
                        "asset-details"
                      ) {

                        goToAssetDetails();

                      }

                      else if (
                        card.id ===
                        "employee-status"
                      ) {

                        goToEmployeeStatus();

                      }

                      else if (
                        card.id ===
                        "asset-return"
                      ) {

                        goToAssetReturn();

                      }

                    }}
                  >

                    {card.buttonLabel}

                  </button>

                </div>

              )
            )}

          </div>

        </main>

      </div>

    </div>
  );
};


export default AssetManagement;
