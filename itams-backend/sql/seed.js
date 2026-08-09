// Run with: npm run seed
// Creates the initial HR and Asset Manager login accounts (and a couple of
// sample departments) so you can log in immediately after setting up the DB.
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pool } = require("../src/config/db");

async function seed() {
  const plainPassword = process.env.DEFAULT_SEED_PASSWORD ;
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  // IMPORTANT: Login.js and ForgotPassword.js only accept an identifier that is
  // EITHER "EMP" + 3 chars OR an email ending in @gmail.com — nothing else passes
  // their client-side validation. So these seeded accounts must be logged into
  // by EMAIL (not login_id) from the actual login form. Replace the emails below
  // with real Gmail inboxes you control before seeding, or you won't receive the
  // OTP email during testing.
  const users = [
    {
      login_id: "HR001",
      name: "HR Admin",
      email: process.env.SEED_HR_EMAIL,
      department: "HR",
      role: "HR",
    },
    {
      login_id: "AM001",
      name: "Asset Manager",
      email: process.env.SEED_ASSET_MANAGER_EMAIL,
      department: "Asset Management",
      role: "AssetManager",
    },
  ];

  for (const u of users) {
    await pool.query(
      `INSERT INTO users (login_id, name, email, department, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (login_id) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name`,
      [u.login_id, u.name, u.email, u.department, passwordHash, u.role]
    );
    console.log(`✅ Seeded user: ${u.login_id} (${u.role}) — password: ${plainPassword}`);
  }

  const departments = [
    ["DEP001", "Information Technology (IT)", "Head 1", 25],
    ["DEP002", "Human Resources (HR)", "Head 2", 10],
    ["DEP003", "Finance", "Head 3", 15],
  ];
  for (const [id, name, head, count] of departments) {
    await pool.query(
      `INSERT INTO departments (department_id, name, head, employee_count)
       VALUES ($1, $2, $3, $4) ON CONFLICT (department_id) DO UPDATE SET name = EXCLUDED.name`,
      [id, name, head, count]
    );
  }
  console.log("✅ Seeded sample departments");

  console.log("\nLogin credentials (same password for both):");
  console.log(`  HR:            log in with email = ${users[0].email} | password = ${plainPassword}`);
  console.log(`  Asset Manager: log in with email = ${users[1].email} | password = ${plainPassword}`);
  console.log("\n⚠️  The Login page's own validation only accepts EMP-style IDs or @gmail.com");
  console.log("   emails — so log in with the EMAIL above, not the login_id (HR001/AM001).");
  console.log("   Change these passwords after first login in a real deployment.");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
