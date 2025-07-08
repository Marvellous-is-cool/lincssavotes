// Script to initialize the LINCSSA VOTES database with required models and admin account
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/mongodb");
const {
  Admin,
  Position,
  SystemSetting,
  User,
  Contestant,
} = require("../models");

// Default admin user
const admin = {
  username: "admin",
  password: "lincssa@admin", // In production, this should be hashed
};

// Default election positions
const positions = [
  {
    title: "President",
    description:
      "The President represents the student body and leads the student union.",
    isActive: true,
    displayResults: true,
  },
  {
    title: "Vice President",
    description:
      "The Vice President assists the President and acts in their absence.",
    isActive: true,
    displayResults: true,
  },
  {
    title: "General Secretary",
    description:
      "The General Secretary maintains records and handles communication.",
    isActive: true,
    displayResults: true,
  },
  {
    title: "Financial Secretary",
    description:
      "The Financial Secretary manages the union finances and budgets.",
    isActive: true,
    displayResults: true,
  },
  {
    title: "Public Relations Officer",
    description: "The PRO handles public communication and event publicity.",
    isActive: true,
    displayResults: true,
  },
];

// Default system settings
const systemSettings = {
  votingEnabled: false,
  registrationEnabled: true,
  displayResults: false,
  maintenanceMode: false,
  electionTitle: "LINCSSA VOTES",
  electionDescription:
    "Osun State University, Ikire Campus Departmental Election",
  votingStartDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  votingEndDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
};

// Function to initialize the database
async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const adminExists = await Admin.findOne({ username: admin.username });
    if (!adminExists) {
      console.log("Creating admin account...");
      await Admin.create(admin);
      console.log("Admin account created successfully");
    } else {
      console.log("Admin account already exists");
    }

    // Check if system settings exist
    const settingsExist = await SystemSetting.findOne();
    if (!settingsExist) {
      console.log("Creating system settings...");
      await SystemSetting.create(systemSettings);
      console.log("System settings created successfully");
    } else {
      console.log("System settings already exist");
    }

    // Create positions if they don't exist
    console.log("Checking positions...");
    for (const position of positions) {
      const positionExists = await Position.findOne({ title: position.title });
      if (!positionExists) {
        await Position.create(position);
        console.log(`Created position: ${position.title}`);
      } else {
        console.log(`Position already exists: ${position.title}`);
      }
    }

    console.log("Database initialization completed successfully!");
    console.log("\nYou can now login to the admin dashboard with:");
    console.log(`Username: ${admin.username}`);
    console.log(`Password: ${admin.password}`);
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

// Run the initialization
initializeDatabase();
