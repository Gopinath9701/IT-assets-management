import React, { useState } from "react";
import "./AddAsset.css";

const API_URL = "http://localhost:5000/api";

const AddAsset = ({
  username = "username",
  onLogout,
  onBack,
}) => {
  // =====================================================
  // ASSET DATABASE
  // =====================================================

  const assetData = {
    Monitor: {
      Dell: [
        "P2422H",
        "P2425H",
        "P2722H",
        "P2723D",
        "E2423H",
      ],
      HP: [
        "E24 G4",
        "E24 G5",
        "E27 G4",
        "M24f",
      ],
      LG: [
        "24MP400",
        "24MR400",
        "27MP400",
        "27UP650",
      ],
      Samsung: [
        "LF24T350",
        "S24C310",
        "S24A400",
        "S27C310",
      ],
      Lenovo: [
        "ThinkVision T24i-30",
        "T24d-30",
        "T27h-30",
      ],
      ASUS: [
        "VA24EHE",
        "VA27EHE",
        "PA278QV",
      ],
      Acer: [
        "KA242Y",
        "SA242Y",
        "CB272",
      ],
      BenQ: [
        "GW2480",
        "GW2490",
        "GW2780",
      ],
    },

    Keyboard: {
      Logitech: [
        "K120",
        "K380",
        "K480",
        "K580",
        "K780",
        "MK295",
      ],
      Dell: [
        "KB216",
        "KB522",
        "KM3322W",
      ],
      HP: [
        "150",
        "320K",
        "230",
      ],
      Lenovo: [
        "Preferred Pro II",
        "Essential Wired Keyboard",
      ],
      Microsoft: [
        "Wired Keyboard 600",
        "Surface Keyboard",
      ],
      Corsair: [
        "K55",
        "K60",
        "K70",
      ],
      Razer: [
        "BlackWidow V3",
        "Ornata V3",
      ],
    },

    Webcam: {
      Logitech: [
        "C270",
        "C310",
        "C505",
        "C920",
        "C922 Pro",
        "Brio 300",
        "Brio 500",
      ],
      HP: [
        "HD 4310",
        "950 4K",
        "325 FHD",
      ],
      Dell: [
        "WB3023",
        "WB5023",
        "Pro Webcam WB5023",
      ],
      Lenovo: [
        "300 FHD Webcam",
        "Essential FHD Webcam",
      ],
      Microsoft: [
        "Modern Webcam",
        "LifeCam HD-3000",
      ],
      Razer: [
        "Kiyo",
        "Kiyo Pro",
      ],
      ASUS: [
        "Webcam C3",
        "ROG Eye",
      ],
    },

    Projector: {
      Epson: [
        "EB-E01",
        "EB-X06",
        "CO-FH02",
        "EB-W06",
      ],
      BenQ: [
        "MS550",
        "MX560",
        "TH575",
        "MW560",
      ],
      Acer: [
        "X1128i",
        "X1228i",
        "H6815BD",
      ],
      ViewSonic: [
        "PA503S",
        "PA503W",
        "PX701HD",
      ],
      Sony: [
        "VPL-PHZ51",
        "VPL-PW560",
      ],
      Optoma: [
        "X309ST",
        "EH336",
        "HD146X",
      ],
    },

    Mouse: {
      Logitech: [
        "M90",
        "M100",
        "M185",
        "M190",
        "M331",
        "MX Master 3S",
      ],
      Dell: [
        "MS116",
        "MS3320W",
        "WM126",
      ],
      HP: [
        "M100",
        "M110",
        "150",
      ],
      Lenovo: [
        "300 USB Mouse",
        "Essential Wireless Mouse",
      ],
      Microsoft: [
        "Basic Optical Mouse",
        "Bluetooth Mouse",
      ],
      ASUS: [
        "WT200",
        "MW203",
      ],
      Razer: [
        "DeathAdder Essential",
        "Basilisk V3",
      ],
    },

    CPU: {
      Dell: [
        "OptiPlex 3000",
        "OptiPlex 5000",
        "OptiPlex 7000",
      ],
      HP: [
        "ProDesk 400 G9",
        "ProDesk 600 G6",
        "EliteDesk 800 G9",
      ],
      Lenovo: [
        "ThinkCentre M70s",
        "M80s",
        "M90s",
      ],
      ASUS: [
        "ExpertCenter D5",
        "ExpertCenter D7",
      ],
      Acer: [
        "Veriton X",
        "Veriton M",
      ],
      Apple: [
        "Mac mini M2",
        "Mac mini M4",
        "iMac M3",
      ],
    },

    Printer: {
      HP: [
        "LaserJet Pro M404dn",
        "M404dw",
        "M428fdw",
        "MFP 135a",
      ],
      Canon: [
        "LBP6030B",
        "LBP2900B",
        "MF3010",
        "MF244dw",
      ],
      Epson: [
        "EcoTank L3250",
        "L4260",
        "L5290",
        "WF-2930",
      ],
      Brother: [
        "HL-L2321D",
        "DCP-L2541DW",
        "MFC-L2715DW",
      ],
      Xerox: [
        "Phaser 3020",
        "B230",
        "B315",
      ],
      Samsung: [
        "Xpress M2021",
        "M2070",
      ],
    },
  };

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
  // PREFIXES
  // =====================================================

  const prefixes = {
    Monitor: "MON",
    Keyboard: "KEY",
    Webcam: "WEB",
    Projector: "PRO",
    Mouse: "MOU",
    CPU: "CPU",
    Printer: "PRI",
  };

  // =====================================================
  // GENERATE NEXT ASSET ID
  // =====================================================

  const getNextAssetId = (assetType) => {
    if (!assetType) {
      return "AST001";
    }

    const prefix = prefixes[assetType] || "AST";

    const storageKey = `itams_${prefix}_counter`;

    const currentNumber = Number(
      localStorage.getItem(storageKey) || "0"
    );

    return `${prefix}${String(
      currentNumber + 1
    ).padStart(3, "0")}`;
  };

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
  // ERRORS
  // =====================================================

  const [errors, setErrors] = useState({});

  // =====================================================
  // MESSAGES
  // =====================================================

  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // ASSET ID
  // =====================================================

  const [assetId, setAssetId] = useState("AST001");

  // =====================================================
  // GET TODAY
  // =====================================================

  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // GET SEVEN DAYS AGO
  // =====================================================

  const getSevenDaysAgo = () => {
    const date = new Date();

    date.setDate(
      date.getDate() - 7
    );

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // ADD MONTHS
  // =====================================================

  const addMonths = (
    dateString,
    months
  ) => {
    const date = new Date(
      `${dateString}T00:00:00`
    );

    date.setMonth(
      date.getMonth() + months
    );

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    // ===================================================
    // PURCHASE COST
    // ===================================================

    if (name === "purchaseCost") {
      if (!/^\d*\.?\d*$/.test(value)) {
        return;
      }

      if (value.includes(".")) {
        const decimalPart =
          value.split(".")[1];

        if (
          decimalPart.length > 2
        ) {
          return;
        }
      }

      setFormData((prev) => ({
        ...prev,
        purchaseCost: value,
      }));

      setErrors((prev) => ({
        ...prev,
        purchaseCost: "",
      }));

      setApiError("");
      setSuccessMessage("");

      return;
    }

    // ===================================================
    // DESCRIPTION
    // ===================================================

    if (name === "description") {
      if (!/^[A-Za-z0-9 ]*$/.test(value)) {
        return;
      }

      if (value.length > 500) {
        return;
      }

      setFormData((prev) => ({
        ...prev,
        description: value,
      }));

      setErrors((prev) => ({
        ...prev,
        description: "",
      }));

      setApiError("");
      setSuccessMessage("");

      return;
    }

    // ===================================================
    // ASSET TYPE
    // ===================================================

    if (name === "assetType") {
      setFormData((prev) => ({
        ...prev,
        assetType: value,
        brand: "",
        model: "",
      }));

      setAssetId(
        getNextAssetId(value)
      );

      setErrors((prev) => ({
        ...prev,
        assetType: "",
        brand: "",
        model: "",
      }));

      setApiError("");
      setSuccessMessage("");

      return;
    }

    // ===================================================
    // BRAND
    // ===================================================

    if (name === "brand") {
      setFormData((prev) => ({
        ...prev,
        brand: value,
        model: "",
      }));

      setErrors((prev) => ({
        ...prev,
        brand: "",
        model: "",
      }));

      setApiError("");
      setSuccessMessage("");

      return;
    }

    // ===================================================
    // NORMAL FIELDS
    // ===================================================

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setApiError("");
    setSuccessMessage("");
  };

  // =====================================================
  // VALIDATE FORM
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

    if (!formData.brand) {
      newErrors.brand =
        "Please select a brand.";
    } else if (
      !assetData[
        formData.assetType
      ]?.[formData.brand]
    ) {
      newErrors.brand =
        "Please select a valid brand.";
    }

    // ===================================================
    // MODEL
    // ===================================================

    if (!formData.model) {
      newErrors.model =
        "Please select a model.";
    } else if (
      !assetData[
        formData.assetType
      ]?.[
        formData.brand
      ]?.includes(formData.model)
    ) {
      newErrors.model =
        "Please select a valid model.";
    }

    // ===================================================
    // PURCHASE COST
    // ===================================================

    const purchaseCost =
      formData.purchaseCost;

    if (!purchaseCost) {
      newErrors.purchaseCost =
        "Purchase cost is required.";
    } else if (
      purchaseCost !==
      purchaseCost.trim()
    ) {
      newErrors.purchaseCost =
        "Purchase cost cannot have spaces.";
    } else if (
      !/^\d+(\.\d{1,2})?$/.test(
        purchaseCost
      )
    ) {
      newErrors.purchaseCost =
        "Enter a valid amount. Example: 100 or 15000.50.";
    } else if (
      Number(purchaseCost) < 100
    ) {
      newErrors.purchaseCost =
        "Purchase cost must be at least ₹100.";
    } else if (
      Number(purchaseCost) >
      99999999
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
        new Date(
          `${formData.purchaseDate}T00:00:00`
        );

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const sevenDaysAgo =
        new Date();

      sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 7
      );

      sevenDaysAgo.setHours(
        0,
        0,
        0,
        0
      );

      if (
        purchaseDate > today
      ) {
        newErrors.purchaseDate =
          "Purchase date cannot be a future date.";
      } else if (
        purchaseDate <
        sevenDaysAgo
      ) {
        newErrors.purchaseDate =
          "Only purchases from the last 7 days are allowed.";
      }
    }

    // ===================================================
    // WARRANTY
    // ===================================================

    if (!formData.warrantyExpiry) {
      newErrors.warrantyExpiry =
        "Warranty expiry date is required.";
    } else if (
      formData.purchaseDate
    ) {
      const warrantyDate =
        new Date(
          `${formData.warrantyExpiry}T00:00:00`
        );

      const minimumWarranty =
        new Date(
          `${addMonths(
            formData.purchaseDate,
            3
          )}T00:00:00`
        );

      const maximumWarranty =
        new Date(
          `${addMonths(
            formData.purchaseDate,
            36
          )}T00:00:00`
        );

      if (
        warrantyDate <
        minimumWarranty
      ) {
        newErrors.warrantyExpiry =
          "Warranty must be at least 3 months from the purchase date.";
      } else if (
        warrantyDate >
        maximumWarranty
      ) {
        newErrors.warrantyExpiry =
          "Warranty cannot exceed 3 years from the purchase date.";
      }
    }

    // ===================================================
    // DESCRIPTION
    // =====================================================

    const description =
      formData.description;

    if (!description) {
      newErrors.description =
        "Description is required.";
    } else if (
      description.length < 10
    ) {
      newErrors.description =
        "Description must contain at least 10 characters.";
    } else if (
      description.length > 500
    ) {
      newErrors.description =
        "Description cannot exceed 500 characters.";
    } else if (
      description !==
      description.trim()
    ) {
      newErrors.description =
        "Description cannot have a space at the beginning or end.";
    } else if (
      !/^[A-Za-z0-9 ]+$/.test(
        description
      )
    ) {
      newErrors.description =
        "Description can contain only letters, numbers, and spaces.";
    }

    setErrors(newErrors);

    return (
      Object.keys(
        newErrors
      ).length === 0
    );
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setApiError("");

    const isValid =
      validateForm();

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      // =================================================
      // GENERATE ASSET ID
      // =================================================

      const prefix =
        prefixes[
          formData.assetType
        ] || "AST";

      const storageKey =
        `itams_${prefix}_counter`;

      let counter = Number(
        localStorage.getItem(
          storageKey
        ) || "0"
      );

      counter += 1;

      localStorage.setItem(
        storageKey,
        String(counter)
      );

      const generatedAssetId =
        `${prefix}${String(
          counter
        ).padStart(3, "0")}`;

      // =================================================
      // REQUEST BODY
      // =================================================

      const requestBody = {
        assetId:
          generatedAssetId,

        assetType:
          formData.assetType,

        brand:
          formData.brand,

        model:
          formData.model,

        purchaseCost:
          Number(
            formData.purchaseCost
          ),

        purchaseDate:
          formData.purchaseDate,

        warrantyExpiry:
          formData.warrantyExpiry,

        description:
          formData.description,
      };

      console.log(
        "Sending asset data:",
        requestBody
      );

      // =================================================
      // BACKEND REQUEST
      // =================================================

      const response =
        await fetch(
          `${API_URL}/assets`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              requestBody
            ),
          }
        );

      // =================================================
      // READ RESPONSE
      // =================================================

      let data = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      console.log(
        "Backend response:",
        data
      );

      // =================================================
      // BACKEND ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add asset."
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      setSuccessMessage(
        `Asset added successfully! Asset ID: ${generatedAssetId}`
      );

      // =================================================
      // CLEAR FORM
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

      // Next default ID
      setAssetId(
        `${prefix}${String(
          counter + 1
        ).padStart(3, "0")}`
      );

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

    setAssetId("AST001");
  };

  // =====================================================
  // AVAILABLE BRANDS
  // =====================================================

  const availableBrands =
    formData.assetType
      ? Object.keys(
          assetData[
            formData.assetType
          ] || {}
        )
      : [];

  // =====================================================
  // AVAILABLE MODELS
  // =====================================================

  const availableModels =
    formData.assetType &&
    formData.brand
      ? assetData[
          formData.assetType
        ]?.[
          formData.brand
        ] || []
      : [];

  // =====================================================
  // DATE LIMITS
  // =====================================================

  const purchaseMinDate =
    getSevenDaysAgo();

  const purchaseMaxDate =
    getToday();

  const warrantyMinDate =
    formData.purchaseDate
      ? addMonths(
          formData.purchaseDate,
          3
        )
      : getToday();

  const warrantyMaxDate =
    formData.purchaseDate
      ? addMonths(
          formData.purchaseDate,
          36
        )
      : getToday();

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

          <div className="aa-nav-divider" />

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
            SUCCESS
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
                value={
                  formData.assetType
                }
                onChange={
                  handleChange
                }
                className={
                  "aa-select" +
                  (
                    errors.assetType
                      ? " aa-input--error"
                      : ""
                  )
                }
              >

                <option value="">
                  Select Asset Type
                </option>

                {assetTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}

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

              <select
                name="brand"
                value={
                  formData.brand
                }
                onChange={
                  handleChange
                }
                disabled={
                  !formData.assetType
                }
                className={
                  "aa-select" +
                  (
                    errors.brand
                      ? " aa-input--error"
                      : ""
                  )
                }
              >

                <option value="">
                  {
                    formData.assetType
                      ? "Select Brand"
                      : "Select Asset Type First"
                  }
                </option>

                {availableBrands.map(
                  (brand) => (
                    <option
                      key={brand}
                      value={brand}
                    >
                      {brand}
                    </option>
                  )
                )}

              </select>

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

              <select
                name="model"
                value={
                  formData.model
                }
                onChange={
                  handleChange
                }
                disabled={
                  !formData.brand
                }
                className={
                  "aa-select" +
                  (
                    errors.model
                      ? " aa-input--error"
                      : ""
                  )
                }
              >

                <option value="">
                  {
                    formData.brand
                      ? "Select Model"
                      : "Select Brand First"
                  }
                </option>

                {availableModels.map(
                  (model) => (
                    <option
                      key={model}
                      value={model}
                    >
                      {model}
                    </option>
                  )
                )}

              </select>

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
                value={
                  formData.purchaseCost
                }
                onChange={
                  handleChange
                }
                placeholder="Enter Purchase Cost"
                inputMode="decimal"
                maxLength={11}
                className={
                  "aa-input" +
                  (
                    errors.purchaseCost
                      ? " aa-input--error"
                      : ""
                  )
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
                value={
                  formData.purchaseDate
                }
                onChange={
                  handleChange
                }
                min={
                  purchaseMinDate
                }
                max={
                  purchaseMaxDate
                }
                className={
                  "aa-input" +
                  (
                    errors.purchaseDate
                      ? " aa-input--error"
                      : ""
                  )
                }
              />

              <small>
                Only purchases from the last 7 days are allowed.
              </small>

              {errors.purchaseDate && (
                <span className="aa-error">
                  {
                    errors.purchaseDate
                  }
                </span>
              )}

            </div>

            {/* WARRANTY */}

            <div className="aa-field-group">

              <label className="aa-label">
                Warranty Expiry Date
              </label>

              <input
                type="date"
                name="warrantyExpiry"
                value={
                  formData.warrantyExpiry
                }
                onChange={
                  handleChange
                }
                min={
                  warrantyMinDate
                }
                max={
                  warrantyMaxDate
                }
                disabled={
                  !formData.purchaseDate
                }
                className={
                  "aa-input" +
                  (
                    errors.warrantyExpiry
                      ? " aa-input--error"
                      : ""
                  )
                }
              />

              <small>
                Warranty must be between 3 months and 3 years from purchase date.
              </small>

              {errors.warrantyExpiry && (
                <span className="aa-error">
                  {
                    errors.warrantyExpiry
                  }
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
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              placeholder="Enter Description"
              maxLength={500}
              rows={4}
              className={
                "aa-input aa-textarea" +
                (
                  errors.description
                    ? " aa-input--error"
                    : ""
                )
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
              {
                formData.description
                  .length
              }
              /500
            </div>

            <small
              style={{
                display: "block",
                marginTop: "8px",
                lineHeight: "1.5",
              }}
            >
              Minimum 10 characters. Only letters, numbers,
              and spaces are allowed. Multiple spaces between
              words are allowed. No space at the beginning
              or end. No special characters.
            </small>

            {errors.description && (
              <span className="aa-error">
                {
                  errors.description
                }
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
              {
                loading
                  ? "Adding..."
                  : "Add Asset"
              }
            </button>

            <button
              type="button"
              className="aa-btn-outline"
              onClick={
                handleClear
              }
              disabled={loading}
            >
              Clear
            </button>

          </div>

        </form>

        {/* =================================================
            BACK
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
