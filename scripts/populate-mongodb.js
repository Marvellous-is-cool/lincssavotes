// Manual data entry script to populate MongoDB without requiring MySQL connection
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/mongodb");
const { Award, Contestant, Payment, Admin } = require("../models");

// Sample data for awards
const awards = [
  {
    title: "Best Actor",
    description: "Award for the best acting performance",
  },
  {
    title: "Best Actress",
    description: "Award for the best actress performance",
  },
  {
    title: "Best Director",
    description: "Award for exceptional direction",
  },
];

// Sample data for contestants
const contestants = [
  {
    name: "John Doe",
    nickname: "JD",
    level: "Professional",
    votes: 120,
    photo: "default.jpg",
    awards: [], // We'll fill this after creating awards
  },
  {
    name: "Jane Smith",
    nickname: "JS",
    level: "Professional",
    votes: 150,
    photo: "default.jpg",
    awards: [], // We'll fill this after creating awards
  },
  {
    name: "Robert Johnson",
    nickname: "RJ",
    level: "Amateur",
    votes: 80,
    photo: "default.jpg",
    awards: [], // We'll fill this after creating awards
  },
];

// Sample data for admins
const admins = [
  {
    username: "admin",
    password: "admin123", // In production, this should be hashed
  },
];

// Sample data for payments
const payments = [
  {
    contestant_nickname: "JD",
    amount_divided_by_10: 12,
    payment_date: new Date(),
    status: "completed",
  },
  {
    contestant_nickname: "JS",
    amount_divided_by_10: 15,
    payment_date: new Date(),
    status: "completed",
  },
];

// Function to populate MongoDB
async function populateDatabase() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("Connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing data...");
    await Award.deleteMany({});
    await Contestant.deleteMany({});
    await Admin.deleteMany({});
    await Payment.deleteMany({});

    // Insert awards
    console.log("Inserting awards...");
    const insertedAwards = await Award.insertMany(awards);
    console.log(`Inserted ${insertedAwards.length} awards`);

    // Update contestants with award references
    contestants[0].awards = [insertedAwards[0]._id]; // John Doe for Best Actor
    contestants[1].awards = [insertedAwards[1]._id]; // Jane Smith for Best Actress
    contestants[2].awards = [insertedAwards[2]._id]; // Robert Johnson for Best Director

    // Insert contestants
    console.log("Inserting contestants...");
    const insertedContestants = await Contestant.insertMany(contestants);
    console.log(`Inserted ${insertedContestants.length} contestants`);

    // Insert admins
    console.log("Inserting admins...");
    const insertedAdmins = await Admin.insertMany(admins);
    console.log(`Inserted ${insertedAdmins.length} admins`);

    // Update payments with award references
    payments[0].award_id = insertedAwards[0]._id;
    payments[1].award_id = insertedAwards[1]._id;

    // Insert payments
    console.log("Inserting payments...");
    const insertedPayments = await Payment.insertMany(payments);
    console.log(`Inserted ${insertedPayments.length} payments`);

    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    // Close MongoDB connection
    if (mongoose.connection) {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
    }
  }
}

// Run the population script
populateDatabase();
