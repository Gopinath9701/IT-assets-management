// Run with: npm run seed
// Creates the initial HR and Asset Manager login accounts (and a couple of
// sample departments) so you can log in immediately after setting up the DB.
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pool } = require("../src/config/db");

async function seed() {
  const plainPassword = String(process.env.DEFAULT_SEED_PASSWORD || "123$5678").trim();

  await pool.query(
    `DELETE FROM users
     WHERE role IN ('HR', 'AssetManager', 'InventoryManager')
        OR login_id IN ('250812001', '250812002', '250812003')`
  );

  // IMPORTANT: The actual frontend validation accepts either:
  // 1) a 9-digit employee ID, or
  // 2) an email in the format 9-digitID@gmail.com
  // So these seeded accounts must use valid employee IDs and matching Gmail
  // addresses. The login_id is still stored in the DB, but the browser form
  // will only accept the employee ID/email pattern above.
  // The current validator interprets the first 2 digits as year, the next 2 as
  // day, and the next 2 as month. To stay valid under the same rules, the
  // seeded IDs must use a real date where month is 01-12 and not in the future.
  const users = [
    {
      login_id: "250812001",
      name: "HR Admin",
      email: process.env.SEED_HR_EMAIL || "250812001@gmail.com",
      department: "HR",
      role: "HR",
    },
    {
      login_id: "250812002",
      name: "Asset Manager",
      email: process.env.SEED_ASSET_MANAGER_EMAIL || "250812002@gmail.com",
      department: "Asset Management",
      role: "AssetManager",
    },
    {
      login_id: "250812003",
      name: "Inventory Manager",
      email: process.env.SEED_INVENTORY_MANAGER_EMAIL || "250812003@gmail.com",
      department: "Inventory Management",
      role: "InventoryManager",
    },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    await pool.query(
      `INSERT INTO users (login_id, name, email, department, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (login_id) DO UPDATE SET
         name = EXCLUDED.name,
         email = EXCLUDED.email,
         department = EXCLUDED.department,
         password_hash = EXCLUDED.password_hash,
         role = EXCLUDED.role`,
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

  console.log("\nLogin credentials (same password for all seeded users):");
  console.log(`  HR:                log in with email = ${users[0].email} | password = ${plainPassword}`);
  console.log(`  Asset Manager:     log in with email = ${users[1].email} | password = ${plainPassword}`);
  console.log(`  Inventory Manager: log in with email = ${users[2].email} | password = ${plainPassword}`);
  console.log("\n⚠️  The login form accepts a 9-digit Employee ID or a 9-digitID@gmail.com email.");
  console.log("   Use the email shown above, or the login_id value, if the form is bypassed.");
  console.log("   Change these passwords after first login in a real deployment.");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
