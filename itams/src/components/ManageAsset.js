import React, { useEffect, useState } from "react";
import "./ManageAsset.css";

const ASSET_TYPES = [
  "All Assets",
  "Monitor",
  "Keyboard",
  "Laptop",
  "Mouse",
  "Printer",
  "Desktop",
  "Webcam",
  "Scanner",
  "Projector",
];

const ROWS_PER_PAGE_OPTIONS = [10, 30, 50, "All"];

const API_URL = "http://localhost:5000/api/assets";

/* =========================================================
   DEMO DATA
========================================================= */

const DEMO_ASSETS = [
  {
    asset_id: "LAP001",
    asset_type: "Laptop",
    model: "HP Laptop",
    purchase_date: "2026-02-15",
    warranty_expiry: "2028-02-15",
    description:
      "Business laptop with Intel i5 processor, 16GB RAM, 512GB SSD.",
  },
  {
    asset_id: "MON001",
    asset_type: "Monitor",
    model: 'Dell 24" Monitor',
    purchase_date: "2026-01-10",
    warranty_expiry: "2028-01-10",
    description:
      "24-inch Full HD LED monitor for office workstation.",
  },
  {
    asset_id: "KEY001",
    asset_type: "Keyboard",
    model: "Logitech Keyboard",
    purchase_date: "2026-03-05",
    warranty_expiry: "2028-03-05",
    description:
      "USB wired keyboard for desktop workstation.",
  },
  {
    asset_id: "MOU001",
    asset_type: "Mouse",
    model: "HP Mouse",
    purchase_date: "2026-04-12",
    warranty_expiry: "2028-04-12",
    description:
      "USB optical mouse for office computer.",
  },
  {
    asset_id: "PRI001",
    asset_type: "Printer",
    model: "Canon Printer",
    purchase_date: "2026-05-20",
    warranty_expiry: "2028-05-20",
    description:
      "Laser printer for office document printing.",
  },
  {
    asset_id: "DES001",
    asset_type: "Desktop",
    model: "HP ProDesk 400",
    purchase_date: "2026-01-25",
    warranty_expiry: "2029-01-25",
    description:
      "Business desktop computer with Intel i5 processor and 16GB RAM.",
  },
];

/* =========================================================
   VALIDATE ASSET ID
========================================================= */

const validateAssetId = (id) => {
  if (!id || id.trim() === "") {
    return {
      isValid: false,
      message: "Asset ID is required",
    };
  }

  if (id !== id.trim()) {
    return {
      isValid: false,
      message: "Asset ID should not have leading or trailing spaces",
    };
  }

  if (/\s/.test(id)) {
    return {
      isValid: false,
      message: "Asset ID should not contain spaces",
    };
  }

  if (id.length !== 6) {
    return {
      isValid: false,
      message: "Asset ID must be exactly 6 characters (e.g., LAP001)",
    };
  }

  if (!/^[A-Za-z]{3}[0-9]{3}$/.test(id)) {
    return {
      isValid: false,
      message:
        "Asset ID must contain 3 letters followed by 3 numbers (e.g., LAP001)",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/* =========================================================
   VALIDATE ASSET TYPE
========================================================= */

const validateAssetType = (type) => {
  if (!type || type === "All Assets") {
    return {
      isValid: false,
      message: "Please select a valid asset type",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/* =========================================================
   VALIDATE MODEL
========================================================= */

const validateModel = (model) => {
  const value = model.trim();

  if (!value) {
    return {
      isValid: false,
      message: "Model is required",
    };
  }

  if (value.length < 2) {
    return {
      isValid: false,
      message: "Model must contain at least 2 characters",
    };
  }

  if (value.length > 50) {
    return {
      isValid: false,
      message: "Model cannot exceed 50 characters",
    };
  }

  if (model !== value) {
    return {
      isValid: false,
      message: "Model should not have leading or trailing spaces",
    };
  }

  // FIXED: removed unnecessary escape before _
  if (!/^[A-Za-z0-9 .&()/\\_-]+$/.test(value)) {
    return {
      isValid: false,
      message:
        "Model can contain letters, numbers, spaces and basic symbols only",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/* =========================================================
   VALIDATE DESCRIPTION
========================================================= */

const validateDescription = (description) => {
  const value = description.trim();

  if (!value) {
    return {
      isValid: false,
      message: "Description is required",
    };
  }

  if (value.length < 10) {
    return {
      isValid: false,
      message: "Description must contain at least 10 characters",
    };
  }

  if (value.length > 500) {
    return {
      isValid: false,
      message: "Description cannot exceed 500 characters",
    };
  }

  if (description !== value) {
    return {
      isValid: false,
      message:
        "Description should not have leading or trailing spaces",
    };
  }

  if (/\s{2,}/.test(value)) {
    return {
      isValid: false,
      message:
        "Description should not contain multiple consecutive spaces",
    };
  }

  if (!/[A-Za-z0-9]/.test(value)) {
    return {
      isValid: false,
      message:
        "Description must contain at least one letter or number",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/* =========================================================
   VALIDATE PURCHASE DATE
========================================================= */

const validatePurchaseDate = (date) => {
  if (!date) {
    return {
      isValid: false,
      message: "Purchase date is required",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    return {
      isValid: false,
      message: "Purchase date cannot be in the future",
    };
  }

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 10);

  if (selectedDate < maxDate) {
    return {
      isValid: false,
      message: "Purchase date cannot be older than 10 years",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

/* =========================================================
   VALIDATE WARRANTY EXPIRY
========================================================= */

const validateWarrantyExpiry = (date, purchaseDate) => {
  if (!date) {
    return {
      isValid: false,
      message: "Warranty expiry date is required",
    };
  }

  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 5);

  if (selectedDate > maxDate) {
    return {
      isValid: false,
      message:
        "Warranty expiry date cannot exceed 5 years from today",
    };
  }

  if (purchaseDate) {
    const purchase = new Date(purchaseDate);
    purchase.setHours(0, 0, 0, 0);

    if (selectedDate < purchase) {
      return {
        isValid: false,
        message:
          "Warranty expiry date must be after purchase date",
      };
    }
  }

  return {
    isValid: true,
    message: "",
  };
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const ManageAsset = ({
  username = "username",
  onLogout,
  onBack,
}) => {
  /* =====================================================
     SEARCH STATE
  ===================================================== */

  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("All Assets");
  const [appliedName, setAppliedName] = useState("");
  const [appliedType, setAppliedType] = useState("All Assets");
  const [searchError, setSearchError] = useState("");
  const [showFieldError, setShowFieldError] = useState(false);

  /* =====================================================
     DATABASE / DEMO ASSETS
  ===================================================== */

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* =====================================================
     EDIT STATE
  ===================================================== */

  const [editingAssetId, setEditingAssetId] = useState(null);
  const [isEditPage, setIsEditPage] = useState(false);
  const [editType, setEditType] = useState("");
  const [editPurchaseDate, setEditPurchaseDate] = useState("");
  const [editWarrantyExpiry, setEditWarrantyExpiry] =
    useState("");
  const [editModel, setEditModel] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editErrors, setEditErrors] = useState({});

  /* =====================================================
     DELETE STATE
  ===================================================== */

  const [deleteAsset, setDeleteAsset] = useState(null);

  /* =====================================================
     GET TOKEN
  ===================================================== */

  const getToken = () => {
    return localStorage.getItem("token");
  };

  /* =====================================================
     FETCH ASSETS
  ===================================================== */

  const fetchAssets = async (
    search = "",
    type = "All Assets"
  ) => {
    try {
      setLoading(true);

      const token = getToken();

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (type && type !== "All Assets") {
        params.append("type", type);
      }

      const queryString = params.toString();

      const url = queryString
        ? `${API_URL}?${queryString}`
        : API_URL;

      /* =================================================
         NO TOKEN → DEMO DATA
      ================================================= */

      if (!token) {
        console.log("No token found. Using demo assets.");

        setAssets(DEMO_ASSETS);
        setIsDemoMode(true);

        return;
      }

      const response = await fetch(url, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Get Assets Response:", data);

      /* =================================================
         SESSION EXPIRED
      ================================================= */

      if (response.status === 401) {
        alert("Session expired. Please login again.");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (onLogout) {
          onLogout();
        }

        return;
      }

      /* =================================================
         NO PERMISSION
      ================================================= */

      if (response.status === 403) {
        alert(
          "You do not have permission to access assets."
        );

        return;
      }

      /* =================================================
         BACKEND ERROR
      ================================================= */

      if (!response.ok || !data.success) {
        console.log(
          "Backend unavailable. Using demo assets."
        );

        setAssets(DEMO_ASSETS);
        setIsDemoMode(true);

        return;
      }

      /* =================================================
         BACKEND HAS DATA
      ================================================= */

      if (data.assets && data.assets.length > 0) {
        setAssets(data.assets);
        setIsDemoMode(false);
      } else {
        setAssets(DEMO_ASSETS);
        setIsDemoMode(true);
      }
    } catch (error) {
      console.error("Fetch Assets Error:", error);

      setAssets(DEMO_ASSETS);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD ASSETS
  ===================================================== */

  useEffect(() => {
    fetchAssets();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearch = () => {
    setSearchError("");
    setShowFieldError(false);

    const searchValue = searchName.trim();

    /* BOTH EMPTY */

    if (
      !searchValue &&
      searchType === "All Assets"
    ) {
      setSearchError(
        "Please enter an Asset ID or select an Asset Type to search"
      );

      setShowFieldError(true);

      setAppliedName("");
      setAppliedType("All Assets");

      fetchAssets();

      return;
    }

    /* ONLY TYPE */

    if (
      !searchValue &&
      searchType !== "All Assets"
    ) {
      setAppliedName("");
      setAppliedType(searchType);

      fetchAssets("", searchType);

      return;
    }

    /* ASSET ID VALIDATION */

    if (searchValue) {
      const result = validateAssetId(searchValue);

      if (!result.isValid) {
        setSearchError(result.message);

        setShowFieldError(true);

        return;
      }
    }

    /* APPLY SEARCH */

    setAppliedName(searchValue);
    setAppliedType(searchType);

    if (isDemoMode) {
      return;
    }

    fetchAssets(searchValue, searchType);
  };

  /* =====================================================
     SEARCH INPUT
  ===================================================== */

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);

    setSearchError("");
    setShowFieldError(false);
  };

  /* =====================================================
     ENTER KEY
  ===================================================== */

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  /* =====================================================
     TYPE CHANGE
  ===================================================== */

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);

    setSearchError("");
    setShowFieldError(false);
  };

  /* =====================================================
     FRONTEND FILTER
  ===================================================== */

  const filteredAssets = assets.filter((asset) => {
    const idMatch = appliedName
      ? asset.asset_id
          ?.toLowerCase()
          .includes(appliedName.toLowerCase())
      : true;

    const typeMatch =
      appliedType === "All Assets"
        ? true
        : asset.asset_type === appliedType;

    return idMatch && typeMatch;
  });

  /* =====================================================
     DISPLAY ROWS
  ===================================================== */

  const displayedAssets =
    rowsPerPage === "All"
      ? filteredAssets
      : filteredAssets.slice(0, rowsPerPage);

  /* =====================================================
     OPEN EDIT PAGE
  ===================================================== */

  const openEditPage = (asset) => {
    setEditingAssetId(asset.asset_id);

    setIsEditPage(true);

    setEditType(asset.asset_type || "");

    setEditModel(asset.model || "");

    setEditDescription(asset.description || "");

    setEditPurchaseDate(
      asset.purchase_date
        ? String(asset.purchase_date).substring(0, 10)
        : ""
    );

    setEditWarrantyExpiry(
      asset.warranty_expiry
        ? String(asset.warranty_expiry).substring(0, 10)
        : ""
    );

    setEditErrors({});
  };

  /* =====================================================
     CLOSE EDIT PAGE
  ===================================================== */

  const closeEditPage = () => {
    setIsEditPage(false);
    setEditingAssetId(null);

    setEditType("");
    setEditModel("");
    setEditDescription("");
    setEditPurchaseDate("");
    setEditWarrantyExpiry("");

    setEditErrors({});
  };

  /* =====================================================
     EDIT MODEL CHANGE
  ===================================================== */

  const handleEditModelChange = (e) => {
    const value = e.target.value;

    setEditModel(value);

    if (editErrors.editModel) {
      setEditErrors((prev) => ({
        ...prev,
        editModel: "",
      }));
    }
  };

  /* =====================================================
     EDIT DESCRIPTION CHANGE
  ===================================================== */

  const handleEditDescriptionChange = (e) => {
    const value = e.target.value;

    setEditDescription(value);

    if (editErrors.editDescription) {
      setEditErrors((prev) => ({
        ...prev,
        editDescription: "",
      }));
    }
  };

  /* =====================================================
     VALIDATE EDIT FORM
  ===================================================== */

  const validateEditForm = () => {
    const newErrors = {};

    const typeResult = validateAssetType(editType);

    if (!typeResult.isValid) {
      newErrors.editType = typeResult.message;
    }

    const modelResult = validateModel(editModel);

    if (!modelResult.isValid) {
      newErrors.editModel = modelResult.message;
    }

    const purchaseResult =
      validatePurchaseDate(editPurchaseDate);

    if (!purchaseResult.isValid) {
      newErrors.editPurchaseDate =
        purchaseResult.message;
    }

    const warrantyResult =
      validateWarrantyExpiry(
        editWarrantyExpiry,
        editPurchaseDate
      );

    if (!warrantyResult.isValid) {
      newErrors.editWarrantyExpiry =
        warrantyResult.message;
    }

    const descriptionResult =
      validateDescription(editDescription);

    if (!descriptionResult.isValid) {
      newErrors.editDescription =
        descriptionResult.message;
    }

    setEditErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =====================================================
     SAVE EDIT
  ===================================================== */

  const saveEdit = async () => {
    if (!validateEditForm()) {
      setTimeout(() => {
        const firstError =
          document.querySelector(".ma-input--error");

        if (firstError) {
          firstError.focus();
        }
      }, 100);

      return;
    }

    /* DEMO MODE */

    if (isDemoMode) {
      setAssets((prev) =>
        prev.map((asset) =>
          asset.asset_id === editingAssetId
            ? {
                ...asset,
                asset_type: editType,
                model: editModel.trim(),
                purchase_date: editPurchaseDate,
                warranty_expiry: editWarrantyExpiry,
                description: editDescription.trim(),
              }
            : asset
        )
      );

      alert(
        `Asset ${editingAssetId} updated successfully!`
      );

      closeEditPage();

      return;
    }

    /* DATABASE UPDATE */

    try {
      const token = getToken();

      if (!token) {
        alert(
          "Login session expired. Please login again."
        );

        return;
      }

      const response = await fetch(
        `${API_URL}/${editingAssetId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            assetType: editType,
            model: editModel.trim(),
            purchaseDate: editPurchaseDate,
            warrantyExpiry: editWarrantyExpiry,
            description: editDescription.trim(),
          }),
        }
      );

      const data = await response.json();

      console.log("Update Asset Response:", data);

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Failed to update asset."
        );

        return;
      }

      alert(
        `Asset ${editingAssetId} updated successfully!`
      );

      closeEditPage();

      fetchAssets(appliedName, appliedType);
    } catch (error) {
      console.error("Update Asset Error:", error);

      alert("Unable to connect to backend.");
    }
  };

  /* =====================================================
     OPEN DELETE POPUP
  ===================================================== */

  const openDelete = (asset) => {
    setDeleteAsset(asset);
  };

  /* =====================================================
     DELETE ASSET
  ===================================================== */

  const confirmDelete = async () => {
    if (!deleteAsset) {
      return;
    }

    /* DEMO MODE DELETE */

    if (isDemoMode) {
      const deletedId = deleteAsset.asset_id;

      setAssets((prev) =>
        prev.filter(
          (asset) => asset.asset_id !== deletedId
        )
      );

      setDeleteAsset(null);

      alert(
        `Asset ${deletedId} deleted successfully!`
      );

      return;
    }

    /* DATABASE DELETE */

    try {
      const token = getToken();

      if (!token) {
        alert(
          "Login session expired. Please login again."
        );

        return;
      }

      const response = await fetch(
        `${API_URL}/${deleteAsset.asset_id}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Delete Asset Response:", data);

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Failed to delete asset."
        );

        return;
      }

      alert(
        `Asset ${deleteAsset.asset_id} deleted successfully!`
      );

      setDeleteAsset(null);

      fetchAssets(appliedName, appliedType);
    } catch (error) {
      console.error("Delete Asset Error:", error);

      alert("Unable to connect to backend.");
    }
  };

  /* =====================================================
     RENDER EDIT PAGE
  ===================================================== */

  const renderEditPage = () => {
    return (
      <div className="ma-edit-page-wrapper">
        <div className="ma-edit-page-container">

          <div className="ma-edit-page-header">
            <h2 className="ma-edit-page-title">
              Edit Asset
            </h2>

            <p>
              Edit the details of the asset
              and update the information.
            </p>
          </div>

          <div className="ma-edit-form">

            {/* ASSET ID */}

            <div className="ma-modal-field">
              <label className="ma-field-label">
                Asset ID
              </label>

              <input
                className="ma-input ma-input--readonly"
                type="text"
                value={editingAssetId || ""}
                readOnly
              />
            </div>

            {/* ASSET TYPE */}

            <div className="ma-modal-field">
              <label className="ma-field-label">
                Asset Type *
              </label>

              <select
                className={`ma-select ${
                  editErrors.editType
                    ? "ma-input--error"
                    : ""
                }`}
                value={editType}
                onChange={(e) => {
                  setEditType(e.target.value);

                  setEditErrors((prev) => ({
                    ...prev,
                    editType: "",
                  }));
                }}
              >
                <option value="">
                  Select Asset Type
                </option>

                {ASSET_TYPES
                  .filter(
                    (type) =>
                      type !== "All Assets"
                  )
                  .map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
              </select>

              {editErrors.editType && (
                <span className="ma-error-text">
                  ⚠️ {editErrors.editType}
                </span>
              )}
            </div>

            {/* MODEL */}

            <div className="ma-modal-field">
              <label className="ma-field-label">
                Model *
              </label>

              <input
                className={`ma-input ${
                  editErrors.editModel
                    ? "ma-input--error"
                    : ""
                }`}
                type="text"
                value={editModel}
                maxLength={50}
                placeholder="Enter Model"
                onChange={handleEditModelChange}
              />

              {editErrors.editModel && (
                <span className="ma-error-text">
                  ⚠️ {editErrors.editModel}
                </span>
              )}
            </div>

            {/* PURCHASE DATE */}

            <div className="ma-modal-field">
              <label className="ma-field-label">
                Purchase Date *
              </label>

              <input
                className={`ma-input ${
                  editErrors.editPurchaseDate
                    ? "ma-input--error"
                    : ""
                }`}
                type="date"
                value={editPurchaseDate}
                onChange={(e) => {
                  setEditPurchaseDate(
                    e.target.value
                  );

                  setEditErrors((prev) => ({
                    ...prev,
                    editPurchaseDate: "",
                    editWarrantyExpiry: "",
                  }));
                }}
              />

              {editErrors.editPurchaseDate && (
                <span className="ma-error-text">
                  ⚠️ {editErrors.editPurchaseDate}
                </span>
              )}
            </div>

            {/* WARRANTY */}

            <div className="ma-modal-field">
              <label className="ma-field-label">
                Warranty Expiry Date *
              </label>

              <input
                className={`ma-input ${
                  editErrors.editWarrantyExpiry
                    ? "ma-input--error"
                    : ""
                }`}
                type="date"
                value={editWarrantyExpiry}
                onChange={(e) => {
                  setEditWarrantyExpiry(
                    e.target.value
                  );

                  setEditErrors((prev) => ({
                    ...prev,
                    editWarrantyExpiry: "",
                  }));
                }}
              />

              {editErrors.editWarrantyExpiry && (
                <span className="ma-error-text">
                  ⚠️ {editErrors.editWarrantyExpiry}
                </span>
              )}
            </div>

            {/* DESCRIPTION */}

            <div className="ma-modal-field">
              <label className="ma-field-label">
                Description *
              </label>

              <textarea
                className={`ma-input ${
                  editErrors.editDescription
                    ? "ma-input--error"
                    : ""
                }`}
                rows="4"
                maxLength={500}
                placeholder="Enter Description"
                value={editDescription}
                onChange={
                  handleEditDescriptionChange
                }
              />

              <div
                style={{
                  textAlign: "right",
                  fontSize: "12px",
                  color: "#777",
                  marginTop: "4px",
                }}
              >
                {editDescription.length}/500
              </div>

              {editErrors.editDescription && (
                <span className="ma-error-text">
                  ⚠️ {editErrors.editDescription}
                </span>
              )}
            </div>

            {/* ACTIONS */}

            <div className="ma-edit-actions">
              <button
                type="button"
                className="ma-edit-cancel-btn"
                onClick={closeEditPage}
              >
                Cancel
              </button>

              <button
                type="button"
                className="ma-edit-save-btn"
                onClick={saveEdit}
              >
                Update Asset
              </button>
            </div>
          </div>

          <button
            type="button"
            className="ma-back-btn"
            onClick={closeEditPage}
          >
            ← Back
          </button>

        </div>
      </div>
    );
  };

  /* =====================================================
     EDIT PAGE
  ===================================================== */

  if (isEditPage) {
    return renderEditPage();
  }

  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <div className="ma-page-wrapper">

      {/* TOP NAVBAR */}

      <nav className="ma-top-nav">
        <div className="ma-nav-logo">
          <span className="ma-nav-logo-title">
            ITAMS
          </span>

          <span className="ma-nav-logo-sub">
            IT Asset Management System
          </span>
        </div>

        <div className="ma-nav-right">
          <span className="ma-nav-username">
            {username}
          </span>

          <div className="ma-nav-divider" />

          <button
            className="ma-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN */}

      <div className="ma-body-wrapper">
        <main className="ma-main-content">

          <h1 className="ma-page-title">
            Manage Asset
          </h1>

          <p className="ma-page-subtitle">
            Edit or delete existing IT
            assets in the organization.
          </p>

          {/* DEMO MODE MESSAGE */}

          {isDemoMode && (
            <div
              style={{
                padding: "10px 14px",
                marginBottom: "15px",
                borderRadius: "6px",
                background: "#eef6ff",
                border: "1px solid #b8d8ff",
                color: "#1557a0",
                fontSize: "14px",
              }}
            >
              ℹ️ Demo assets are displayed
              because no database assets
              were found. You can test
              Search, Edit and Delete.
            </div>
          )}

          {/* SEARCH CARD */}

          <div className="ma-card">
            <h2 className="ma-card-heading">
              Search Asset
            </h2>

            <div className="ma-search-row">

              {/* ASSET ID */}

              <div className="ma-field-group">
                <label className="ma-field-label">
                  Asset ID
                </label>

                <input
                  className={`ma-input ${
                    showFieldError
                      ? "ma-input--error"
                      : ""
                  }`}
                  type="text"
                  placeholder="Enter Asset ID (e.g., LAP001)"
                  value={searchName}
                  maxLength={6}
                  onChange={
                    handleSearchNameChange
                  }
                  onKeyDown={
                    handleSearchKeyDown
                  }
                />

                <div className="ma-validation-hint">
                  <small>
                    Format: 3 letters + 3
                    numbers (e.g., LAP001,
                    PIT001, MON001)
                  </small>
                </div>
              </div>

              {/* ASSET TYPE */}

              <div className="ma-field-group">
                <label className="ma-field-label">
                  Asset Type
                </label>

                <select
                  className={`ma-select ${
                    showFieldError
                      ? "ma-input--error"
                      : ""
                  }`}
                  value={searchType}
                  onChange={
                    handleSearchTypeChange
                  }
                >
                  {ASSET_TYPES.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* SEARCH BUTTON */}

              <button
                className="ma-search-btn"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>

            {searchError && (
              <div className="ma-search-error-container">
                <span className="ma-error-text">
                  ⚠️ {searchError}
                </span>
              </div>
            )}
          </div>

          {/* ASSET LIST */}

          <div className="ma-card ma-card--table">
            <h2 className="ma-card-heading">
              Asset List
            </h2>

            <div className="ma-table-wrapper">
              <table className="ma-table">
                <thead>
                  <tr>
                    <th>Asset ID</th>
                    <th>Asset Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="ma-no-data"
                      >
                        Loading assets...
                      </td>
                    </tr>
                  ) : displayedAssets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="ma-no-data"
                      >
                        No assets found.
                      </td>
                    </tr>
                  ) : (
                    displayedAssets.map((asset) => (
                      <tr
                        key={asset.asset_id}
                      >
                        {/* ASSET ID */}

                        <td>
                          <span className="ma-asset-id">
                            {asset.asset_id}
                          </span>
                        </td>

                        {/* TYPE */}

                        <td>
                          <span className="ma-type-badge">
                            {asset.asset_type}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td className="ma-actions-cell">
                          <button
                            type="button"
                            className="ma-btn-edit"
                            onClick={() =>
                              openEditPage(asset)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="ma-btn-delete"
                            onClick={() =>
                              openDelete(asset)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}

            <div className="ma-table-footer">
              <button
                className="ma-back-btn"
                onClick={onBack}
              >
                ← Back
              </button>

              <div className="ma-rows-select-group">
                <span className="ma-pagination-info">
                  Showing{" "}
                  {displayedAssets.length} of{" "}
                  {filteredAssets.length} assets
                </span>

                <select
                  className="ma-rows-select"
                  value={rowsPerPage}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    setRowsPerPage(
                      value === "All"
                        ? "All"
                        : Number(value)
                    );
                  }}
                >
                  {ROWS_PER_PAGE_OPTIONS.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* DELETE CONFIRMATION POPUP */}

      {deleteAsset && (
        <div
          className="ma-modal-overlay"
          onClick={() =>
            setDeleteAsset(null)
          }
        >
          <div
            className="ma-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h2 className="ma-modal-title">
              Delete Asset
            </h2>

            <p className="ma-modal-msg">
              Are you sure you want to
              delete this asset?
            </p>

            {/* ONLY ASSET ID + ASSET NAME */}

            <div className="ma-delete-details">
              <div className="ma-delete-row">
                <span className="ma-delete-label">
                  Asset ID:
                </span>

                <span className="ma-delete-value">
                  {deleteAsset.asset_id}
                </span>
              </div>

              <div className="ma-delete-row">
                <span className="ma-delete-label">
                  Asset Name:
                </span>

                <span className="ma-delete-value">
                  {deleteAsset.model}
                </span>
              </div>
            </div>

            {/* BUTTONS */}

            <div className="ma-modal-actions">
              <button
                type="button"
                className="ma-modal-cancel"
                onClick={() =>
                  setDeleteAsset(null)
                }
              >
                No
              </button>

              <button
                type="button"
                className="ma-modal-delete"
                onClick={confirmDelete}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAsset;
