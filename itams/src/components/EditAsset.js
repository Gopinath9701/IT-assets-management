import React, { useState } from "react";
import "./EditAsset.css";

const ASSET_TYPES = ["Monitor", "Keyboard", "Laptop", "Mouse", "Printer", "Desktop", "Projector", "Network", "Other"];

// Default asset shown when no asset is passed (mirrors PDF: AST002 HP Laptop)
const DEFAULT_ASSET = {
  id: "AST002",
  name: "HP Laptop",
  type: "Laptop",
  purchaseDate: "2026-02-15",
  warrantyExpiry: "2028-02-15",
};

const EditAsset = ({ username = "username", onLogout, onBack, asset }) => {
  const [activeSidebar, setActiveSidebar] = useState("asset-management");

  const source = asset || DEFAULT_ASSET;

  const [form, setForm] = useState({
    assetName:      source.name          || "",
    assetType:      source.type          || "",
    purchaseDate:   source.purchaseDate  || "",
    warrantyExpiry: source.warrantyExpiry || "",
  });

  const [errors, setErrors]       = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const sidebarItems = [
    { id: "dashboard",        label: "Dashboard"        },
    { id: "asset-management", label: "Asset Management" },
    { id: "asset-assignment", label: "Asset Assignment" },
    { id: "request-approval", label: "Request Approval" },
    { id: "maintenance",      label: "Maintenance"      },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccessMsg("");
  };

  const validate = () => {
    const errs = {};
    if (!form.assetName.trim())    errs.assetName      = "Asset Name is required.";
    if (!form.assetType)           errs.assetType      = "Asset Type is required.";
    if (!form.purchaseDate)        errs.purchaseDate   = "Purchase Date is required.";
    if (!form.warrantyExpiry)      errs.warrantyExpiry = "Warranty Expiry Date is required.";
    return errs;
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // API call would go here
    setSuccessMsg(`Asset ${source.id} updated successfully!`);
  };

  const handleCancel = () => {
    setForm({
      assetName:      source.name           || "",
      assetType:      source.type           || "",
      purchaseDate:   source.purchaseDate   || "",
      warrantyExpiry: source.warrantyExpiry || "",
    });
    setErrors({});
    setSuccessMsg("");
  };

  return (
    <div className="ea-page-wrapper">

      {/* ── Top Navbar ── */}
      <nav className="ea-top-nav">
        <div className="ea-nav-logo">
          <span className="ea-nav-logo-title">ITAMS</span>
          <span className="ea-nav-logo-sub">IT Asset Management System</span>
        </div>
        <div className="ea-nav-right">
          <span className="ea-nav-username">{username}</span>
          <div className="ea-nav-divider" />
          <button className="ea-logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="ea-body-wrapper">

        {/* ── Sidebar ── */}
        <aside className="ea-sidebar">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={
                "ea-sidebar-item" +
                (activeSidebar === item.id ? " ea-sidebar-item--active" : "")
              }
              onClick={() => setActiveSidebar(item.id)}
            >
              {item.label}
            </div>
          ))}
        </aside>

        {/* ── Main Content ── */}
        <main className="ea-main-content">
          <h1 className="ea-page-title">Edit Asset</h1>
          <p className="ea-page-subtitle">
            Edit the details of the asset and update the information.
          </p>

          {successMsg && (
            <div className="ea-success-msg">{successMsg}</div>
          )}

          {/* ── Form Card ── */}
          <form className="ea-card" onSubmit={handleUpdate} noValidate>

            {/* Asset ID — read-only */}
            <div className="ea-form-row">
              <label className="ea-label">Asset ID</label>
              <div className="ea-field-col">
                <input
                  className="ea-input ea-input--readonly"
                  type="text"
                  value={source.id}
                  readOnly
                />
              </div>
            </div>

            {/* Asset Name */}
            <div className="ea-form-row">
              <label className="ea-label">Asset Name</label>
              <div className="ea-field-col">
                <input
                  className={`ea-input${errors.assetName ? " ea-input--error" : ""}`}
                  type="text"
                  name="assetName"
                  value={form.assetName}
                  onChange={handleChange}
                  placeholder="Enter Asset Name"
                />
                {errors.assetName && (
                  <span className="ea-error">{errors.assetName}</span>
                )}
              </div>
            </div>

            {/* Asset Type */}
            <div className="ea-form-row">
              <label className="ea-label">Asset Type</label>
              <div className="ea-field-col">
                <select
                  className={`ea-select${errors.assetType ? " ea-input--error" : ""}`}
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
                  <span className="ea-error">{errors.assetType}</span>
                )}
              </div>
            </div>

            {/* Purchase Date */}
            <div className="ea-form-row">
              <label className="ea-label">Purchase Date</label>
              <div className="ea-field-col">
                <input
                  className={`ea-input${errors.purchaseDate ? " ea-input--error" : ""}`}
                  type="date"
                  name="purchaseDate"
                  value={form.purchaseDate}
                  onChange={handleChange}
                />
                {errors.purchaseDate && (
                  <span className="ea-error">{errors.purchaseDate}</span>
                )}
              </div>
            </div>

            {/* Warranty Expiry Date */}
            <div className="ea-form-row">
              <label className="ea-label">Warranty Expiry Date</label>
              <div className="ea-field-col">
                <input
                  className={`ea-input${errors.warrantyExpiry ? " ea-input--error" : ""}`}
                  type="date"
                  name="warrantyExpiry"
                  value={form.warrantyExpiry}
                  onChange={handleChange}
                />
                {errors.warrantyExpiry && (
                  <span className="ea-error">{errors.warrantyExpiry}</span>
                )}
              </div>
            </div>

            {/* Divider + Action Buttons */}
            <div className="ea-divider" />
            <div className="ea-form-actions">
              <button type="submit" className="ea-btn-primary">
                Update
              </button>
              <button type="button" className="ea-btn-outline" onClick={handleCancel}>
                Cancel
              </button>
            </div>

          </form>

          {/* Back button — outside card */}
          <div className="ea-back-wrapper">
            <button className="ea-btn-back" onClick={onBack}>
              Back
            </button>
          </div>

        </main>
      </div>
    </div>
  );
};

export default EditAsset;
