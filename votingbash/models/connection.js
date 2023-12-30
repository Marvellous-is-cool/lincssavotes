const mysql = require("mysql2");

// Retrieve the database password from the environment variable
const dbPassword = process.env.DB_PASSWORD || "NOTHING";

// Create the connection pool to the database
const pool = mysql.createPool({
  host: "47.253.80.122", // Database Host
  user: "root", // Database User
  password: dbPassword, // Use the environment variable or default to "L1NCSSABASH"
  database: "bashvote", // Database Name
  port: 3306, // Database Port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export the promise-based interface of the pool
const connection = pool.promise();

// Log a success message when the database connection is established
connection
  .execute("SELECT 1") // Execute a simple query to check the connection
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

module.exports = connection;
