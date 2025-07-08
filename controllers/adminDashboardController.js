const { Position, Contestant, User, SystemSetting } = require("../models");
const uploadFile = require("../helpers/uploadFile");

const adminController = {
  // Dashboard - Overview of the election system
  renderDashboard: async (req, res) => {
    try {
      const settings = await SystemSetting.getSettings();

      // Get position counts
      const positionCount = await Position.countDocuments();

      // Get contestant counts
      const contestantCount = await Contestant.countDocuments();

      // Get voter counts
      const voterCount = await User.countDocuments();
      const votedCount = await User.countDocuments({
        votedPositions: { $exists: true, $not: { $size: 0 } },
      });

      // Calculate voting rate percentage
      const votingRate =
        voterCount > 0 ? Math.round((votedCount / voterCount) * 100) : 0;

      // Get positions with contestant data
      const positions = await Position.find().sort({ order: 1, title: 1 });

      const positionsWithContestants = await Promise.all(
        positions.map(async (position) => {
          const contestants = await Contestant.find({
            position: position._id,
          }).sort({ votes: -1 });

          return {
            ...position.toObject(),
            contestants,
          };
        })
      );

      // Use the ultra-modern dashboard
      res.render("admin/dashboard-ultramodern", {
        title: "Admin Dashboard",
        settings,
        stats: {
          positionCount,
          contestantCount,
          voterCount,
          votedCount,
          votingRate,
        },
        positions: positionsWithContestants,
      });
    } catch (error) {
      console.error("Error rendering admin dashboard:", error);
      req.flash("error", "Failed to load dashboard data");
      res.render("admin/dashboard-ultramodern", {
        title: "Admin Dashboard",
        stats: {},
        positions: [],
        settings: {},
      });
    }
  },

  // System Settings
  renderSystemSettings: async (req, res) => {
    try {
      const settings = await SystemSetting.getSettings();

      res.render("admin/settings-ultramodern-new", {
        title: "System Settings",
        settings,
      });
    } catch (error) {
      console.error("Error rendering system settings:", error);
      req.flash("error", "Failed to load system settings");
      res.redirect("/admin/dashboard");
    }
  },

  updateSystemSettings: async (req, res) => {
    try {
      const {
        votingEnabled,
        registrationEnabled,
        displayResults,
        maintenanceMode,
        votingStartDate,
        votingEndDate,
        electionTitle,
        electionDescription,
        colorTheme,
        layoutStyle,
        showAnimations,
        twoFactorAuth,
        loginAttemptsLimit,
        emailNotifications,
        adminEmail,
        notifyLogin,
        notifyVoting,
        notifySystem,
      } = req.body;

      // Handle file upload for custom logo if present
      let customLogoUrl = "";
      if (req.files && req.files.customLogo) {
        const logoFile = req.files.customLogo;
        customLogoUrl = await uploadFile(logoFile, "logos");
      }

      // Update settings
      await SystemSetting.findOneAndUpdate(
        {},
        {
          // General Settings
          votingEnabled: !!votingEnabled,
          registrationEnabled: !!registrationEnabled,
          displayResults: !!displayResults,
          maintenanceMode: !!maintenanceMode,
          votingStartDate: votingStartDate || null,
          votingEndDate: votingEndDate || null,
          electionTitle: electionTitle || "LINCSSA VOTES",
          electionDescription: electionDescription || "Student Union Election",

          // Appearance Settings
          colorTheme: colorTheme || "default",
          layoutStyle: layoutStyle || "modern",
          showAnimations: !!showAnimations,
          customLogoUrl: customLogoUrl || undefined, // Only update if a new logo was uploaded

          // Security Settings
          twoFactorAuth: !!twoFactorAuth,
          loginAttemptsLimit: parseInt(loginAttemptsLimit) || 5,

          // Notification Settings
          emailNotifications: !!emailNotifications,
          adminEmail: adminEmail || "",
          notifyLogin: !!notifyLogin,
          notifyVoting: !!notifyVoting,
          notifySystem: !!notifySystem,

          // Update timestamp
          updated_at: new Date(),
        },
        { upsert: true, new: true }
      );

      req.flash("success", "System settings updated successfully");
      res.redirect("/admin/settings");
    } catch (error) {
      console.error("Error updating system settings:", error);
      req.flash("error", "Failed to update system settings");
      res.redirect("/admin/settings");
    }
  },

  // Position Management
  renderPositions: async (req, res) => {
    try {
      const positions = await Position.find().sort({ order: 1, title: 1 });

      // Get contestant counts for each position
      const positionsWithContestantCounts = await Promise.all(
        positions.map(async (position) => {
          const contestantCount = await Contestant.countDocuments({
            position: position._id,
          });

          return {
            ...position.toObject(),
            contestantCount,
          };
        })
      );

      res.render("admin/positions-ultramodern", {
        title: "Manage Positions",
        positions: positionsWithContestantCounts,
      });
    } catch (error) {
      console.error("Error rendering positions page:", error);
      req.flash("error", "Failed to load positions");
      res.redirect("/admin/dashboard");
    }
  },

  createPosition: async (req, res) => {
    try {
      const { title, description, isActive, displayResults, maxSelection } =
        req.body;

      const newPosition = new Position({
        title,
        description,
        isActive: !!isActive,
        displayResults: !!displayResults,
        maxSelection: parseInt(maxSelection) || 1,
      });

      await newPosition.save();

      req.flash("success", "Position created successfully");
      res.redirect("/admin/positions");
    } catch (error) {
      console.error("Error creating position:", error);
      req.flash("error", "Failed to create position");
      res.redirect("/admin/positions");
    }
  },

  updatePosition: async (req, res) => {
    try {
      const { id, title, description, isActive, displayResults, maxSelection } =
        req.body;

      await Position.findByIdAndUpdate(id, {
        title,
        description,
        isActive: !!isActive,
        displayResults: !!displayResults,
        maxSelection: parseInt(maxSelection) || 1,
        updated_at: new Date(),
      });

      req.flash("success", "Position updated successfully");
      res.redirect("/admin/positions");
    } catch (error) {
      console.error("Error updating position:", error);
      req.flash("error", "Failed to update position");
      res.redirect("/admin/positions");
    }
  },

  deletePosition: async (req, res) => {
    try {
      const positionId = req.params.id;

      // Check if there are contestants associated with this position
      const contestantCount = await Contestant.countDocuments({
        position: positionId,
      });

      if (contestantCount > 0) {
        req.flash(
          "error",
          "Cannot delete position with associated contestants"
        );
        return res.redirect("/admin/positions");
      }

      await Position.findByIdAndDelete(positionId);

      req.flash("success", "Position deleted successfully");
      res.redirect("/admin/positions");
    } catch (error) {
      console.error("Error deleting position:", error);
      req.flash("error", "Failed to delete position");
      res.redirect("/admin/positions");
    }
  },

  // API endpoint to get settings for backup
  getSystemSettingsAPI: async (req, res) => {
    try {
      const settings = await SystemSetting.getSettings();

      // Remove sensitive information before sending
      const safeSettings = { ...settings.toObject() };

      // Send the settings as JSON
      res.json(safeSettings);
    } catch (error) {
      console.error("Error getting system settings API:", error);
      res.status(500).json({ error: "Failed to fetch system settings" });
    }
  },

  // API endpoint to restore settings from backup
  restoreSystemSettings: async (req, res) => {
    try {
      const backupData = req.body;

      if (!backupData) {
        return res.status(400).json({ error: "Invalid backup data" });
      }

      // Remove _id to prevent conflicts
      delete backupData._id;

      // Update the settings with the backup data
      await SystemSetting.findOneAndUpdate({}, backupData, { upsert: true });

      res.json({ success: true, message: "Settings restored successfully" });
    } catch (error) {
      console.error("Error restoring system settings:", error);
      res.status(500).json({ error: "Failed to restore system settings" });
    }
  },

  // Toggle position status (active/inactive)
  togglePositionStatus: async (req, res) => {
    try {
      const { id, isActive } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Position ID is required" });
      }

      const position = await Position.findById(id);

      if (!position) {
        return res
          .status(404)
          .json({ success: false, message: "Position not found" });
      }

      // Update the status
      position.isActive = !!isActive;
      position.updated_at = new Date();
      await position.save();

      res.json({
        success: true,
        message: `Position ${
          isActive ? "activated" : "deactivated"
        } successfully`,
        position,
      });
    } catch (error) {
      console.error("Error toggling position status:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update position status" });
    }
  },

  // Contestant Management
  renderContestants: async (req, res) => {
    try {
      // Get all positions sorted by order
      const positions = await Position.find().sort({ order: 1, title: 1 });

      // Fetch contestants and explicitly populate the position reference
      const allContestants = await Contestant.find()
        .populate("position")
        .sort({ name: 1 });

      // Enhance positions with their contestants
      const positionsWithContestants = await Promise.all(
        positions.map(async (position) => {
          const positionObj = position.toObject();

          // Filter contestants for this position
          const positionContestants = allContestants.filter(
            (contestant) =>
              contestant.position &&
              contestant.position._id &&
              contestant.position._id.toString() === position._id.toString()
          );

          // For debugging
          console.log(
            `Position ${position.title}: ${positionContestants.length} contestants`
          );

          return {
            ...positionObj,
            contestants: positionContestants,
            contestantCount: positionContestants.length,
          };
        })
      );

      // For debugging
      console.log(
        `Found ${positions.length} positions and ${allContestants.length} contestants`
      );

      res.render("admin/contestants-ultramodern", {
        title: "Manage Contestants",
        contestants: allContestants,
        positions: positionsWithContestants,
      });
    } catch (error) {
      console.error("Error rendering contestants page:", error);
      req.flash("error", "Failed to load contestants");
      res.redirect("/admin/dashboard");
    }
  },

  createContestant: async (req, res) => {
    try {
      const { name, nickname, bio, manifesto, level, position } = req.body;

      // Handle photo upload
      let photoUrl = "default.jpg";

      if (req.files && req.files.photo) {
        const uploadResult = await uploadFile(
          req.files.photo,
          { name },
          "photo"
        );
        photoUrl = uploadResult.photo;
      }

      const newContestant = new Contestant({
        name,
        nickname: nickname || name, // Use nickname if provided, otherwise use name
        bio,
        manifesto,
        level,
        position: position, // Use position field from the form
        photo: photoUrl,
      });

      await newContestant.save();

      req.flash("success", "Contestant added successfully");
      res.redirect("/admin/contestants");
    } catch (error) {
      console.error("Error creating contestant:", error);
      req.flash("error", "Failed to add contestant");
      res.redirect("/admin/contestants");
    }
  },

  updateContestant: async (req, res) => {
    try {
      const {
        contestantId,
        name,
        nickname,
        bio,
        manifesto,
        level,
        position, // Changed from positionId to position
        votes,
      } = req.body;

      // Get existing contestant
      const contestant = await Contestant.findById(contestantId);

      if (!contestant) {
        req.flash("error", "Contestant not found");
        return res.redirect("/admin/contestants");
      }

      // Handle photo upload if provided
      let photoUrl = contestant.photo;

      if (req.files && req.files.photo) {
        const uploadResult = await uploadFile(
          req.files.photo,
          { name },
          "photo"
        );
        photoUrl = uploadResult.photo;
      }

      // Update contestant
      await Contestant.findByIdAndUpdate(contestantId, {
        name,
        nickname,
        bio,
        manifesto,
        level,
        position: position, // Use position field from the form
        votes: parseInt(votes) || contestant.votes,
        photo: photoUrl,
        updated_at: new Date(),
      });

      req.flash("success", "Contestant updated successfully");
      res.redirect("/admin/contestants");
    } catch (error) {
      console.error("Error updating contestant:", error);
      req.flash("error", "Failed to update contestant");
      res.redirect("/admin/contestants");
    }
  },

  deleteContestant: async (req, res) => {
    try {
      const contestantId = req.params.id;

      await Contestant.findByIdAndDelete(contestantId);

      req.flash("success", "Contestant deleted successfully");
      res.redirect("/admin/contestants");
    } catch (error) {
      console.error("Error deleting contestant:", error);
      req.flash("error", "Failed to delete contestant");
      res.redirect("/admin/contestants");
    }
  },

  // Voter Management
  renderVoters: async (req, res) => {
    try {
      const voters = await User.find().sort({ matricNumber: 1 });
      const votedCount = await User.countDocuments({
        votedPositions: { $exists: true, $not: { $size: 0 } },
      });
      const votingRate =
        voters.length > 0 ? Math.round((votedCount / voters.length) * 100) : 0;

      // Calculate pending count (those who haven't voted)
      const pendingCount = voters.length - votedCount;

      // Add hasVoted flag to each voter
      const votersWithVoteStatus = await Promise.all(
        voters.map(async (voter) => {
          const hasVoted =
            voter.votedPositions && voter.votedPositions.length > 0;
          return {
            ...voter.toObject(),
            hasVoted,
          };
        })
      );

      res.render("admin/voters-ultramodern", {
        title: "Manage Voters",
        voters: votersWithVoteStatus,
        votedCount,
        pendingCount,
        votingRate,
      });
    } catch (error) {
      console.error("Error rendering voters page:", error);
      req.flash("error", "Failed to load voters");
      res.redirect("/admin/dashboard");
    }
  },

  resetVoterVotes: async (req, res) => {
    try {
      const voterId = req.params.id;

      await User.findByIdAndUpdate(voterId, {
        votedPositions: [],
        updated_at: new Date(),
      });

      req.flash("success", "Voter votes reset successfully");
      res.redirect("/admin/voters");
    } catch (error) {
      console.error("Error resetting voter votes:", error);
      req.flash("error", "Failed to reset voter votes");
      res.redirect("/admin/voters");
    }
  },

  deleteVoter: async (req, res) => {
    try {
      const voterId = req.params.id;

      await User.findByIdAndDelete(voterId);

      req.flash("success", "Voter deleted successfully");
      res.redirect("/admin/voters");
    } catch (error) {
      console.error("Error deleting voter:", error);
      req.flash("error", "Failed to delete voter");
      res.redirect("/admin/voters");
    }
  },

  // Results Management
  renderResults: async (req, res) => {
    try {
      // Get all positions
      const positions = await Position.find().sort({ order: 1, title: 1 });
      const settings = await SystemSetting.getSettings();

      // Get position and voter counts for stats
      const positionCount = await Position.countDocuments();
      const voterCount = await User.countDocuments();
      const votedCount = await User.countDocuments({
        votedPositions: { $exists: true, $not: { $size: 0 } },
      });
      const votingRate =
        voterCount > 0 ? Math.round((votedCount / voterCount) * 100) : 0;

      // Get contestants for each position
      const positionsWithResults = await Promise.all(
        positions.map(async (position) => {
          const contestants = await Contestant.find({
            position: position._id,
          }).sort({ votes: -1 });

          // For debugging
          console.log(
            `Results - Position ${position.title}: ${contestants.length} contestants`
          );

          // Calculate total votes for this position
          const totalVotes = contestants.reduce(
            (sum, c) => sum + (c.votes || 0),
            0
          );

          return {
            ...position.toObject(),
            contestants,
            totalVotes,
          };
        })
      );

      // For debugging
      console.log(`Positions with results: ${positionsWithResults.length}`);

      res.render("admin/results", {
        title: "Election Results",
        positions: positionsWithResults, // Use the enhanced positions with contestant data
        positionsWithResults: positionsWithResults, // Also provide as positionsWithResults for compatibility
        settings,
        positionCount,
        voterCount,
        votedCount,
        votingRate,
        // Also provide a stats object for backward compatibility
        stats: {
          totalVoters: voterCount,
          votedCount: votedCount,
          participationRate: votingRate,
          positionCount: positionCount,
        },
      });
    } catch (error) {
      console.error("Error rendering admin results page:", error);
      req.flash("error", "Failed to load election results");
      res.redirect("/admin/dashboard");
    }
  },

  resetAllVotes: async (req, res) => {
    try {
      // Reset votes for all contestants
      await Contestant.updateMany({}, { votes: 0 });

      // Reset voted status for all users
      await User.updateMany({}, { votedPositions: [] });

      req.flash("success", "All votes have been reset");
      res.redirect("/admin/results");
    } catch (error) {
      console.error("Error resetting all votes:", error);
      req.flash("error", "Failed to reset votes");
      res.redirect("/admin/results");
    }
  },

  // Get position by ID as JSON
  getPositionJson: async (req, res) => {
    try {
      const positionId = req.params.id;
      const position = await Position.findById(positionId);

      if (!position) {
        return res
          .status(404)
          .json({ success: false, message: "Position not found" });
      }

      res.json(position);
    } catch (error) {
      console.error("Error getting position JSON:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to get position data" });
    }
  },

  // Get all positions as JSON
  getAllPositionsJson: async (req, res) => {
    try {
      const positions = await Position.find().sort({ order: 1, title: 1 });

      const positionsWithContestants = await Promise.all(
        positions.map(async (position) => {
          const contestants = await Contestant.find({
            position: position._id,
          }).sort({ votes: -1 });

          return {
            ...position.toObject(),
            contestants,
          };
        })
      );

      res.json({
        success: true,
        positions: positionsWithContestants,
      });
    } catch (error) {
      console.error("Error getting all positions JSON:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to get positions data" });
    }
  },

  // Update positions order
  updatePositionsOrder: async (req, res) => {
    try {
      const { positions } = req.body;

      if (!positions || !Array.isArray(positions)) {
        return res.status(400).json({
          success: false,
          message: "Invalid positions data",
        });
      }

      // Update each position's order
      for (let i = 0; i < positions.length; i++) {
        const position = positions[i];

        // Check for both id and _id since frontend might use either format
        const positionId = position._id || position.id;

        if (!positionId) {
          continue; // Skip if no ID is provided
        }

        await Position.findByIdAndUpdate(positionId, {
          order: i, // Use array index as the order
          updated_at: new Date(),
        });
      }

      res.json({
        success: true,
        message: "Position order updated successfully",
      });
    } catch (error) {
      console.error("Error updating positions order:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update positions order",
      });
    }
  },
};

module.exports = adminController;
