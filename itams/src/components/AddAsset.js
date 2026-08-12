import React, { useState } from "react";
import "./AddAsset.css";

const ASSET_TYPES = [
  "Laptop",
  "Desktop",
  "Monitor",
  "Keyboard",
  "Mouse",
  "Printer",
  "Headset",
  "Webcam",
  "Scanner",
  "Projector",
  "Tablet",
  "Phone"
];

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

// Validation for Asset ID
const validateAssetId = (id) => {
  if (!id || id.trim() === "") {
    return {
      isValid: false,
      message: "Asset ID is required"
    };
  }

  if (id !== id.trim()) {
    return {
      isValid: false,
      message: "Asset ID should not have leading or trailing spaces"
    };
  }

  if (/\s/.test(id)) {
    return {
      isValid: false,
      message: "Asset ID should not contain spaces"
    };
  }

  if (/[^A-Za-z0-9]/.test(id)) {
    return {
      isValid: false,
      message: "Asset ID should not contain special characters"
    };
  }

  if (!id.startsWith("AST")) {
    return {
      isValid: false,
      message: "Asset ID must start with 'AST'"
    };
  }

  if (id.length !== 6) {
    return {
      isValid: false,
      message:
        "Asset ID must be exactly 6 characters long (AST + 3 alphanumeric characters)"
    };
  }

  const lastThree = id.substring(3);

  if (!/^[A-Za-z0-9]{3}$/.test(lastThree)) {
    return {
      isValid: false,
      message:
        "Last 3 characters must be alphanumeric (letters or numbers)"
    };
  }

  return {
    isValid: true,
    message: ""
  };
};


// Validation for Asset Type
const validateAssetType = (type) => {
  if (!type) {
    return {
      isValid: false,
      message: "Asset type is required"
    };
  }

  if (!ASSET_TYPES.includes(type)) {
    return {
      isValid: false,
      message: "Please select a valid asset type"
    };
  }

  return {
    isValid: true,
    message: ""
  };
};


// Validation for Brand
const validateBrand = (brand) => {
  if (!brand || brand.trim() === "") {
    return {
      isValid: false,
      message: "Brand is required"
    };
  }

  if (brand.trim().length < 2) {
    return {
      isValid: false,
      message: "Brand must be at least 2 characters long"
    };
  }

  if (brand.trim().length > 50) {
    return {
      isValid: false,
      message: "Brand cannot exceed 50 characters"
    };
  }

  if (/[^A-Za-z0-9\s.-]/.test(brand.trim())) {
    return {
      isValid: false,
      message: "Brand contains invalid characters"
    };
  }

  return {
    isValid: true,
    message: ""
  };
};


// Warranty Expiry Validation
// REJECTS PAST DATES
const validateWarrantyExpiry = (date) => {
  if (!date) {
    return {
      isValid: false,
      message: "Warranty expiry date is required"
    };
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const selectedDate = new Date(date);

  selectedDate.setHours(0, 0, 0, 0);

  // Reject past dates
  if (selectedDate < today) {
    return {
      isValid: false,
      message:
        "Warranty expiry date cannot be in the past. Please select today or a future date."
    };
  }

  // Maximum 5 years from today
  const maxDate = new Date();

  maxDate.setFullYear(maxDate.getFullYear() + 5);

  if (selectedDate > maxDate) {
    return {
      isValid: false,
      message:
        "Warranty expiry date cannot exceed 5 years from today"
    };
  }

  return {
    isValid: true,
    message: ""
  };
};


// ==========================================
// PURCHASE COST VALIDATION
// ==========================================

const validatePurchaseCost = (cost) => {

  // Required
  if (!cost || cost.trim() === "") {
    return {
      isValid: false,
      message: "Purchase cost is required"
    };
  }

  const num = Number(cost);

  // Must be a number
  if (isNaN(num)) {
    return {
      isValid: false,
      message: "Purchase cost must be a valid number"
    };
  }

  // MUST BE GREATER THAN ZERO
  if (num <= 0) {
    return {
      isValid: false,
      message: "Purchase cost must be greater than 0"
    };
  }

  // Maximum purchase cost
  if (num > 999999) {
    return {
      isValid: false,
      message: "Purchase cost cannot exceed 999,999"
    };
  }

  // Whole number only
  if (num % 1 !== 0) {
    return {
      isValid: false,
      message: "Purchase cost must be a whole number"
    };
  }

  return {
    isValid: true,
    message: ""
  };
};


// ==========================================
// ASSET ID GENERATOR
// ==========================================

const generateAssetId = () => {

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let result = "";

  for (let i = 0; i < 3; i++) {

    result += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return `AST${result}`;
};


// ==========================================
// MAIN COMPONENT
// ==========================================

const AddAsset = ({
  username = "username",
  onLogout,
  onBack
}) => {

  const [assetId, setAssetId] =
    useState(generateAssetId);

  const [form, setForm] = useState({
    assetType: "",
    brand: "",
    warrantyExpiry: "",
    purchaseCost: ""
  });

  const [errors, setErrors] = useState({});

  const [successMsg, setSuccessMsg] =
    useState("");


  // ==========================================
  // REGENERATE ASSET ID
  // ==========================================

  const regenerateAssetId = () => {

    setAssetId(generateAssetId());

  };


  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));

    setSuccessMsg("");
  };


  // ==========================================
  // VALIDATE FORM
  // ==========================================

  const validateForm = () => {

    const newErrors = {};


    // Asset ID
    const idResult =
      validateAssetId(assetId);

    if (!idResult.isValid) {

      newErrors.assetId =
        idResult.message;
    }


    // Asset Type
    const typeResult =
      validateAssetType(form.assetType);

    if (!typeResult.isValid) {

      newErrors.assetType =
        typeResult.message;
    }


    // Brand
    const brandResult =
      validateBrand(form.brand);

    if (!brandResult.isValid) {

      newErrors.brand =
        brandResult.message;
    }


    // Warranty
    const warrantyResult =
      validateWarrantyExpiry(
        form.warrantyExpiry
      );

    if (!warrantyResult.isValid) {

      newErrors.warrantyExpiry =
        warrantyResult.message;
    }


    // Purchase Cost
    const costResult =
      validatePurchaseCost(
        form.purchaseCost
      );

    if (!costResult.isValid) {

      newErrors.purchaseCost =
        costResult.message;
    }


    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  // ==========================================
  // HANDLE SUBMIT
  // ==========================================

  const handleSubmit = (e) => {

    e.preventDefault();


    if (!validateForm()) {

      const firstError =
        document.querySelector(
          ".aa-input--error"
        );

      if (firstError) {

        firstError.focus();
      }

      return;
    }


    // Success message
    setSuccessMsg(
      `✅ Asset ${assetId} added successfully!`
    );


    // Clear form after successful submission
    setForm({
      assetType: "",
      brand: "",
      warrantyExpiry: "",
      purchaseCost: ""
    });


    // Generate new Asset ID
    setAssetId(generateAssetId());


    // Remove success message after 5 seconds
    setTimeout(
      () => setSuccessMsg(""),
      5000
    );
  };


  // ==========================================
  // CLEAR FORM
  // ==========================================

  const handleClear = () => {

    setForm({
      assetType: "",
      brand: "",
      warrantyExpiry: "",
      purchaseCost: ""
    });

    setErrors({});

    setSuccessMsg("");

    setAssetId(generateAssetId());
  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="aa-page-wrapper">

      {/* =====================================
          TOP NAVIGATION
          ===================================== */}

      <nav className="aa-top-nav">

        <div className="aa-nav-logo">

          <span className="aa-nav-logo-title">
            ITAMS
          </span>

          <span className="aa-nav-logo-sub">
            IT Asset Management System
          </span>

        </div>


        <div className="aa-nav-right">

          <span className="aa-nav-username">
            {username}
          </span>

          <div className="aa-nav-divider" />

          <button
            className="aa-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* =====================================
          PAGE BODY
          ===================================== */}

      <div className="aa-body">

        <h1 className="aa-page-title">
          Add Asset
        </h1>

        <p className="aa-page-subtitle">
          Add a new asset to the inventory.
        </p>


        {/* SUCCESS MESSAGE */}

        {successMsg && (
          <div className="aa-success-msg">
            {successMsg}
          </div>
        )}


        {/* ===================================
            FORM
            =================================== */}

        <form
          className="aa-card"
          onSubmit={handleSubmit}
          noValidate
        >

          <h2 className="aa-card-heading">
            Add Asset Details
          </h2>


          {/* =================================
              ASSET ID
              ================================= */}

          <div className="aa-field-full">

            <label className="aa-label">
              Asset ID (Automatically Generated)
            </label>


            <div className="aa-asset-id-container">

              <input
                className={`aa-input aa-input--readonly ${
                  errors.assetId
                    ? "aa-input--error"
                    : ""
                }`}
                type="text"
                value={assetId}
                readOnly
              />


              <button
                type="button"
                className="aa-regenerate-btn"
                onClick={regenerateAssetId}
                title="Generate new Asset ID"
              >
                🔄
              </button>

            </div>


            {errors.assetId && (
              <span className="aa-error">
                ⚠️ {errors.assetId}
              </span>
            )}


            <div className="aa-validation-hint">

              <small>
                Format: AST + 3 alphanumeric
                characters
                (e.g., AST001, ASTA12, AST1AB)
              </small>

            </div>

          </div>


          {/* =================================
              ASSET NAME + ASSET TYPE
              ================================= */}

          <div className="aa-row">


            {/* Asset Type */}

            <div className="aa-field-group">

              <label className="aa-label">
                Asset Type *
              </label>


              <select
                className={`aa-select${
                  errors.assetType
                    ? " aa-input--error"
                    : ""
                }`}
                name="assetType"
                value={form.assetType}
                onChange={handleChange}
              >

                <option value="">
                  Select Asset Type
                </option>

                {ASSET_TYPES.map((t) => (

                  <option
                    key={t}
                    value={t}
                  >
                    {t}
                  </option>

                ))}

              </select>


              {errors.assetType && (
                <span className="aa-error">
                  ⚠️ {errors.assetType}
                </span>
              )}

            </div>

          </div>


          {/* =================================
              BRAND + WARRANTY
              ================================= */}

          <div className="aa-row">

            {/* Brand */}

            <div className="aa-field-group">

              <label className="aa-label">
                Brand *
              </label>


              <input
                className={`aa-input${
                  errors.brand
                    ? " aa-input--error"
                    : ""
                }`}
                type="text"
                name="brand"
                placeholder="Enter Brand"
                value={form.brand}
                onChange={handleChange}
              />


              {errors.brand && (
                <span className="aa-error">
                  ⚠️ {errors.brand}
                </span>
              )}

            </div>


            {/* Warranty */}

            <div className="aa-field-group">

              <label className="aa-label">
                Warranty Expiry Date *
              </label>


              <input
                className={`aa-input${
                  errors.warrantyExpiry
                    ? " aa-input--error"
                    : ""
                }`}
                type="date"
                name="warrantyExpiry"
                value={form.warrantyExpiry}
                onChange={handleChange}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
              />


              {errors.warrantyExpiry && (
                <span className="aa-error">
                  ⚠️ {errors.warrantyExpiry}
                </span>
              )}


              <div className="aa-validation-hint">

                <small>
                  ⚠️ Past dates are not allowed.
                  Select today or a future date.
                </small>

              </div>

            </div>

          </div>


          {/* =================================
              PURCHASE COST
              ================================= */}

          <div className="aa-row">

            <div className="aa-field-group">

              <label className="aa-label">
                Purchase Cost *
              </label>


              <input
                className={`aa-input${
                  errors.purchaseCost
                    ? " aa-input--error"
                    : ""
                }`}
                type="text"
                name="purchaseCost"
                placeholder="Enter Purchase Cost (e.g., 50000)"
                value={form.purchaseCost}
                onChange={handleChange}
              />


              {errors.purchaseCost && (
                <span className="aa-error">
                  ⚠️ {errors.purchaseCost}
                </span>
              )}

            </div>


            <div className="aa-field-group aa-field-group--empty" />

          </div>


          {/* =================================
              DIVIDER
              ================================= */}

          <div className="aa-divider" />


          {/* =================================
              FORM BUTTONS
              ================================= */}

          <div className="aa-form-actions">

            <button
              type="submit"
              className="aa-btn-primary"
            >
              Add Asset
            </button>


            <button
              type="button"
              className="aa-btn-outline"
              onClick={handleClear}
            >
              Clear
            </button>

          </div>

        </form>


        {/* =================================
            BACK BUTTON
            ================================= */}

        <div className="aa-back-wrapper">

          <button
            className="aa-btn-back"
            onClick={onBack}
          >
            ← Back
          </button>

        </div>

      </div>

    </div>
  );
};

export default AddAsset;
