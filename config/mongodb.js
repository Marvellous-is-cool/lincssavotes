const mongoose = require("mongoose");

// Connect to MongoDB using the connection string from environment variables
const connectDB = async () => {
  try {
    // Configure MongoDB connection with explicit TLS options
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      tlsAllowInvalidCertificates: false, // Enforce valid certificates
      tlsAllowInvalidHostnames: false, // Disallow invalid hostnames
      minPoolSize: 5, // Maintain at least 5 connections
      maxPoolSize: 10, // Maintain at most 10 connections
      tls: true, // Enable TLS
      tlsCAFile: undefined, // Use system certificates
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Log more detailed error information
    if (error.name === "MongoServerSelectionError") {
      console.error("Failed to select a MongoDB server:");
      console.error("- Check network connectivity to MongoDB Atlas");
      console.error("- Verify that your MongoDB Atlas cluster is online");
      console.error("- Confirm the connection string is correct");
    }
    process.exit(1);
  }
};

module.exports = connectDB;
