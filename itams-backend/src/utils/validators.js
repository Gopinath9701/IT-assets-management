// Mirrors the frontend's client-side validation so the backend enforces the
// same rules even if a request bypasses the UI. Where the frontend disagreed
// with itself across forms, the rule chosen here is noted inline.

const EMP_ID_REGEX = /^\d{9}$/; // YYMMDD + 3-digit serial, generated server-side
const NAME_REGEX = /^[A-Za-z ]+$/;
const DESIGNATION_REGEX = /^[A-Za-z ]+$/;
const PHONE_REGEX = /^\+91[6-9]\d{9}$/;
const DEPARTMENT_NAME_REGEX = /^[A-Za-z ]+$/;
const ASSET_ID_REGEX = /^[A-Z]{3}\d{3}$/;
const OTP_REGEX = /^\d{6}$/;

// Union of every asset-type dropdown across the frontend's pages (they don't
// yet agree on one canonical list).
const ASSET_TYPES = [
  "Laptop", "Desktop", "Monitor", "Keyboard", "Webcam", "Projector",
  "Mouse", "CPU", "Printer", "Headset", "Scanner",
];

const ISSUE_CATEGORIES = ["Hardware Issue", "Software Issue", "Performance Issue", "Security Issue", "Network Issue", "Other"];
const PRIORITIES = ["Low", "Medium", "High"];

function isRealCalendarDate(year, month, day) {
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

// Validates an employee ID a client typed in (search/lookup) — not the ones
// the server generates, which are trusted by construction.
function validateEmployeeIdFormat(employeeId) {
  if (!employeeId) return "Employee ID is required.";
  if (!EMP_ID_REGEX.test(employeeId)) return "Employee ID must be exactly 9 digits.";

  const yy = Number(employeeId.slice(0, 2));
  const mm = Number(employeeId.slice(2, 4));
  const dd = Number(employeeId.slice(4, 6));
  const serial = Number(employeeId.slice(6, 9));

  if (mm < 1 || mm > 12) return "Employee ID contains an invalid month.";
  if (dd < 1 || dd > 31) return "Employee ID contains an invalid day.";
  if (!isRealCalendarDate(2000 + yy, mm, dd)) return "Employee ID contains an invalid calendar date.";
  if (serial < 1 || serial > 999) return "Employee ID's serial number must be between 001 and 999.";

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const idDate = new Date(2000 + yy, mm - 1, dd);
  if (idDate > today) return "Employee ID cannot contain a future date.";

  return null;
}

function buildEmployeeEmail(employeeId) {
  return `${employeeId}@gmail.com`;
}

// Per the frontend spec, an employee's email is always {employeeId}@gmail.com
// — not a free-form address.
function validateEmployeeEmail(email, employeeId) {
  const expected = buildEmployeeEmail(employeeId);
  if (!email) return "Email is required.";
  if (email !== expected) return `Email must be ${expected}.`;
  return null;
}

// Password policy per spec: 8-20 chars, no spaces, at least one uppercase,
// one lowercase, one digit, one special character.
function validatePassword(password) {
  if (!password) return "Password is required.";
  if (/\s/.test(password)) return "Password cannot contain spaces.";
  if (password.length < 8 || password.length > 20) {
    return "Password must be 8-20 characters.";
  }
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character.";
  return null;
}

function validateOtp(otp) {
  if (!otp) return "OTP is required.";
  if (/\s/.test(otp)) return "OTP cannot contain spaces.";
  if (!OTP_REGEX.test(otp)) return "OTP must be exactly 6 digits.";
  return null;
}

// Joining date must be within the last 7 days up to today (per spec: "Past one
// week dates before present date & present dates").
function validateJoiningDateWindow(joiningDate) {
  if (!joiningDate) return "Date of Joining is required.";
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const min = new Date(today); min.setDate(min.getDate() - 7);
  const jd = new Date(joiningDate); jd.setHours(0, 0, 0, 0);
  if (isNaN(jd.getTime())) return "Date of Joining is not a valid date.";
  if (jd < min || jd > today) {
    return "Date of Joining must be within the past week, up to today.";
  }
  return null;
}

// Returns an error message string, or null if valid. Does not check email —
// callers validate email separately via validateEmployeeEmail once the
// employee's ID is known (generated server-side on create, taken from the
// URL param on update).
function validateEmployeePayload(
  { employeeName, department, designation, phone, joiningDate },
  { requireJoiningDate = true } = {}
) {
  if (!employeeName || employeeName.trim().length < 4 || employeeName.length > 20 || !NAME_REGEX.test(employeeName)) {
    return "Employee Name must be 4-20 characters, letters and spaces only.";
  }
  if (!department) {
    return "Please select a Department.";
  }
  if (designation) {
    if (designation.trim().length < 4 || designation.length > 20 || !DESIGNATION_REGEX.test(designation)) {
      return "Designation must be 4-20 characters, letters and spaces only.";
    }
  }
  if (phone && !PHONE_REGEX.test(phone)) {
    return "Phone Number must be a valid Indian mobile number, e.g. +919876543210.";
  }
  if (requireJoiningDate) {
    const joiningDateError = validateJoiningDateWindow(joiningDate);
    if (joiningDateError) return joiningDateError;
  }
  return null;
}

function validateNameLikeField(value, label) {
  if (!value) return `${label} is required.`;
  if (!value.trim()) return `${label} cannot contain only spaces.`;
  if (value !== value.trim()) return `${label} should not have leading or trailing spaces.`;
  if (/\s{2,}/.test(value)) return `${label} should not contain multiple consecutive spaces.`;
  if (value.length < 2 || value.length > 100) return `${label} must be 2-100 characters.`;
  if (!/^[A-Za-z ]+$/.test(value)) return `${label} can contain only letters and spaces.`;
  return null;
}

function validateDepartmentPayload({ departmentName, departmentHead, employeeCount }) {
  const nameError = validateNameLikeField(departmentName, "Department Name");
  if (nameError) return nameError;

  const headError = validateNameLikeField(departmentHead, "Department Head");
  if (headError) return headError;

  if (employeeCount === undefined || employeeCount === null || employeeCount === "") {
    return "Number of Employees is required.";
  }
  if (!/^[0-9]+$/.test(String(employeeCount).trim())) {
    return "Number of Employees must contain numbers only.";
  }
  if (Number(employeeCount) > 1000) {
    return "Number of Employees cannot exceed 1000.";
  }
  return null;
}

function validateAssetIdFormat(assetId) {
  if (!assetId) return "Asset ID is required.";
  if (!ASSET_ID_REGEX.test(assetId)) {
    return "Asset ID must be 3 capital letters followed by 3 numbers (e.g. LAP001).";
  }
  return null;
}

// POST /api/assets (AddAsset.js): a freshly-purchased asset being registered
// right away, so the dates are tightly scoped to "just happened."
function validateNewAssetPayload({ assetType, brand, model, purchaseCost, purchaseDate, warrantyExpiry, description }) {
  if (!assetType || !ASSET_TYPES.includes(assetType)) {
    return "Please select a valid asset type.";
  }
  if (!brand || !brand.trim()) return "Please select a brand.";
  if (!model || !model.trim()) return "Please select a model.";

  if (purchaseCost === undefined || purchaseCost === null || purchaseCost === "") {
    return "Purchase cost is required.";
  }
  if (!/^\d+(\.\d{1,2})?$/.test(String(purchaseCost).trim())) {
    return "Enter a valid purchase cost. Example: 100 or 15000.50.";
  }
  const cost = Number(purchaseCost);
  if (cost < 100) return "Purchase cost must be at least ₹100.";
  if (cost > 99999999) return "Purchase cost is too large.";

  if (!purchaseDate) return "Purchase date is required.";
  const pDate = new Date(purchaseDate); pDate.setHours(0, 0, 0, 0);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (isNaN(pDate.getTime())) return "Purchase date is not a valid date.";
  if (pDate > today) return "Purchase date cannot be a future date.";
  const minPurchase = new Date(today); minPurchase.setDate(minPurchase.getDate() - 7);
  if (pDate < minPurchase) return "Only purchases from the last 7 days are allowed.";

  if (!warrantyExpiry) return "Warranty expiry date is required.";
  const wDate = new Date(warrantyExpiry); wDate.setHours(0, 0, 0, 0);
  if (isNaN(wDate.getTime())) return "Warranty expiry date is not a valid date.";
  const minWarranty = addMonths(pDate, 3);
  const maxWarranty = addMonths(pDate, 36);
  if (wDate < minWarranty) return "Warranty must be at least 3 months from the purchase date.";
  if (wDate > maxWarranty) return "Warranty cannot exceed 3 years from the purchase date.";

  if (!description || !description.trim()) return "Description is required.";
  if (description !== description.trim()) return "Description cannot have a space at the beginning or end.";
  if (description.trim().length < 10) return "Description must contain at least 10 characters.";
  if (description.length > 500) return "Description cannot exceed 500 characters.";
  if (!/^[A-Za-z0-9 ]+$/.test(description)) return "Description can contain only letters, numbers, and spaces.";

  return null;
}

// PUT /api/assets/:assetId (ManageAsset.js): editing a record that may be
// years old, so the date windows are looser than on create.
function validateAssetUpdatePayload({ model, description, purchaseDate, warrantyExpiry }) {
  if (model) {
    if (model !== model.trim()) return "Model should not have leading or trailing spaces.";
    if (model.trim().length < 2 || model.length > 50) return "Model must be 2-50 characters.";
    if (!/^[A-Za-z0-9 .&()/_-]+$/.test(model)) {
      return "Model can contain letters, numbers, spaces and basic symbols only.";
    }
  }

  let pDate = null;
  if (purchaseDate) {
    pDate = new Date(purchaseDate); pDate.setHours(0, 0, 0, 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (isNaN(pDate.getTime())) return "Purchase date is not a valid date.";
    if (pDate > today) return "Purchase date cannot be in the future.";
    const min = new Date(today); min.setFullYear(min.getFullYear() - 10);
    if (pDate < min) return "Purchase date cannot be older than 10 years.";
  }

  if (warrantyExpiry) {
    const wDate = new Date(warrantyExpiry); wDate.setHours(0, 0, 0, 0);
    if (isNaN(wDate.getTime())) return "Warranty expiry date is not a valid date.";
    const maxWarranty = new Date(); maxWarranty.setHours(0, 0, 0, 0); maxWarranty.setFullYear(maxWarranty.getFullYear() + 5);
    if (wDate > maxWarranty) return "Warranty expiry date cannot exceed 5 years from today.";
    if (pDate && wDate < pDate) return "Warranty expiry date must be after purchase date.";
  }

  if (description) {
    if (description !== description.trim()) return "Description should not have leading or trailing spaces.";
    if (/\s{2,}/.test(description)) return "Description should not contain multiple consecutive spaces.";
    if (description.trim().length < 10) return "Description must contain at least 10 characters.";
    if (description.length > 500) return "Description cannot exceed 500 characters.";
    if (!/[A-Za-z0-9]/.test(description)) return "Description must contain letters or numbers.";
  }

  return null;
}

function validateMaintenancePayload({ issueCategory, description, priority }) {
  if (!issueCategory || !ISSUE_CATEGORIES.includes(issueCategory)) {
    return "Please select a valid issue category.";
  }
  if (!priority || !PRIORITIES.includes(priority)) {
    return "Please select a valid priority.";
  }
  if (!description || !description.trim()) return "Issue description is required.";
  if (description !== description.trim()) return "Issue description should not have leading or trailing spaces.";
  if (/ {2,}/.test(description)) return "Issue description should not contain multiple consecutive spaces.";
  if (description.trim().length < 10) return "Issue description must be at least 10 characters long.";
  if (description.length > 500) return "Issue description cannot exceed 500 characters.";
  if (!/^[A-Za-z0-9\s.,!?;:'"()/%-]+$/.test(description)) return "Issue description contains invalid characters.";
  if (!/[A-Za-z0-9]/.test(description)) return "Issue description must contain letters or numbers.";
  return null;
}

function validatePurpose(purpose) {
  if (!purpose || !purpose.trim()) return "Purpose is required.";
  if (purpose !== purpose.trim()) return "Purpose should not start or end with spaces.";
  if (purpose.trim().length < 10) return "Purpose must be at least 10 characters long.";
  if (purpose.length > 500) return "Purpose cannot exceed 500 characters.";
  if (!/^[A-Za-z\s]+$/.test(purpose)) return "Purpose should contain letters and spaces only.";
  return null;
}

function validateRequiredDate(requiredDate) {
  if (!requiredDate) return "Required Date is required.";
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(requiredDate); d.setHours(0, 0, 0, 0);
  if (isNaN(d.getTime())) return "Please select a valid date.";
  if (d < today) return "Required Date cannot be a past date.";
  const max = new Date(today); max.setDate(max.getDate() + 10);
  if (d > max) return "Required Date cannot exceed 10 days from today.";
  return null;
}

const RETURN_CONDITIONS = ["Good", "Damaged", "Faulty"];

function validateAssetReturnPayload({ returnDate, condition, remarks }) {
  if (!returnDate) return "Return Date is required.";
  const rDate = new Date(returnDate); rDate.setHours(0, 0, 0, 0);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (isNaN(rDate.getTime())) return "Return Date is not a valid date.";
  if (rDate > today) return "Return Date cannot be a future date.";

  if (!condition || !RETURN_CONDITIONS.includes(condition)) {
    return "Please select a valid Return Condition.";
  }

  if (remarks) {
    if (remarks !== remarks.trim()) return "Remarks should not have leading or trailing spaces.";
    if (/\s{2,}/.test(remarks)) return "Remarks should not contain multiple consecutive spaces.";
    if (remarks.trim().length < 2) return "Remarks must contain at least 2 characters.";
    if (remarks.length > 250) return "Remarks cannot exceed 250 characters.";
    if (!/^[A-Za-z0-9\s.,()&-]+$/.test(remarks)) return "Remarks contains invalid characters.";
  }

  return null;
}

function validateRejectionReason(reason) {
  if (!reason || !reason.trim()) return "Reason for rejection is required.";
  if (reason !== reason.trim()) return "Reason for rejection should not have leading or trailing spaces.";
  if (/\s{2,}/.test(reason)) return "Reason for rejection should not contain multiple consecutive spaces.";
  if (reason.trim().length < 10) return "Reason for rejection must be at least 10 characters.";
  if (!/^[A-Za-z0-9 ]+$/.test(reason)) return "Reason for rejection should contain only letters, numbers and single spaces.";
  return null;
}

module.exports = {
  validateEmployeePayload,
  validateEmployeeIdFormat,
  validateEmployeeEmail,
  buildEmployeeEmail,
  validatePassword,
  validateOtp,
  validateJoiningDateWindow,
  validateDepartmentPayload,
  validateAssetIdFormat,
  validateNewAssetPayload,
  validateAssetUpdatePayload,
  validateMaintenancePayload,
  validatePurpose,
  validateRequiredDate,
  validateRejectionReason,
  validateAssetReturnPayload,
  RETURN_CONDITIONS,
  EMP_ID_REGEX,
  PHONE_REGEX,
  DEPARTMENT_NAME_REGEX,
  ASSET_ID_REGEX,
  ASSET_TYPES,
  ISSUE_CATEGORIES,
  PRIORITIES,
};
