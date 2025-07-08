const fs = require("fs");
const path = require("path");

/**
 * Log vote activity to console (works in all environments)
 * @param {string} nickname - Contestant's nickname
 * @param {number} votes - Number of votes cast
 * @param {string} status - Status of the vote (success/failed)
 * @param {object} contestantInfo - Additional contestant info
 */
function logVoteActivity(nickname, votes, status, contestantInfo = {}) {
  const timestamp = new Date().toISOString();

  const logMessage = {
    timestamp,
    nickname,
    votes,
    status,
    contestantInfo: {
      id: contestantInfo.id || "unknown",
      award: contestantInfo.award_titles
        ? contestantInfo.award_titles.join(", ")
        : "unknown",
    },
  };

  // Always use console logging for simplicity
  console.log("VOTE_ACTIVITY:", JSON.stringify(logMessage));
}

module.exports = {
  logVoteActivity,
};
