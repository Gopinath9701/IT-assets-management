const { Pool } = require("pg");
require("dotenv").config();

// Neon gives you one connection string (Dashboard -> Connection Details), e.g.:
// postgresql://user:password@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Neon requires TLS
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
