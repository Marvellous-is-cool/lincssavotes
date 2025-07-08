const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  // Flag to determine if voting for this position is active
  isActive: {
    type: Boolean,
    default: true,
  },
  // Flag to determine if results for this position should be displayed
  displayResults: {
    type: Boolean,
    default: true,
  },
  // Order for displaying positions in the UI
  order: {
    type: Number,
    default: 0,
  },
  // Maximum number of candidates a voter can select for this position
  maxSelection: {
    type: Number,
    default: 1,
    min: 1,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Position = mongoose.model("Position", positionSchema);

module.exports = Position;
