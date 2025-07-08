const mongoose = require("mongoose");

const systemSettingSchema = new mongoose.Schema({
  // General Settings
  votingEnabled: {
    type: Boolean,
    default: false,
    required: true,
  },
  registrationEnabled: {
    type: Boolean,
    default: true,
    required: true,
  },
  displayResults: {
    type: Boolean,
    default: false,
    required: true,
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
    required: true,
  },
  votingStartDate: {
    type: Date,
    default: null,
  },
  votingEndDate: {
    type: Date,
    default: null,
  },
  electionTitle: {
    type: String,
    default: "LINCSSA VOTES",
    required: true,
  },
  electionDescription: {
    type: String,
    default: "Student Union Election",
    required: true,
  },

  // Appearance Settings
  colorTheme: {
    type: String,
    enum: ["default", "blue", "green", "orange", "purple", "red"],
    default: "default",
  },
  layoutStyle: {
    type: String,
    enum: ["modern", "classic", "minimal"],
    default: "modern",
  },
  showAnimations: {
    type: Boolean,
    default: true,
  },
  customLogoUrl: {
    type: String,
    default: "",
  },

  // Security Settings
  twoFactorAuth: {
    type: Boolean,
    default: false,
  },
  loginAttemptsLimit: {
    type: Number,
    default: 5,
    min: 3,
    max: 10,
  },

  // Notification Settings
  emailNotifications: {
    type: Boolean,
    default: true,
  },
  adminEmail: {
    type: String,
    default: "",
  },
  notifyLogin: {
    type: Boolean,
    default: true,
  },
  notifyVoting: {
    type: Boolean,
    default: true,
  },
  notifySystem: {
    type: Boolean,
    default: true,
  },

  // Timestamps
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Ensure there's only one settings document in the collection
systemSettingSchema.statics.getSettings = async function () {
  const settings = await this.findOne();
  if (settings) {
    return settings;
  }

  // Create default settings if none exist
  return this.create({});
};

const SystemSetting = mongoose.model("SystemSetting", systemSettingSchema);

module.exports = SystemSetting;
