// connection.js

const mysql = require("mysql2");

// create the connection pool to the database
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "bashvote",
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
