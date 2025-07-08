const mongoose = require("mongoose");
const validator = require("validator");

// Custom validator for matric number format (4 digits/5 digits)
const matricNumberValidator = (value) => {
  const matricPattern = /^\d{4}\/\d{5}$/;
  return matricPattern.test(value);
};

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  matricNumber: {
    type: String,
    required: [true, "Matric number is required"],
    unique: true,
    trim: true,
    validate: {
      validator: matricNumberValidator,
      message:
        "Matric number must be in the format XXXX/XXXXX (e.g., 2021/34825)",
    },
  },
  level: {
    type: String,
    required: [true, "Level is required"],
    enum: ["100", "200", "300", "400"],
    trim: true,
  },
  department: {
    type: String,
    default: "Linguistics and Communication Studies",
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{11}$/.test(v);
      },
      message: "Please enter a valid phone number",
    },
  },
  hasVoted: {
    type: Boolean,
    default: false,
  },
  votedPositions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
