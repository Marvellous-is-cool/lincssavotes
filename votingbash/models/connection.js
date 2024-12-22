const mysql = require("mysql2/promise");

// Create the connection pool to the database
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASS || "",
  database: "bashvote",
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000, // 30 seconds timeout
});

pool.on("error", (err) => {
  console.error("MySQL Pool Error:", err.message);
});

// Export the promise-based interface of the pool
module.exports = pool;
