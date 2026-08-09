// Mirrors the client-side regexes already coded into AddEmployee.js / UpdateEmployee.js
// on the frontend-developer branch. Kept here so the backend enforces the same rules
// even if a request bypasses the UI (Postman, a future mobile client, etc).

const EMP_ID_REGEX = /^EMP\d{3}$/;
const NAME_REGEX = /^[A-Za-z ]+$/;
const GMAIL_REGEX = /^[A-Za-z0-9._%+-]{3,}@gmail\.com$/;
const DESIGNATION_REGEX = /^[A-Za-z ]+$/;
const PHONE_REGEX = /^\+91[6-9]\d{9}$/;

// Returns an error message string, or null if valid.
function validateEmployeePayload({ employeeId, employeeName, email, department, designation, phone, joiningDate }) {
  if (!employeeId || !EMP_ID_REGEX.test(employeeId)) {
    return "Employee ID must be 'EMP' followed by exactly 3 digits (e.g. EMP001).";
  }
  if (!employeeName || employeeName.trim().length < 4 || employeeName.length > 20 || !NAME_REGEX.test(employeeName)) {
    return "Employee Name must be 4-20 characters, letters and spaces only.";
  }
  if (!email || email.length > 60 || !GMAIL_REGEX.test(email)) {
    return "Email must be a valid address ending in @gmail.com.";
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
  if (joiningDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const jd = new Date(joiningDate);
    jd.setHours(0, 0, 0, 0);
    if (jd > today) {
      return "Date of Joining cannot be a future date.";
    }
  }
  return null;
}

module.exports = { validateEmployeePayload, EMP_ID_REGEX, GMAIL_REGEX, PHONE_REGEX };
