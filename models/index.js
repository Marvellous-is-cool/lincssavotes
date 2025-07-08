// This file exports all mongoose models to provide a single import point
const Award = require("./Award"); // Legacy model, kept for backward compatibility
const Contestant = require("./Contestant");
const Payment = require("./Payment");
const Admin = require("./Admin");
const User = require("./User");
const Position = require("./Position");
const SystemSetting = require("./SystemSetting");

module.exports = {
  Award,
  Contestant,
  Payment,
  Admin,
  User,
  Position,
  SystemSetting,
};
