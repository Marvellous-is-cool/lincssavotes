const mysql = require("mysql2/promise");

// Create the connection pool to the database
const pool = mysql.createPool({
  host: "108.181.157.248",
  user: "admin",
  password: "HkXPDswo",
  database: "bashvote",
  port: 19103,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export the promise-based interface of the pool
module.exports = pool;
