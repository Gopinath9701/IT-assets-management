import React, { useState } from "react";
import "./AddAsset.css";

const ASSET_TYPES = ["Monitor", "Keyboard", "Laptop", "Mouse", "Printer", "Other"];

// Simple auto-ID generator
const generateAssetId = () => {
  const num = Math.floor(Math.random() * 900000) + 100000;
  return `AST-${num.toString().slice(0, 6).padStart(6, "0")}`;
};

const AddAsset = ({ username = "username", onLogout, onBack }) => {
  const [assetId] = useState(generateAssetId);

  const [form, setForm] = useState({
    assetName: "",
    assetType: "",
    brand: "",
    warrantyExpiry: "",
    purchaseCost: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccessMsg("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.assetName.trim())      newErrors.assetName     = "Asset Name is required.";
    if (!form.assetType)             newErrors.assetType     = "Asset Type is required.";
    if (!form.brand.trim())          newErrors.brand         = "Brand is required.";
    if (!form.warrantyExpiry)        newErrors.warrantyExpiry = "Warranty Expiry Date is required.";
    if (!form.purchaseCost.trim())   newErrors.purchaseCost  = "Purchase Cost is required.";
    else if (isNaN(Number(form.purchaseCost)) || Number(form.purchaseCost) < 0)
      newErrors.purchaseCost = "Enter a valid cost.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // API call would go here
    setSuccessMsg(`Asset ${assetId} added successfully!`);
    handleClear();
  };

  const handleClear = () => {
    setForm({
      assetName: "",
      assetType: "",
      brand: "",
      warrantyExpiry: "",
      purchaseCost: "",
    });
    setErrors({});
  };

  return (
    <div className="aa-page-wrapper">

      {/* ── Top Navbar ── */}
      <nav className="aa-top-nav">
        <div className="aa-nav-logo">
          <span className="aa-nav-logo-title">ITAMS</span>
          <span className="aa-nav-logo-sub">IT Asset Management System</span>
        </div>
        <div className="aa-nav-right">
          <span className="aa-nav-username">{username}</span>
          <div className="aa-nav-divider" />
          <button className="aa-logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* ── Page Body ── */}
      <div className="aa-body">
        <h1 className="aa-page-title">Add Asset</h1>
        <p className="aa-page-subtitle">Add a new asset to the inventory.</p>

        {successMsg && (
          <div className="aa-success-msg">{successMsg}</div>
        )}

        {/* ── Form Card ── */}
        <form className="aa-card" onSubmit={handleSubmit} noValidate>
          <h2 className="aa-card-heading">Add Asset Details</h2>

          {/* Asset ID — full width, read-only */}
          <div className="aa-field-full">
            <label className="aa-label">
              Asset ID (Automatically Generated)
            </label>
            <input
              className="aa-input aa-input--readonly"
              type="text"
              value={assetId}
              readOnly
            />
          </div>

          {/* Row: Asset Name + Asset Type */}
          <div className="aa-row">
            <div className="aa-field-group">
              <label className="aa-label">Asset Name</label>
              <input
                className={`aa-input${errors.assetName ? " aa-input--error" : ""}`}
                type="text"
                name="assetName"
                placeholder="Enter Asset Name"
                value={form.assetName}
                onChange={handleChange}
              />
              {errors.assetName && (
                <span className="aa-error">{errors.assetName}</span>
              )}
            </div>
            <div className="aa-field-group">
              <label className="aa-label">Asset Type</label>
              <select
                className={`aa-select${errors.assetType ? " aa-input--error" : ""}`}
                name="assetType"
                value={form.assetType}
                onChange={handleChange}
              >
                <option value="">Select Asset Type</option>
                {ASSET_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.assetType && (
                <span className="aa-error">{errors.assetType}</span>
              )}
            </div>
          </div>

          {/* Row: Brand + Warranty Expiry Date */}
          <div className="aa-row">
            <div className="aa-field-group">
              <label className="aa-label">Brand</label>
              <input
                className={`aa-input${errors.brand ? " aa-input--error" : ""}`}
                type="text"
                name="brand"
                placeholder="Enter Brand"
                value={form.brand}
                onChange={handleChange}
              />
              {errors.brand && (
                <span className="aa-error">{errors.brand}</span>
              )}
            </div>
            <div className="aa-field-group">
              <label className="aa-label">Warranty Expiry Date</label>
              <input
                className={`aa-input${errors.warrantyExpiry ? " aa-input--error" : ""}`}
                type="date"
                name="warrantyExpiry"
                placeholder="Select Date"
                value={form.warrantyExpiry}
                onChange={handleChange}
              />
              {errors.warrantyExpiry && (
                <span className="aa-error">{errors.warrantyExpiry}</span>
              )}
            </div>
          </div>

          {/* Row: Purchase Cost — half width */}
          <div className="aa-row">
            <div className="aa-field-group">
              <label className="aa-label">Purchase Cost</label>
              <input
                className={`aa-input${errors.purchaseCost ? " aa-input--error" : ""}`}
                type="text"
                name="purchaseCost"
                placeholder="Enter Purchase Cost"
                value={form.purchaseCost}
                onChange={handleChange}
              />
              {errors.purchaseCost && (
                <span className="aa-error">{errors.purchaseCost}</span>
              )}
            </div>
            {/* empty column to keep half-width */}
            <div className="aa-field-group aa-field-group--empty" />
          </div>

          {/* Divider */}
          <div className="aa-divider" />

          {/* Action buttons */}
          <div className="aa-form-actions">
            <button type="submit" className="aa-btn-primary">
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

        {/* Back button — outside card */}
        <div className="aa-back-wrapper">
          <button className="aa-btn-back" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAsset;
