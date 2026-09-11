function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Returns a UTC-literal string ("YYYY-MM-DD HH:MI:SS.sss", no offset marker)
// rather than a JS Date object. password_resets.expires_at is "timestamp
// without time zone" - when a JS Date is passed as a query param for that
// column type, pg serializes it using the Node process's LOCAL timezone
// components instead of UTC, so on a host running in IST the stored value
// ended up ~5.5 hours later than intended (an OTP documented everywhere as
// expiring in 3 minutes was actually valid for ~5.5 hours). Writing an
// explicit UTC string with no offset marker means Postgres stores exactly
// those digits verbatim, independent of both the DB session timezone and
// the Node process's local timezone.
function otpExpiryDate(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000)
    .toISOString()
    .replace("T", " ")
    .replace("Z", "");
}

module.exports = { generateOtp, otpExpiryDate };
