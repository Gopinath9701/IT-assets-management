function getTodayStart() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function parseDateString(dateString) {
  if (!dateString) return null;
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function formatDateForId(dateValue) {
  if (!dateValue) return "";
  const date = parseDateString(dateValue);
  if (!date) return "";
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function validateEmployeeId(value, joiningDate = null) {
  if (!value || value.trim() === "") {
    return "Employee ID is required.";
  }
  if (value !== value.trim()) {
    return "Employee ID must not have leading or trailing spaces.";
  }
  if (/\s/.test(value)) {
    return "Employee ID cannot contain spaces.";
  }
  if (!/^\d+$/.test(value)) {
    return "Employee ID must contain only numbers.";
  }
  if (value.length !== 9) {
    return "Employee ID must contain exactly 9 digits.";
  }

  const year = Number(value.substring(0, 2));
  const month = Number(value.substring(2, 4));
  const day = Number(value.substring(4, 6));
  const employeeNumber = Number(value.substring(6));

  if (month < 1 || month > 12) {
    return "Employee ID contains an invalid month.";
  }
  if (day < 1 || day > 31) {
    return "Employee ID contains an invalid day.";
  }
  if (employeeNumber < 1 || employeeNumber > 999) {
    return "Last 3 digits must be between 001 and 999.";
  }

  const fullYear = 2000 + year;
  const employeeDate = new Date(fullYear, month - 1, day);
  if (
    employeeDate.getFullYear() !== fullYear ||
    employeeDate.getMonth() !== month - 1 ||
    employeeDate.getDate() !== day
  ) {
    return "Employee ID contains an invalid date.";
  }

  const today = getTodayStart();
  const normalizedEmployeeDate = new Date(employeeDate);
  normalizedEmployeeDate.setHours(0, 0, 0, 0);
  if (normalizedEmployeeDate > today) {
    return "Future date Employee IDs are not allowed.";
  }

  if (joiningDate) {
    const dateValue = parseDateString(joiningDate);
    if (!dateValue) {
      return "Please select a valid Date of Joining.";
    }
    const expectedDatePart = formatDateForId(joiningDate);
    const enteredDatePart = value.substring(0, 6);
    if (enteredDatePart !== expectedDatePart) {
      return `Employee ID must start with ${expectedDatePart}, matching Date of Joining.`;
    }
  }

  return null;
}

function validateEmployeeName(value) {
  if (!value || value.trim() === "") {
    return "Employee Name is required.";
  }
  if (value !== value.trim()) {
    return "Employee Name cannot start or end with a space.";
  }
  if (value.trim().length < 4) {
    return "Employee Name must contain at least 4 characters.";
  }
  if (!/^[A-Za-z ]+$/.test(value)) {
    return "Employee Name can contain only letters and spaces.";
  }
  return null;
}

function validateEmail(value, employeeId) {
  if (!value || value.trim() === "") {
    return "Email is required.";
  }
  if (value !== value.trim()) {
    return "Email cannot contain leading or trailing spaces.";
  }
  if (/\s/.test(value)) {
    return "Email cannot contain spaces.";
  }
  if (!employeeId || !/^\d{9}$/.test(employeeId)) {
    return "Enter Employee ID before entering Email.";
  }
  const expectedEmail = `${employeeId}@gmail.com`;
  if (value !== expectedEmail) {
    return `Email must be ${expectedEmail}.`;
  }
  if (!/^\d{9}@gmail\.com$/.test(value)) {
    return "Email must be in EmployeeID@gmail.com format.";
  }
  return null;
}

function validateDepartment(value) {
  if (!value || value.trim() === "") {
    return "Please select Department.";
  }
  return null;
}

function validateDesignation(value) {
  if (!value || value.trim() === "") {
    return "Designation is required.";
  }
  if (value !== value.trim()) {
    return "Designation cannot start or end with a space.";
  }
  if (value.trim().length < 2) {
    return "Designation must contain at least 2 characters.";
  }
  if (!/^[A-Za-z0-9 ]+$/.test(value)) {
    return "Designation can contain only letters, numbers and spaces.";
  }
  return null;
}

function validatePhone(value) {
  if (!value || value.trim() === "") {
    return "Phone Number is required.";
  }
  if (!/^\d+$/.test(value)) {
    return "Phone Number must contain only digits.";
  }
  if (value.length !== 10) {
    return "Phone Number must contain exactly 10 digits.";
  }
  if (!/^[6-9]\d{9}$/.test(value)) {
    return "Enter a valid 10-digit Indian mobile number.";
  }
  return null;
}

function validateJoiningDate(value) {
  if (!value) {
    return "Date of Joining is required.";
  }
  const selectedDate = parseDateString(value);
  if (!selectedDate) {
    return "Please enter a valid Date of Joining.";
  }
  const today = getTodayStart();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  if (selectedDate > today) {
    return "Date of Joining cannot be a future date.";
  }
  if (selectedDate < sevenDaysAgo) {
    return "Date of Joining can only be today or within the previous 7 days.";
  }
  return null;
}

function validateEmployeePayload({ employeeId, employeeName, email, department, designation, phone, joiningDate }) {
  const idError = validateEmployeeId(employeeId, joiningDate);
  if (idError) return idError;

  const nameError = validateEmployeeName(employeeName);
  if (nameError) return nameError;

  const emailError = validateEmail(email, employeeId);
  if (emailError) return emailError;

  const departmentError = validateDepartment(department);
  if (departmentError) return departmentError;

  const designationError = validateDesignation(designation);
  if (designationError) return designationError;

  const phoneError = validatePhone(phone);
  if (phoneError) return phoneError;

  const dateError = validateJoiningDate(joiningDate);
  if (dateError) return dateError;

  return null;
}

function validateAssetPayload({ assetType, brand, model, purchaseCost, purchaseDate, warrantyExpiry, description }) {
  if (!assetType) return "Please select an asset type.";
  if (!brand || brand.trim() === "") return "Please select a valid brand.";
  if (!model || model.trim() === "") return "Please select a valid model.";

  if (purchaseCost === undefined || purchaseCost === null || purchaseCost === "") {
    return "Purchase cost is required.";
  }
  if (String(purchaseCost).trim() !== String(purchaseCost)) {
    return "Purchase cost cannot have spaces.";
  }
  if (!/^\d+(\.\d{1,2})?$/.test(String(purchaseCost))) {
    return "Enter a valid amount. Example: 15000 or 15000.50.";
  }
  if (Number(purchaseCost) <= 0) {
    return "Purchase cost must be greater than 0.";
  }
  if (Number(purchaseCost) > 99999999) {
    return "Purchase cost is too large.";
  }

  const parsedPurchaseDate = parseDateString(purchaseDate);
  if (!parsedPurchaseDate) {
    return "Purchase date is required.";
  }
  const today = getTodayStart();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  if (parsedPurchaseDate > today) {
    return "Purchase date cannot be a future date.";
  }
  if (parsedPurchaseDate < sevenDaysAgo) {
    return "Only purchases from the last 7 days are allowed.";
  }

  const parsedWarrantyDate = parseDateString(warrantyExpiry);
  if (!parsedWarrantyDate) {
    return "Warranty expiry date is required.";
  }
  const minimumWarranty = new Date(parsedPurchaseDate);
  minimumWarranty.setMonth(minimumWarranty.getMonth() + 3);
  const maximumWarranty = new Date(parsedPurchaseDate);
  maximumWarranty.setFullYear(maximumWarranty.getFullYear() + 3);
  if (parsedWarrantyDate < minimumWarranty) {
    return "Warranty must be at least 3 months from the purchase date.";
  }
  if (parsedWarrantyDate > maximumWarranty) {
    return "Warranty cannot exceed 3 years from the purchase date.";
  }

  if (!description || description.trim() === "") {
    return "Description is required.";
  }
  if (description.length < 10) {
    return "Description must contain at least 10 characters.";
  }
  if (description.length > 500) {
    return "Description cannot exceed 500 characters.";
  }
  if (description !== description.trim()) {
    return "Description cannot have a space at the beginning or end.";
  }
  if (!/^[A-Za-z0-9 ]+$/.test(description)) {
    return "Description can contain only letters, numbers, and spaces.";
  }

  return null;
}

function validateAssetRequestPayload({ employeeId, assetType, purpose, requiredDate }) {
  const idError = validateEmployeeId(employeeId);
  if (idError) return idError;

  if (!assetType || assetType.trim() === "") {
    return "Asset Type is required";
  }

  if (!purpose || purpose.trim() === "") {
    return "Purpose is required";
  }
  if (purpose !== purpose.trimStart() || purpose !== purpose.trimEnd()) {
    return "Purpose should not start or end with spaces";
  }
  if (purpose.trim().length < 10) {
    return "Purpose must be at least 10 characters long";
  }
  if (purpose.length > 500) {
    return "Purpose cannot exceed 500 characters";
  }
  if (!/^[A-Za-z\s]+$/.test(purpose)) {
    return "Purpose should contain letters and spaces only";
  }

  if (!requiredDate) {
    return "Required Date is required";
  }
  const selectedDate = parseDateString(requiredDate);
  if (!selectedDate) {
    return "Please select a valid date";
  }
  const today = getTodayStart();
  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  if (selectedDate < today) {
    return "Required Date cannot be a past date";
  }
  if (selectedDate > maxDate) {
    return "Required Date cannot exceed one year from today";
  }

  return null;
}

function validateAssignmentPayload({ requestId, assetId, employeeId }) {
  if (!requestId || requestId.trim() === "") {
    return "Request ID is required";
  }
  if (!assetId || assetId.trim() === "") {
    return "Asset ID is required";
  }
  if (!employeeId || employeeId.trim() === "") {
    return "Employee ID is required";
  }

  const employeeError = validateEmployeeId(employeeId);
  if (employeeError) return employeeError;

  return null;
}

module.exports = {
  validateEmployeePayload,
  validateAssetPayload,
  validateAssetRequestPayload,
  validateAssignmentPayload,
  validateEmployeeId,
  validateEmployeeName,
  validateEmail,
  validateDepartment,
  validateDesignation,
  validatePhone,
  validateJoiningDate,
  getTodayStart,
  parseDateString,
  formatDateForId,
  EMP_ID_REGEX: /^\d{9}$/,
  GMAIL_REGEX: /^\d{9}@gmail\.com$/,
  PHONE_REGEX: /^[6-9]\d{9}$/,
};
