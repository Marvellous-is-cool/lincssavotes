// Authentication middleware for voters
const { User, SystemSetting } = require("../models");

const voterAuthMiddleware = {
  // Check if the user is authenticated
  isAuthenticated: async (req, res, next) => {
    if (req.session && req.session.voter) {
      // Update the res.locals with the voter data
      res.locals.voter = req.session.voter;
      return next();
    }

    // Store the original URL they were trying to access
    req.session.returnTo = req.originalUrl;

    // Redirect to login
    req.flash("error", "Please log in to access this page");
    return res.redirect("/login");
  },

  // Check if voting is enabled
  isVotingEnabled: async (req, res, next) => {
    try {
      const settings = await SystemSetting.getSettings();

      if (!settings.votingEnabled) {
        req.flash(
          "info",
          "Voting is currently disabled. Please check back later."
        );
        return res.redirect("/");
      }

      return next();
    } catch (error) {
      console.error("Error checking if voting is enabled:", error);
      req.flash("error", "An error occurred. Please try again later.");
      return res.redirect("/");
    }
  },

  // Check if registration is enabled
  isRegistrationEnabled: async (req, res, next) => {
    try {
      const settings = await SystemSetting.getSettings();

      if (!settings.registrationEnabled) {
        req.flash(
          "info",
          "Registration is currently disabled. Please check back later."
        );
        return res.redirect("/");
      }

      return next();
    } catch (error) {
      console.error("Error checking if registration is enabled:", error);
      req.flash("error", "An error occurred. Please try again later.");
      return res.redirect("/");
    }
  },

  // Redirect if already authenticated
  redirectIfAuthenticated: (req, res, next) => {
    if (req.session && req.session.voter) {
      return res.redirect("/dashboard");
    }
    return next();
  },
};

module.exports = voterAuthMiddleware;
