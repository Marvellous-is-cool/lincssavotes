const { Position, Contestant, SystemSetting } = require("../models");

const homeController = {
  // Render the landing page
  renderLanding: async (req, res) => {
    try {
      const settings = await SystemSetting.getSettings();
      const voter = req.session.voter || null;

      // Get all positions
      const positions = await Position.find({ isActive: true });

      // Get contestants for positions where results should be displayed
      const positionsWithContestants = await Promise.all(
        positions
          .filter((pos) => pos.displayResults)
          .map(async (position) => {
            const contestants = await Contestant.find({
              position: position._id,
            }).sort({ votes: -1 });

            return {
              ...position.toObject(),
              contestants,
            };
          })
      );

      res.render("landing-v2", {
        title: "LINCSSA VOTES",
        settings,
        positions,
        positionsWithResults: positionsWithContestants,
        showResults: settings.displayResults,
        voter,
      });
    } catch (error) {
      console.error("Error rendering landing page:", error);
      res.status(500).render("error", {
        message: "Failed to load the landing page. Please try again later.",
      });
    }
  },

  // Render voter dashboard
  renderDashboard: async (req, res) => {
    try {
      const settings = await SystemSetting.getSettings();
      const voter = req.session.voter;

      // Check if voting is disabled and show a message
      if (!settings.votingEnabled) {
        req.flash(
          "info",
          "Voting is currently disabled by the administrators."
        );
      }

      // Get all positions
      const positions = await Position.find({ isActive: true });

      // For each position, check if the user has already voted
      const votingStatus = await Promise.all(
        positions.map(async (position) => {
          const hasVotedForPosition =
            voter.votedPositions &&
            voter.votedPositions.some(
              (p) => p.toString() === position._id.toString()
            );

          // Get contestants for this position
          const contestants = await Contestant.find({ position: position._id });

          return {
            ...position.toObject(),
            hasVoted: hasVotedForPosition,
            contestants,
          };
        })
      );

      // Count total voted positions
      const totalVotedPositions = voter.votedPositions
        ? voter.votedPositions.length
        : 0;

      // Use the bootstrap dashboard which has no syntax errors
      res.render("voter/dashboard-bootstrap", {
        title: "Voter Dashboard",
        settings,
        positions: votingStatus,
        voter,
        totalVotedPositions,
        messages: req.flash(),
      });
    } catch (error) {
      console.error("Error rendering voter dashboard:", error);
      req.flash(
        "error",
        "Failed to load the dashboard. Please try again later."
      );
      res.redirect("/");
    }
  },
  // Render voter profile page
  renderProfile: async (req, res) => {
    try {
      const settings = await SystemSetting.getSettings();
      const voter = req.session.voter;

      // Get all positions
      const positions = await Position.find({ isActive: true });

      res.render("voter/profile", {
        title: "Voter Profile",
        settings,
        positions,
        voter,
        messages: req.flash(),
      });
    } catch (error) {
      console.error("Error rendering voter profile:", error);
      req.flash(
        "error",
        "Failed to load the profile page. Please try again later."
      );
      res.redirect("/dashboard");
    }
  },
};

module.exports = homeController;
