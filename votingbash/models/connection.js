const mysql = require("mysql2/promise");

// Create the connection pool to the database
const pool = mysql.createPool({
  host: "163.123.183.89",
  user: "admin",
  password: "x3XoTegz",
  database: "bashvote",
  port: 17863,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export the promise-based interface of the pool
module.exports = pool;
