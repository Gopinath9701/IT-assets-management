// Run with: npm run seed
// Creates the three login accounts allowed by spec — HR, Asset Manager, and
// Inventory Manager (employees do NOT get logins) — plus sample departments.
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pool } = require("../src/config/db");
const { generateEmployeeId } = require("../src/utils/idGenerator");
const { validatePassword, buildEmployeeEmail } = require("../src/utils/validators");

async function seed() {
  const plainPassword = process.env.DEFAULT_SEED_PASSWORD || "Itams@2026";

  const passwordError = validatePassword(plainPassword);
  if (passwordError) {
    console.error(`❌ DEFAULT_SEED_PASSWORD does not meet the password policy: ${passwordError}`);
    console.error("   Fix DEFAULT_SEED_PASSWORD in .env (needs 8-20 chars, upper+lower+digit+special) and re-run.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(plainPassword, 10);
  const today = new Date();

  const accounts = [
    { name: "HR Admin", department: "HR", role: "HR" },
    { name: "Asset Manager", department: "Asset Management", role: "AssetManager" },
    { name: "Inventory Manager", department: "Inventory", role: "InventoryManager" },
  ];

  for (const acc of accounts) {
    // One seed account per role — reuse its existing login_id on re-runs
    // instead of minting a new one each time.
    const { rows: existing } = await pool.query("SELECT login_id FROM users WHERE role = $1 LIMIT 1", [acc.role]);
    const loginId = existing[0]?.login_id || (await generateEmployeeId(today));
    // Per the frontend's login/forgot-password spec, email must be exactly
    // {loginId}@gmail.com — not a real inbox until one is registered at that
    // address, so OTP mail won't be deliverable yet.
    const email = buildEmployeeEmail(loginId);

    await pool.query(
      `INSERT INTO users (login_id, name, email, department, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (login_id) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name, email = EXCLUDED.email`,
      [loginId, acc.name, email, acc.department, passwordHash, acc.role]
    );
    console.log(`✅ Seeded ${acc.role}: login ID ${loginId} | email ${email} | password ${plainPassword}`);
  }

  const departments = [
    ["DEP001", "Information Technology", "Suresh Iyer", 25],
    ["DEP002", "Human Resources", "Anita Menon", 10],
    ["DEP003", "Finance", "Rakesh Verma", 15],
  ];
  for (const [id, name, head, count] of departments) {
    await pool.query(
      `INSERT INTO departments (department_id, name, head, employee_count)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (department_id) DO UPDATE SET name = EXCLUDED.name, head = EXCLUDED.head, employee_count = EXCLUDED.employee_count`,
      [id, name, head, count]
    );
  }
  console.log("✅ Seeded sample departments");

  console.log("\n⚠️  Log in using the EMAIL shown above (Login.js's own validation");
  console.log("   requires @gmail.com) — the 9-digit login ID also works if your");
  console.log("   frontend's login form accepts numeric IDs directly.");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
