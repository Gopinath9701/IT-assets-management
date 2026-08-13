/* ============================================================
   AddAsset.css
   ITAMS - Add Asset Page
   ============================================================ */


/* ============================================================
   GLOBAL RESET
   ============================================================ */

.aa-page-wrapper,
.aa-page-wrapper * {
  box-sizing: border-box;
}

.aa-page-wrapper {
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  font-family: "Inter", Arial, sans-serif;
  color: #111827;
}

.aa-page-wrapper button,
.aa-page-wrapper input,
.aa-page-wrapper select,
.aa-page-wrapper textarea {
  font-family: inherit;
}


/* ============================================================
   TOP NAVIGATION BAR
   ============================================================ */

.aa-top-nav {
  width: 100%;
  height: 145px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 25px 40px;

  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}


/* ---------------- Logo ---------------- */

.aa-nav-logo {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.aa-nav-logo-title {
  font-size: 40px;
  line-height: 1;
  font-weight: 800;
  color: #2563eb;
  letter-spacing: 0.3px;
}

.aa-nav-logo-sub {
  margin-top: 14px;

  font-size: 16px;
  line-height: 1.2;
  font-weight: 500;

  color: #111827;
}


/* ---------------- Right side ---------------- */

.aa-nav-right {
  display: flex;
  align-items: center;
  gap: 22px;
}

.aa-nav-username {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.aa-nav-divider {
  width: 1px;
  height: 25px;
  background-color: #9ca3af;
}

.aa-logout-btn {
  border: none;
  background: transparent;

  padding: 0;

  font-size: 16px;
  font-weight: 600;
  color: #111827;

  cursor: pointer;

  transition: color 0.2s ease;
}

.aa-logout-btn:hover {
  color: #2563eb;
}


/* ============================================================
   MAIN PAGE BODY
   ============================================================ */

.aa-body {
  width: 100%;
  max-width: 1120px;

  margin: 0 auto;

  padding: 44px 24px 55px;

  display: flex;
  flex-direction: column;
}


/* ============================================================
   PAGE TITLE
   ============================================================ */

.aa-page-title {
  margin: 0 0 12px;

  font-size: 40px;
  line-height: 1.2;
  font-weight: 700;

  color: #111827;
}

.aa-page-subtitle {
  margin: 0 0 42px;

  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;

  color: #374151;
}


/* ============================================================
   SUCCESS MESSAGE
   ============================================================ */

.aa-success-msg {
  width: 100%;

  margin-bottom: 20px;
  padding: 13px 16px;

  border: 1px solid #bbf7d0;
  border-radius: 7px;

  background-color: #f0fdf4;
  color: #166534;

  font-size: 14px;
  font-weight: 600;
}


/* ============================================================
   API ERROR MESSAGE
   ============================================================ */

.aa-api-error {
  width: 100%;

  margin-bottom: 20px;
  padding: 13px 16px;

  border: 1px solid #fecaca;
  border-radius: 7px;

  background-color: #fef2f2;
  color: #b91c1c;

  font-size: 14px;
  font-weight: 500;
}


/* ============================================================
   MAIN FORM CARD
   ============================================================ */

.aa-card {
  width: 100%;

  padding: 42px 32px 34px;

  background-color: #ffffff;

  border: 1px solid #dfe3e8;
  border-radius: 9px;

  display: flex;
  flex-direction: column;

  gap: 28px;

  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}


/* ============================================================
   CARD HEADING
   ============================================================ */

.aa-card-heading {
  margin: 0 0 14px;

  font-size: 23px;
  line-height: 1.3;
  font-weight: 700;

  color: #111827;
}


/* ============================================================
   FULL WIDTH FIELD
   ============================================================ */

.aa-field-full {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 9px;
}


/* ============================================================
   TWO COLUMN ROW
   ============================================================ */

.aa-row {
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr;

  column-gap: 52px;
  row-gap: 24px;
}


/* ============================================================
   FIELD GROUP
   ============================================================ */

.aa-field-group {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 9px;
}


/* ============================================================
   LABEL
   ============================================================ */

.aa-label {
  display: block;

  font-size: 16px;
  line-height: 1.3;

  font-weight: 600;

  color: #111827;
}


/* ============================================================
   INPUT
   ============================================================ */

.aa-input {
  width: 100%;
  height: 58px;

  padding: 0 16px;

  border: 1px solid #d1d5db;
  border-radius: 7px;

  background-color: #ffffff;

  color: #111827;

  font-size: 16px;
  font-weight: 400;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}


/* Placeholder */

.aa-input::placeholder {
  color: #253858;
  opacity: 1;
}


/* Focus */

.aa-input:focus {
  border-color: #2563eb;

  box-shadow:
    0 0 0 3px rgba(37, 99, 235, 0.10);
}


/* ============================================================
   READ ONLY ASSET ID
   ============================================================ */

.aa-input--readonly {
  width: 440px;
  max-width: 100%;

  background-color: #f3f4f6;

  color: #374151;

  cursor: default;
}

.aa-input--readonly:focus {
  border-color: #d1d5db;

  box-shadow: none;
}


/* ============================================================
   SELECT / DROPDOWN
   ============================================================ */

.aa-select {
  width: 100%;
  height: 58px;

  padding: 0 48px 0 16px;

  border: 1px solid #d1d5db;
  border-radius: 7px;

  background-color: #ffffff;

  color: #253858;

  font-size: 16px;
  font-weight: 400;

  cursor: pointer;

  outline: none;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  /* Dropdown arrow */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='9' viewBox='0 0 14 9'%3E%3Cpath d='M1 1.5L7 7.5L13 1.5' fill='none' stroke='%23111827' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");

  background-repeat: no-repeat;
  background-position: right 18px center;
  background-size: 14px 9px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}


/* Select focus */

.aa-select:focus {
  border-color: #2563eb;

  box-shadow:
    0 0 0 3px rgba(37, 99, 235, 0.10);
}


/* First option */

.aa-select option[value=""] {
  color: #6b7280;
}


/* ============================================================
   TEXTAREA
   ============================================================ */

.aa-textarea {
  height: 100px;

  min-height: 100px;

  padding: 15px 16px;

  resize: vertical;

  line-height: 1.5;
}


/* ============================================================
   ERROR INPUT
   ============================================================ */

.aa-input--error,
.aa-select.aa-input--error {
  border-color: #ef4444 !important;

  background-color: #fffafa;
}

.aa-input--error:focus,
.aa-select.aa-input--error:focus {
  border-color: #ef4444 !important;

  box-shadow:
    0 0 0 3px rgba(239, 68, 68, 0.10);
}


/* ============================================================
   VALIDATION ERROR MESSAGE
   ============================================================ */

.aa-error {
  display: block;

  margin-top: 1px;

  font-size: 12px;
  line-height: 1.4;

  font-weight: 500;

  color: #dc2626;
}


/* ============================================================
   DIVIDER
   ============================================================ */

.aa-divider {
  width: 100%;

  margin: 2px 0 0;

  border: none;
  border-top: 1px solid #e5e7eb;
}


/* ============================================================
   FORM ACTION BUTTONS
   ============================================================ */

.aa-form-actions {
  display: flex;
  align-items: center;

  gap: 25px;

  flex-wrap: wrap;
}


/* ============================================================
   ADD ASSET BUTTON
   ============================================================ */

.aa-btn-primary {
  min-width: 155px;
  height: 56px;

  padding: 0 28px;

  border: none;
  border-radius: 7px;

  background-color: #2563eb;
  color: #ffffff;

  font-size: 16px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
}

.aa-btn-primary:hover {
  background-color: #1d4ed8;
}

.aa-btn-primary:active {
  transform: translateY(1px);
}


/* ============================================================
   DISABLED ADD BUTTON
   ============================================================ */

.aa-btn-primary:disabled {
  background-color: #93c5fd;

  cursor: not-allowed;

  transform: none;
}


/* ============================================================
   CLEAR BUTTON
   ============================================================ */

.aa-btn-outline {
  min-width: 140px;
  height: 56px;

  padding: 0 28px;

  border: 1.5px solid #d1d5db;
  border-radius: 7px;

  background-color: #ffffff;
  color: #111827;

  font-size: 16px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.aa-btn-outline:hover {
  background-color: #f9fafb;

  border-color: #9ca3af;
}


/* ============================================================
   DISABLED CLEAR BUTTON
   ============================================================ */

.aa-btn-outline:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}


/* ============================================================
   BACK BUTTON
   ============================================================ */

.aa-back-wrapper {
  margin-top: 28px;
}


.aa-btn-back {
  min-width: 145px;
  height: 58px;

  padding: 0 28px;

  border: 1.5px solid #d1d5db;
  border-radius: 7px;

  background-color: #ffffff;
  color: #111827;

  font-size: 16px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.aa-btn-back:hover {
  background-color: #f9fafb;

  border-color: #9ca3af;
}


/* ============================================================
   DATE INPUT
   ============================================================ */

.aa-input[type="date"] {
  color: #253858;

  cursor: pointer;
}


/* Date placeholder-like appearance */

.aa-input[type="date"]:not(:valid) {
  color: #253858;
}


/* Calendar icon */

.aa-input[type="date"]::-webkit-calendar-picker-indicator {
  width: 18px;
  height: 18px;

  cursor: pointer;

  opacity: 0.8;
}


/* ============================================================
   NUMBER / COST INPUT
   ============================================================ */

.aa-input[inputmode="decimal"] {
  appearance: textfield;
  -moz-appearance: textfield;
}


/* ============================================================
   REMOVE NUMBER ARROWS IF INPUT TYPE NUMBER IS USED
   ============================================================ */

.aa-input[type="number"]::-webkit-inner-spin-button,
.aa-input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}


/* ============================================================
   HOVER EFFECT
   ============================================================ */

.aa-input:hover,
.aa-select:hover {
  border-color: #9ca3af;
}


/* ============================================================
   RESPONSIVE - TABLET
   ============================================================ */

@media (max-width: 900px) {

  .aa-top-nav {
    height: 120px;

    padding: 22px 28px;
  }

  .aa-nav-logo-title {
    font-size: 34px;
  }

  .aa-nav-logo-sub {
    font-size: 14px;
  }

  .aa-body {
    max-width: 100%;

    padding: 36px 24px 48px;
  }

  .aa-page-title {
    font-size: 34px;
  }

  .aa-card {
    padding: 32px 26px;
  }

  .aa-row {
    column-gap: 30px;
  }

}


/* ============================================================
   RESPONSIVE - SMALL TABLET
   ============================================================ */

@media (max-width: 720px) {

  .aa-top-nav {
    height: auto;

    min-height: 100px;

    padding: 20px;

    gap: 20px;
  }

  .aa-nav-logo-title {
    font-size: 30px;
  }

  .aa-nav-logo-sub {
    font-size: 13px;
  }

  .aa-nav-right {
    gap: 12px;
  }

  .aa-nav-username,
  .aa-logout-btn {
    font-size: 14px;
  }

  .aa-body {
    padding: 30px 18px 40px;
  }

  .aa-page-title {
    font-size: 30px;
  }

  .aa-page-subtitle {
    font-size: 14px;

    margin-bottom: 28px;
  }

  .aa-card {
    padding: 28px 20px;
  }

  .aa-row {
    grid-template-columns: 1fr;

    gap: 24px;
  }

  .aa-input--readonly {
    width: 100%;
  }

}


/* ============================================================
   RESPONSIVE - MOBILE
   ============================================================ */

@media (max-width: 480px) {

  .aa-top-nav {
    flex-direction: column;

    align-items: flex-start;

    padding: 18px 16px;
  }

  .aa-nav-right {
    width: 100%;

    justify-content: flex-end;
  }

  .aa-nav-logo-title {
    font-size: 28px;
  }

  .aa-nav-logo-sub {
    font-size: 12px;

    margin-top: 8px;
  }

  .aa-body {
    padding: 25px 14px 35px;
  }

  .aa-page-title {
    font-size: 27px;
  }

  .aa-page-subtitle {
    margin-bottom: 24px;
  }

  .aa-card {
    padding: 24px 16px;

    gap: 22px;

    border-radius: 8px;
  }

  .aa-card-heading {
    font-size: 20px;
  }

  .aa-label {
    font-size: 14px;
  }

  .aa-input,
  .aa-select {
    height: 52px;

    font-size: 14px;
  }

  .aa-textarea {
    min-height: 100px;
  }

  .aa-form-actions {
    flex-direction: column;

    align-items: stretch;

    gap: 12px;
  }

  .aa-btn-primary,
  .aa-btn-outline {
    width: 100%;
  }

  .aa-btn-back {
    width: 100%;
  }

}


/* ============================================================
   VERY SMALL MOBILE
   ============================================================ */

@media (max-width: 350px) {

  .aa-nav-right {
    justify-content: space-between;
  }

  .aa-page-title {
    font-size: 24px;
  }

  .aa-card {
    padding: 20px 13px;
  }

}
