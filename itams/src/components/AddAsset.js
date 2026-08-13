import React, { useState } from "react";
import "./AddAsset.css";

const API_URL = "http://localhost:5000/api";

const AddAsset = ({
  username = "username",
  onLogout,
  onBack,
}) => {
  // =====================================================
  // FORM DATA
  // =====================================================
  const [formData, setFormData] = useState({
    assetType: "",
    brand: "",
    model: "",
    purchaseCost: "",
    purchaseDate: "",
    warrantyExpiry: "",
    description: "",
  });

  // =====================================================
  // VALIDATION ERRORS
  // =====================================================
  const [errors, setErrors] = useState({});

  // =====================================================
  // SUCCESS / API ERROR
  // =====================================================
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  // =====================================================
  // LOADING
  // =====================================================
  const [loading, setLoading] = useState(false);

  // =====================================================
  // ASSET ID
  // Backend generates the real ID
  // =====================================================
  const [assetId, setAssetId] = useState("AST-000123");

  // =====================================================
  // ASSET TYPES
  // =====================================================
  const assetTypes = [
    "Monitor",
    "Keyboard",
    "Webcam",
    "Projector",
    "Mouse",
    "CPU",
    "Printer",
  ];

  // =====================================================
  // GET TODAY'S DATE
  // =====================================================
  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error when user starts correcting field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setApiError("");
    setSuccessMessage("");
  };

  // =====================================================
  // VALIDATION
  // =====================================================
  const validateForm = () => {
    const newErrors = {};

    // ===================================================
    // ASSET TYPE
    // ===================================================
    if (!formData.assetType) {
      newErrors.assetType =
        "Please select an asset type.";
    }

    // ===================================================
    // BRAND
    // ===================================================
    const brand = formData.brand.trim();

    if (!brand) {
      newErrors.brand = "Brand is required.";
    } else if (brand.length < 2) {
      newErrors.brand =
        "Brand must contain at least 2 characters.";
    } else if (brand.length > 50) {
      newErrors.brand =
        "Brand cannot exceed 50 characters.";
    } else if (brand !== formData.brand) {
      newErrors.brand =
        "Brand should not have leading or trailing spaces.";
    } else if (!/^[A-Za-z0-9 .&-]+$/.test(brand)) {
      newErrors.brand =
        "Brand can contain letters, numbers, spaces, ., &, and - only.";
    }

    // ===================================================
    // MODEL
    // REQUIRED
    // ===================================================
    const model = formData.model.trim();

    if (!model) {
      newErrors.model = "Model is required.";
    } else if (model.length < 2) {
      newErrors.model =
        "Model must contain at least 2 characters.";
    } else if (model.length > 50) {
      newErrors.model =
        "Model cannot exceed 50 characters.";
    } else if (model !== formData.model) {
      newErrors.model =
        "Model should not have leading or trailing spaces.";
    } else if (!/^[A-Za-z0-9 .&()/_-]+$/.test(model)) {
      newErrors.model =
        "Model can contain letters, numbers, spaces and basic symbols only.";
    }

    // ===================================================
    // PURCHASE COST
    // ===================================================
    if (!formData.purchaseCost) {
      newErrors.purchaseCost =
        "Purchase cost is required.";
    } else if (
      !/^\d+(\.\d{1,2})?$/.test(
        formData.purchaseCost
      )
    ) {
      newErrors.purchaseCost =
        "Enter a valid amount. Example: 15000 or 15000.50.";
    } else if (
      Number(formData.purchaseCost) <= 0
    ) {
      newErrors.purchaseCost =
        "Purchase cost must be greater than 0.";
    } else if (
      Number(formData.purchaseCost) > 99999999
    ) {
      newErrors.purchaseCost =
        "Purchase cost is too large.";
    }

    // ===================================================
    // PURCHASE DATE
    // ===================================================
    if (!formData.purchaseDate) {
      newErrors.purchaseDate =
        "Purchase date is required.";
    } else {
      const purchaseDate =
        new Date(formData.purchaseDate);

      const today = new Date();

      today.setHours(23, 59, 59, 999);

      if (purchaseDate > today) {
        newErrors.purchaseDate =
          "Purchase date cannot be a future date.";
      }
    }

    // ===================================================
    // WARRANTY EXPIRY
    // ===================================================
    if (!formData.warrantyExpiry) {
      newErrors.warrantyExpiry =
        "Warranty expiry date is required.";
    } else {
      const warrantyDate =
        new Date(formData.warrantyExpiry);

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (warrantyDate < today) {
        newErrors.warrantyExpiry =
          "Warranty expiry date cannot be in the past.";
      }

      // Warranty must be after purchase date
      if (formData.purchaseDate) {
        const purchaseDate =
          new Date(formData.purchaseDate);

        if (warrantyDate <= purchaseDate) {
          newErrors.warrantyExpiry =
            "Warranty expiry must be after the purchase date.";
        }
      }
    }

    // ===================================================
    // DESCRIPTION
    // REQUIRED
    // ===================================================
    const description =
      formData.description.trim();

    if (!description) {
      newErrors.description =
        "Description is required.";
    } else if (description.length < 5) {
      newErrors.description =
        "Description must contain at least 5 characters.";
    } else if (description.length > 500) {
      newErrors.description =
        "Description cannot exceed 500 characters.";
    } else if (
      description !== formData.description
    ) {
      newErrors.description =
        "Description should not have leading or trailing spaces.";
    } else if (!/[A-Za-z0-9]/.test(description)) {
      newErrors.description =
        "Description must contain at least one letter or number.";
    }

    // ===================================================
    // SET ERRORS
    // ===================================================
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setApiError("");

    // Validate form
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      // =================================================
      // GET JWT TOKEN
      // =================================================
      const token = localStorage.getItem("token");

      if (!token) {
        setApiError(
          "Your session has expired. Please login again."
        );

        setLoading(false);
        return;
      }

      // =================================================
      // DATA SENT TO BACKEND
      // =================================================
      const requestBody = {
        assetType: formData.assetType,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        purchaseCost: Number(
          formData.purchaseCost
        ),
        purchaseDate: formData.purchaseDate,
        warrantyExpiry: formData.warrantyExpiry,
        description:
          formData.description.trim(),
      };

      console.log(
        "Sending asset data:",
        requestBody
      );

      // =================================================
      // API REQUEST
      // =================================================
      const response = await fetch(
        `${API_URL}/assets`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(requestBody),
        }
      );

      // =================================================
      // RESPONSE
      // =================================================
      const data = await response.json();

      console.log(
        "Backend response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add asset."
        );
      }

      // =================================================
      // SET GENERATED ASSET ID
      // =================================================
      if (data.assetId) {
        setAssetId(data.assetId);
      }

      // =================================================
      // SUCCESS MESSAGE
      // =================================================
      setSuccessMessage(
        `Asset added successfully! Asset ID: ${
          data.assetId || "Generated"
        }`
      );

      // =================================================
      // CLEAR FORM AFTER SUCCESS
      // =================================================
      setFormData({
        assetType: "",
        brand: "",
        model: "",
        purchaseCost: "",
        purchaseDate: "",
        warrantyExpiry: "",
        description: "",
      });

      setErrors({});
    } catch (error) {
      console.error(
        "Add Asset Error:",
        error
      );

      setApiError(
        error.message ||
          "Unable to connect to the backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CLEAR FORM
  // =====================================================
  const handleClear = () => {
    setFormData({
      assetType: "",
      brand: "",
      model: "",
      purchaseCost: "",
      purchaseDate: "",
      warrantyExpiry: "",
      description: "",
    });

    setErrors({});
    setSuccessMessage("");
    setApiError("");
    setAssetId("AST-000123");
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="aa-page-wrapper">

      {/* =================================================
          NAVBAR
      ================================================= */}
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

          <div className="aa-nav-divider"></div>

          <button
            type="button"
            className="aa-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* =================================================
          PAGE BODY
      ================================================= */}
      <main className="aa-body">

        <h1 className="aa-page-title">
          Add Asset
        </h1>

        <p className="aa-page-subtitle">
          Add a new asset to the inventory.
        </p>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}
        {successMessage && (
          <div className="aa-success-msg">
            {successMessage}
          </div>
        )}

        {/* =================================================
            API ERROR
        ================================================= */}
        {apiError && (
          <div className="aa-error aa-api-error">
            {apiError}
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}
        <form
          className="aa-card"
          onSubmit={handleSubmit}
          noValidate
        >

          <h2 className="aa-card-heading">
            Add Asset Details
          </h2>

          {/* =================================================
              ASSET ID
          ================================================= */}
          <div className="aa-field-full">

            <label className="aa-label">
              Asset ID (Automatically Generated)
            </label>

            <input
              type="text"
              className="aa-input aa-input--readonly"
              value={assetId}
              readOnly
            />

          </div>

          {/* =================================================
              ASSET TYPE + BRAND
          ================================================= */}
          <div className="aa-row">

            {/* ASSET TYPE */}
            <div className="aa-field-group">

              <label className="aa-label">
                Asset Type
              </label>

              <select
                name="assetType"
                value={formData.assetType}
                onChange={handleChange}
                className={
                  "aa-select" +
                  (errors.assetType
                    ? " aa-input--error"
                    : "")
                }
              >

                <option value="">
                  Select Asset Type
                </option>

                {assetTypes.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}

              </select>

              {errors.assetType && (
                <span className="aa-error">
                  {errors.assetType}
                </span>
              )}

            </div>

            {/* BRAND */}
            <div className="aa-field-group">

              <label className="aa-label">
                Brand
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter Brand"
                maxLength={50}
                className={
                  "aa-input" +
                  (errors.brand
                    ? " aa-input--error"
                    : "")
                }
              />

              {errors.brand && (
                <span className="aa-error">
                  {errors.brand}
                </span>
              )}

            </div>

          </div>

          {/* =================================================
              MODEL + PURCHASE COST
          ================================================= */}
          <div className="aa-row">

            {/* MODEL */}
            <div className="aa-field-group">

              <label className="aa-label">
                Model
              </label>

              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Enter Model"
                maxLength={50}
                className={
                  "aa-input" +
                  (errors.model
                    ? " aa-input--error"
                    : "")
                }
              />

              {errors.model && (
                <span className="aa-error">
                  {errors.model}
                </span>
              )}

            </div>

            {/* PURCHASE COST */}
            <div className="aa-field-group">

              <label className="aa-label">
                Purchase Cost
              </label>

              <input
                type="text"
                name="purchaseCost"
                value={formData.purchaseCost}
                onChange={handleChange}
                placeholder="Enter Purchase Cost"
                inputMode="decimal"
                maxLength={11}
                className={
                  "aa-input" +
                  (errors.purchaseCost
                    ? " aa-input--error"
                    : "")
                }
              />

              {errors.purchaseCost && (
                <span className="aa-error">
                  {errors.purchaseCost}
                </span>
              )}

            </div>

          </div>

          {/* =================================================
              PURCHASE DATE + WARRANTY
          ================================================= */}
          <div className="aa-row">

            {/* PURCHASE DATE */}
            <div className="aa-field-group">

              <label className="aa-label">
                Purchase Date
              </label>

              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                max={getToday()}
                className={
                  "aa-input" +
                  (errors.purchaseDate
                    ? " aa-input--error"
                    : "")
                }
              />

              {errors.purchaseDate && (
                <span className="aa-error">
                  {errors.purchaseDate}
                </span>
              )}

            </div>

            {/* WARRANTY EXPIRY */}
            <div className="aa-field-group">

              <label className="aa-label">
                Warranty Expiry Date
              </label>

              <input
                type="date"
                name="warrantyExpiry"
                value={formData.warrantyExpiry}
                onChange={handleChange}
                min={getToday()}
                className={
                  "aa-input" +
                  (errors.warrantyExpiry
                    ? " aa-input--error"
                    : "")
                }
              />

              {errors.warrantyExpiry && (
                <span className="aa-error">
                  {errors.warrantyExpiry}
                </span>
              )}

            </div>

          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}
          <div className="aa-field-full">

            <label className="aa-label">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter Description"
              maxLength={500}
              rows={4}
              className={
                "aa-input aa-textarea" +
                (errors.description
                  ? " aa-input--error"
                  : "")
              }
            />

            {/* Character Count */}
            <div
              style={{
                textAlign: "right",
                fontSize: "12px",
                color: "#777",
                marginTop: "4px",
              }}
            >
              {formData.description.length}/500
            </div>

            {errors.description && (
              <span className="aa-error">
                {errors.description}
              </span>
            )}

          </div>

          {/* =================================================
              DIVIDER
          ================================================= */}
          <hr className="aa-divider" />

          {/* =================================================
              BUTTONS
          ================================================= */}
          <div className="aa-form-actions">

            <button
              type="submit"
              className="aa-btn-primary"
              disabled={loading}
            >
              {loading
                ? "Adding..."
                : "Add Asset"}
            </button>

            <button
              type="button"
              className="aa-btn-outline"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>

          </div>

        </form>

        {/* =================================================
            BACK BUTTON
        ================================================= */}
        <div className="aa-back-wrapper">

          <button
            type="button"
            className="aa-btn-back"
            onClick={onBack}
            disabled={loading}
          >
            Back
          </button>

        </div>

      </main>

    </div>
  );
};

export default AddAsset;
