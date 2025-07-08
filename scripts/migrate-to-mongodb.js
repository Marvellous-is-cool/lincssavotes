require('dotenv').config();
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const connectDB = require('../config/mongodb');
const { Award, Contestant, Payment, Admin } = require('../models');
const fs = require('fs');
const path = require('path');

// MySQL connection configuration
const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASS || '',
  database: process.env.MYSQL_DATABASE || 'bashvote',
  port: process.env.MYSQL_PORT || 3306,
  connectTimeout: 10000, // 10 seconds
};v").config();
const mysql = require("mysql2/promise");
const mongoose = require("mongoose");
const connectDB = require("../config/mongodb");
const { Award, Contestant, Payment, Admin } = require("../models");

// MySQL connection configuration
const mysqlConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASS || "",
  database: process.env.MYSQL_DATABASE || "bashvote",
  port: process.env.MYSQL_PORT || 3306,
};

// Function to migrate awards
async function migrateAwards(mysqlConnection) {
  console.log("Migrating awards...");

  const [rows] = await mysqlConnection.execute("SELECT * FROM awards");

  const awards = rows.map((row) => ({
    _id: new mongoose.Types.ObjectId(row.id.toString()),
    title: row.title,
    description: row.description || "",
    created_at: row.created_at || new Date(),
    updated_at: row.updated_at || new Date(),
  }));

  if (awards.length > 0) {
    await Award.deleteMany({});
    await Award.insertMany(awards);
  }

  console.log(`Migrated ${awards.length} awards`);
  return awards;
}

// Function to migrate contestants
async function migrateContestants(mysqlConnection, awards) {
  console.log("Migrating contestants...");

  // Create a map of MySQL award IDs to MongoDB award IDs
  const awardMap = new Map();
  awards.forEach((award) => {
    awardMap.set(award._id.toString(), award._id);
  });

  const [rows] = await mysqlConnection.execute("SELECT * FROM contestants");

  // Get award-contestant relationships
  const [awardContestants] = await mysqlConnection.execute(
    "SELECT * FROM award_contestants"
  );

  const contestantAwards = new Map();
  awardContestants.forEach((ac) => {
    if (!contestantAwards.has(ac.contestant_id)) {
      contestantAwards.set(ac.contestant_id, []);
    }
    contestantAwards.get(ac.contestant_id).push(ac.award_id);
  });

  const contestants = rows.map((row) => {
    // Get awards for this contestant
    const awardIds = contestantAwards.get(row.id) || [];
    const mongoAwardIds = awardIds
      .map((id) => awardMap.get(id.toString()))
      .filter((id) => id); // Filter out undefined values

    return {
      _id: new mongoose.Types.ObjectId(row.id.toString()),
      name: row.name,
      nickname: row.nickname || "",
      votes: row.votes || 0,
      photo: row.photo || "default.jpg",
      awards: mongoAwardIds,
      created_at: row.created_at || new Date(),
      updated_at: row.updated_at || new Date(),
    };
  });

  if (contestants.length > 0) {
    await Contestant.deleteMany({});
    await Contestant.insertMany(contestants);
  }

  console.log(`Migrated ${contestants.length} contestants`);
}

// Function to migrate payments
async function migratePayments(mysqlConnection, awards) {
  console.log("Migrating payments...");

  // Create a map of MySQL award IDs to MongoDB award IDs
  const awardMap = new Map();
  awards.forEach((award) => {
    awardMap.set(award._id.toString(), award._id);
  });

  const [rows] = await mysqlConnection.execute("SELECT * FROM payments");

  const payments = rows.map((row) => ({
    contestant_nickname: row.contestant_nickname,
    award_id: row.award_id ? awardMap.get(row.award_id.toString()) : null,
    amount_divided_by_10: row.amount_divided_by_10 || 0,
    payment_date: row.payment_date || new Date(),
    status: row.status || "completed",
  }));

  if (payments.length > 0) {
    await Payment.deleteMany({});
    await Payment.insertMany(payments);
  }

  console.log(`Migrated ${payments.length} payments`);
}

// Function to migrate admins
async function migrateAdmins(mysqlConnection) {
  console.log("Migrating admins...");

  const [rows] = await mysqlConnection.execute("SELECT * FROM admins");

  const admins = rows.map((row) => ({
    username: row.username,
    password: row.password,
    created_at: row.created_at || new Date(),
  }));

  if (admins.length > 0) {
    await Admin.deleteMany({});
    await Admin.insertMany(admins);
  }

  console.log(`Migrated ${admins.length} admins`);
}

// Main migration function
async function migrate() {
  let mysqlConnection;

  try {
    console.log("Starting migration from MySQL to MongoDB...");

    // Connect to MongoDB
    await connectDB();

    // Connect to MySQL
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log("Connected to MySQL database");

    // Migrate data
    const awards = await migrateAwards(mysqlConnection);
    await migrateContestants(mysqlConnection, awards);
    await migratePayments(mysqlConnection, awards);
    await migrateAdmins(mysqlConnection);

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    // Close connections
    if (mysqlConnection) {
      await mysqlConnection.end();
      console.log("MySQL connection closed");
    }

    if (mongoose.connection) {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
    }
  }
}

// Execute migration
migrate();
