const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    console.log("✅ Connected to PostgreSQL (Neon) database");
  } catch (err) {
    console.error("❌ Postgres connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
