require("dotenv").config();
const { Connection } = require("databricks-sql");

const dbConfig = {
  server: process.env.DATABRICKS_HOST,
  token: process.env.DATABRICKS_ACCESS_TOKEN,
  httpPath: process.env.DATABRICKS_HTTP_PATH,
  port: process.env.DATABRICKS_PORT || 443,
};

// Function to connect to Databricks
async function getDatabricksConnection() {
  const conn = new Connection(dbConfig);
  try {
    await conn.connect();
    console.log("✅ Connected to Databricks");
    return conn;
  } catch (error) {
    console.error("❌ Databricks Connection Error:", error);
  }
}

module.exports = { getDatabricksConnection };
