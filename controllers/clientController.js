const {
  Award,
  Contestant,
  Payment,
  SystemSetting,
  User,
  Position,
} = require("../models");
const awardContestantController = require("./awardContestantController");
const { logVoteActivity } = require("../helpers/logger");
const mongoose = require("mongoose");

async function getAwards() {
  try {
    const awards = await Award.find().sort({ title: 1 });
    return awards;
  } catch (error) {
    console.error("Error fetching awards:", error);
    throw error;
  }
}

async function getSelectedAward(awardId) {
  try {
    const selectedAward = await Award.findById(awardId);
    return selectedAward;
  } catch (error) {
    console.error("Error fetching selected award:", error);
    throw error;
  }
}

async function getContestantsForAward(awardId) {
  try {
    const contestants = await awardContestantController.getContestantsForAward(
      awardId
    );

    return contestants;
  } catch (error) {
    console.error("Error fetching contestants:", error);
    throw error;
  }
}

async function incrementVotesForContestant(contestantId, numberOfVotes) {
  try {
    await Contestant.findByIdAndUpdate(
      contestantId,
      { $inc: { votes: numberOfVotes } },
      { new: true }
    );
  } catch (error) {
    console.error("Error incrementing votes for contestant:", error);
    throw error;
  }
}

async function getContestantById(contestantId) {
  try {
    const contestant = await Contestant.findById(contestantId).populate(
      "awards"
    );

    if (!contestant) {
      return null;
    }

    // Extract award titles from the populated awards
    const awardTitles = contestant.awards.map((award) => award.title);

    return {
      ...contestant.toObject(),
      award_titles: awardTitles,
    };
  } catch (error) {
    console.error("Error fetching contestant by ID:", error);
    throw error;
  }
}

// Function to handle database queries related to votes (replaces payment handling)
async function handleVoteRecord(nickname, amount, status, selectedContestant) {
  try {
    // Get the contestant details with award_id
    const contestantDetails = await getContestantById(
      selectedContestant._id || selectedContestant.id
    );

    if (!contestantDetails) {
      console.error(
        "Contestant not found:",
        selectedContestant._id || selectedContestant.id
      );
      throw new Error("Contestant not found");
    }

    // Calculate amountDividedBy10 here
    const amountDividedBy10 = amount / 10;

    // Update existing payment or create new one
    await Payment.findOneAndUpdate(
      { contestant_nickname: nickname },
      { status: status },
      { upsert: false }
    );

    // Create new payment record
    const newPayment = new Payment({
      contestant_nickname: nickname,
      award_id:
        contestantDetails.awards && contestantDetails.awards.length > 0
          ? contestantDetails.awards[0]._id
          : null,
      amount_divided_by_10: amountDividedBy10 || null,
      payment_date: new Date(),
      status: status,
    });

    await newPayment.save();

    // Log the vote activity
    const votes = Math.floor(amount / 100); // Calculate number of votes (assuming 100 = 1 vote)
    logVoteActivity(nickname, votes, status, contestantDetails);
  } catch (error) {
    console.error("Error executing vote record queries:", error);
    throw error;
  }
}

// Function to handle database queries related to payments
async function handlePaymentQueries(
  nickname,
  amount,
  status,
  selectedContestant
) {
  // This function is kept for backward compatibility
  return handleVoteRecord(nickname, amount, status, selectedContestant);
}

// Controller methods
const clientController = {
  // Render voter settings page
  renderSettings: async (req, res) => {
    try {
      const voterId = req.session.voter.id;
      const positions = await Position.find({ isActive: true });
      const voter = await User.findById(voterId);
      const settings = await SystemSetting.getSettings();

      res.render("voter/settings", {
        title: "Voter Settings",
        voter,
        positions,
        settings,
        messages: req.flash(),
      });
    } catch (error) {
      console.error("Error rendering settings page:", error);
      req.flash("error", "Failed to load settings. Please try again.");
      res.redirect("/dashboard");
    }
  },

  // Update voter profile
  updateProfile: async (req, res) => {
    try {
      const voterId = req.session.voter.id;
      const { fullName, level, email, phoneNumber } = req.body;

      // Update the user's profile
      const updatedVoter = await User.findByIdAndUpdate(
        voterId,
        {
          $set: {
            fullName,
            level,
            email,
            phoneNumber,
            updated_at: new Date(),
          },
        },
        { new: true }
      );

      // Update session data
      req.session.voter.fullName = fullName;
      req.session.voter.level = level;
      req.session.voter.email = email;
      req.session.voter.phoneNumber = phoneNumber;

      req.flash("success", "Your profile has been updated successfully!");
      res.redirect("/voter/settings");
    } catch (error) {
      console.error("Error updating profile:", error);
      req.flash("error", "Failed to update profile. Please try again.");
      res.redirect("/voter/settings");
    }
  },

  // Render voter profile page
  renderProfile: async (req, res) => {
    try {
      const voterId = req.session.voter.id;
      const positions = await Position.find({ isActive: true });
      const voter = await User.findById(voterId);
      const settings = await SystemSetting.getSettings();

      res.render("voter/profile", {
        title: "Voter Profile",
        voter,
        positions,
        settings,
        messages: req.flash(),
      });
    } catch (error) {
      console.error("Error rendering profile page:", error);
      req.flash("error", "Failed to load profile. Please try again.");
      res.redirect("/dashboard");
    }
  },
};

module.exports = {
  getAwards,
  getSelectedAward,
  getContestantsForAward,
  incrementVotesForContestant,
  getContestantById,
  handlePaymentQueries,
  handleVoteRecord,
  clientController,
};
