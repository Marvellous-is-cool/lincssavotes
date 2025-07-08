const fs = require("fs");
const path = require("path");

/**
 * Log vote activity to a file
 * @param {string} nickname - Contestant's nickname
 * @param {number} votes - Number of votes cast
 * @param {string} status - Status of the vote (success/failed)
 * @param {object} contestantInfo - Additional contestant info
 */
function logVoteActivity(nickname, votes, status, contestantInfo = {}) {
  const timestamp = new Date().toISOString();
  const logDir = path.join(__dirname, "..", "logs");

  // Ensure log directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

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

  const logFilePath = path.join(logDir, "votes.log");

  fs.appendFile(logFilePath, JSON.stringify(logMessage) + "\n", (err) => {
    if (err) {
      console.error("Error writing to vote log file:", err);
    }
  });
}

module.exports = {
  logVoteActivity,
};
