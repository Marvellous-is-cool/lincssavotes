const mysql = require("mysql2");

// // Create the connection pool to the database
const pool = mysql.createPool({
  host: "173.247.225.109", // Database Host
  user: "admin", // Database User
  password: "OXmhNfkd", // Use the environment variable or default to "L1NCSSABASH"
  database: "bashvote", // Database Name
  port: 19351, // Database Port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// const pool = mysql.createPool({
//   host: "localhost", // Database Host
//   user: "root", // Database User
//   password: "", // Use the environment variable or default to "L1NCSSABASH"
//   database: "bashvote", // Database Name
//   port: 3306, // Database Port
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// Export the promise-based interface of the pool
const connection = pool.promise();

// Log a success message when the database connection is established
connection
  .execute("SELECT 1") // Execute a simple query to check the connection
  .then(() => {})
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

module.exports = connection;
