const { Position, Contestant, User, SystemSetting } = require("../models");
const mongoose = require("mongoose");

const voteController = {
  // Render the main voting page with all positions
  renderVotePositions: async (req, res) => {
    try {
      const voterId = req.session.voter.id;
      const settings = await SystemSetting.getSettings();

      // Check if voting is enabled globally
      if (!settings.votingEnabled) {
        req.flash("info", "Voting is currently disabled");
        return res.redirect("/dashboard");
      }

      // Get all active positions
      const positions = await Position.find({ isActive: true });

      // Get voter information to check voted positions
      const voter = await User.findById(voterId);

      // Add voting status to each position
      const positionsWithStatus = positions.map((position) => {
        const hasVoted = voter.votedPositions.includes(position._id.toString());
        return {
          ...position.toObject(),
          hasVoted,
        };
      });

      // Render the positions listing page
      res.render("voter/vote-positions", {
        title: "Vote - Available Positions",
        positions: positionsWithStatus,
        voter: req.session.voter,
        settings,
        messages: req.flash(),
      });
    } catch (error) {
      console.error("Error rendering voting positions:", error);
      req.flash("error", "Something went wrong. Please try again.");
      res.redirect("/dashboard");
    }
  },

  // Render the voting page for a specific position
  renderVotePage: async (req, res) => {
    try {
      const positionId = req.params.positionId;
      const voterId = req.session.voter.id;

      // Get the settings
      const settings = await SystemSetting.getSettings();

      // Check if voting is enabled globally
      if (!settings.votingEnabled) {
        req.flash("info", "Voting is currently disabled");
        return res.redirect("/dashboard");
      }

      // Get the position
      const position = await Position.findById(positionId);
      if (!position) {
        req.flash("error", "Position not found");
        return res.redirect("/dashboard");
      }

      // Check if voting is enabled for this position
      if (!position.isActive) {
        req.flash("info", "Voting for this position is not currently active");
        return res.redirect("/dashboard");
      }

      // Check if the user has already voted for this position
      const voter = await User.findById(voterId);
      if (voter.votedPositions.includes(positionId)) {
        req.flash("info", "You have already voted for this position");
        return res.redirect("/dashboard");
      }

      // Get contestants for this position
      const contestants = await Contestant.find({ position: positionId });

      // Use the Bootstrap template with path safety
      const templatePath = req.path.includes('/voter/') ? 'vote-bootstrap' : 'voter/vote-bootstrap';
      
      res.render(templatePath, {
        title: `Vote for ${position.title}`,
        position,
        contestants,
        settings,
        voter: req.session.voter,
        messages: req.flash(),
        // Add debug info
        debug: {
          originalPath: "voter/vote-bootstrap",
          usedPath: templatePath,
          reqPath: req.path
        }
      });
    } catch (error) {
      console.error("Error rendering voting page:", error);
      req.flash("error", "Something went wrong. Please try again.");
      res.redirect("/dashboard");
    }
  },

  // Process a vote
  submitVote: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { positionId, contestantId, contestantIds, multipleSelections } =
        req.body;
      const voterId = req.session.voter.id;

      // Get the settings
      const settings = await SystemSetting.getSettings();

      // Check if voting is enabled
      if (!settings.votingEnabled) {
        req.flash("info", "Voting is currently disabled");
        return res.redirect("/dashboard");
      }

      // Validate the position
      const position = await Position.findById(positionId);
      if (!position || !position.isActive) {
        req.flash(
          "error",
          "Invalid position or voting is not active for this position"
        );
        return res.redirect("/dashboard");
      }

      // Check if the user has already voted for this position
      const voter = await User.findById(voterId);
      if (voter.votedPositions.includes(positionId)) {
        req.flash("info", "You have already voted for this position");
        return res.redirect("/dashboard");
      }

      // Handle multiple selections
      if (
        multipleSelections === "true" &&
        contestantIds &&
        contestantIds.length > 0
      ) {
        // Validate selection count
        if (contestantIds.length > position.maxSelection) {
          req.flash(
            "error",
            `You can select a maximum of ${position.maxSelection} candidates for this position`
          );
          return res.redirect(`/vote/${positionId}`);
        }

        // Validate all contestants
        const contestants = await Contestant.find({
          _id: { $in: contestantIds },
          position: positionId,
        });

        if (contestants.length !== contestantIds.length) {
          req.flash("error", "One or more selected contestants are invalid");
          return res.redirect(`/vote/${positionId}`);
        }

        // Update vote counts for all selected contestants
        for (const id of contestantIds) {
          await Contestant.findByIdAndUpdate(
            id,
            { $inc: { votes: 1 } },
            { session }
          );
        }

        // Update the user's voting record
        await User.findByIdAndUpdate(
          voterId,
          {
            $push: { votedPositions: positionId },
            $set: { updated_at: new Date() },
          },
          { session }
        );

        // Update the session data
        if (!req.session.voter.votedPositions) {
          req.session.voter.votedPositions = [];
        }
        req.session.voter.votedPositions.push(positionId);

        await session.commitTransaction();
        session.endSession();

        // Render the multiple selection success page
        return res.render("voteSuccess-multiple", {
          title: "Votes Successful",
          voter: req.session.voter,
          contestantsCount: contestantIds.length,
          position,
          settings,
          messages: req.flash(
            "success",
            `Your votes for ${contestantIds.length} candidates have been recorded. Thank you for participating!`
          ),
        });
      }
      // Handle single selection
      else if (contestantId) {
        // Validate the contestant
        const contestant = await Contestant.findOne({
          _id: contestantId,
          position: positionId,
        });

        if (!contestant) {
          req.flash("error", "Invalid contestant for this position");
          return res.redirect(`/vote/${positionId}`);
        }

        // Update the contestant's vote count
        await Contestant.findByIdAndUpdate(
          contestantId,
          { $inc: { votes: 1 } },
          { session }
        );

        // Update the user's voting record
        await User.findByIdAndUpdate(
          voterId,
          {
            $push: { votedPositions: positionId },
            $set: { updated_at: new Date() },
          },
          { session }
        );

        // Update the session data
        if (!req.session.voter.votedPositions) {
          req.session.voter.votedPositions = [];
        }
        req.session.voter.votedPositions.push(positionId);

        await session.commitTransaction();
        session.endSession();

        // Render the Bootstrap success page
        return res.render("voteSuccess-bootstrap", {
          title: "Vote Successful",
          voter: req.session.voter,
          contestant,
          position,
          settings,
          messages: req.flash(
            "success",
            "Your vote has been recorded. Thank you for participating!"
          ),
        });
      } else {
        req.flash("error", "No candidate was selected");
        return res.redirect(`/vote/${positionId}`);
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      console.error("Error processing vote:", error);
      req.flash("error", "Failed to record your vote. Please try again.");
      res.redirect(`/vote/${req.body.positionId}`);
    }
  },

  // View election results
  renderResults: async (req, res) => {
    try {
      const settings = await SystemSetting.getSettings();

      // Always show results for demo purposes, comment out the check below
      // if (!settings.displayResults && !req.session.admin) {
      //   req.flash("info", "Election results are not currently available");
      //   return res.redirect("/");
      // }

      // Get all positions
      const positions = await Position.find();

      // Get contestants for each position
      const positionsWithResults = await Promise.all(
        positions
          .filter((pos) => pos.displayResults || req.session.admin)
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

      // Get total voter stats
      const voterCount = await User.countDocuments();
      const votedCount = await User.countDocuments({
        votedPositions: { $exists: true, $not: { $size: 0 } },
      });
      const votingRate =
        voterCount > 0 ? Math.round((votedCount / voterCount) * 100) : 0;

      // Calculate total votes for each position
      const positionsWithTotalVotes = positionsWithResults.map((position) => {
        const totalVotes = position.contestants.reduce(
          (sum, c) => sum + (c.votes || 0),
          0
        );
        return {
          ...position,
          totalVotes,
        };
      });

      res.render("results-new", {
        title: "Election Results",
        positionsWithResults: positionsWithTotalVotes,
        isAdmin: !!req.session.admin,
        settings,
        voter: req.session.voter,
        messages: req.flash(),
        voterCount,
        votedCount,
        votingRate,
      });
    } catch (error) {
      console.error("Error rendering results page:", error);
      req.flash(
        "error",
        "Failed to load election results. Please try again later."
      );
      res.redirect("/");
    }
  },
};

module.exports = voteController;
