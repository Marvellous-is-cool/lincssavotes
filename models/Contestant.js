const mongoose = require("mongoose");

const contestantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  nickname: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
    default: "",
  },
  manifesto: {
    type: String,
    trim: true,
    default: "",
  },
  votes: {
    type: Number,
    default: 0,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  position: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Position",
    required: true,
  },
  level: {
    type: String,
    trim: true,
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

const Contestant = mongoose.model("Contestant", contestantSchema);

module.exports = Contestant;
