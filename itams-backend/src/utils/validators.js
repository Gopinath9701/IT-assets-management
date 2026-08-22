// Mirrors the team's written spec (login/HR requirements) so the backend
// enforces the same rules the frontend does, even if a request bypasses the UI.

const EMP_ID_REGEX = /^\d{9}$/; // YYMMDD + 3-digit serial, generated server-side
const NAME_REGEX = /^[A-Za-z ]+$/;
const GMAIL_REGEX = /^[A-Za-z0-9._%+-]{3,}@gmail\.com$/; // domain-only check per spec — NOT forced to equal the Employee ID
const DESIGNATION_REGEX = /^[A-Za-z ]+$/;
const PHONE_REGEX = /^\+91[6-9]\d{9}$/;
const DEPARTMENT_NAME_REGEX = /^[A-Za-z ]+$/; // "Restrict department and head names to letters only"

// Password policy per spec: 8-20 chars, at least one uppercase, one lowercase,
// one digit, one special character.
function validatePassword(password) {
  if (!password || password.length < 8 || password.length > 20) {
    return "Password must be 8-20 characters.";
  }
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character.";
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

// Returns an error message string, or null if valid.
// employeeId is optional here — Add Employee generates it server-side (never
// validated as client input); Update Employee identifies the record by URL
// param, already known-valid.
function validateEmployeePayload(
  { employeeId, employeeName, email, department, designation, phone, joiningDate },
  { requireEmail = true, requireJoiningDate = true } = {}
) {
  if (employeeId && !EMP_ID_REGEX.test(employeeId)) {
    return "Employee ID must be exactly 9 digits.";
  }
  if (!employeeName || employeeName.trim().length < 4 || employeeName.length > 20 || !NAME_REGEX.test(employeeName)) {
    return "Employee Name must be 4-20 characters, letters and spaces only.";
  }
  if (requireEmail || email) {
    if (!email || email.length > 60 || !GMAIL_REGEX.test(email)) {
      return "Email must be a valid address ending in @gmail.com.";
    }
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

module.exports = {
  validateEmployeePayload,
  validatePassword,
  validateJoiningDateWindow,
  EMP_ID_REGEX,
  GMAIL_REGEX,
  PHONE_REGEX,
  DEPARTMENT_NAME_REGEX,
};
