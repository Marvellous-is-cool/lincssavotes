// awardContestantController.js

const { Contestant, Award } = require("../models");

// Function to get contestants for a specific award
async function getContestantsForAward(awardId) {
  try {
    const contestants = await Contestant.find({ awards: awardId });
    return contestants;
  } catch (error) {
    console.error(
      "Error executing query in awardContestantController.js:",
      error
    );
    throw error;
  }
}

// Function to link a contestant to an award
async function linkContestantToAward(contestantId, awardId) {
  try {
    const result = await Contestant.findByIdAndUpdate(
      contestantId,
      { $addToSet: { awards: awardId } }, // $addToSet ensures no duplicates
      { new: true }
    );
    return result;
  } catch (error) {
    console.error("Error linking contestant to award:", error);
    throw error;
  }
}

// Function to unlink a contestant from all awards
async function unlinkContestantFromAllAwards(contestantId) {
  try {
    const result = await Contestant.findByIdAndUpdate(
      contestantId,
      { $set: { awards: [] } },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error("Error unlinking contestant from all awards:", error);
    throw error;
  }
}

// Function to get awards for a specific contestant
async function getAwardsForContestant(contestantId) {
  try {
    const contestant = await Contestant.findById(contestantId).populate(
      "awards"
    );
    return contestant ? contestant.awards : [];
  } catch (error) {
    console.error("Error getting awards for contestant:", error);
    throw error;
  }
}

module.exports = {
  getContestantsForAward,
  linkContestantToAward,
  unlinkContestantFromAllAwards,
  getAwardsForContestant,
  // Add other functions as needed...
};
