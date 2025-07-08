const fs = require("fs");
const path = require("path");
const { isServerless, envLog } = require("./envUtils");

/**
 * Log vote activity to a file (local) or console (serverless)
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

  // Use console logging in serverless environments
  if (isServerless()) {
    envLog(`VOTE_ACTIVITY: ${JSON.stringify(logMessage)}`);
    return;
  }

  // Use file logging in local environments
  const logDir = path.join(__dirname, "..", "logs");

  try {
    // Ensure log directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFilePath = path.join(logDir, "votes.log");

    fs.appendFile(logFilePath, JSON.stringify(logMessage) + "\n", (err) => {
      if (err) {
        console.error("Error writing to vote log file:", err);
        // Fallback to console logging if file write fails
        envLog(`VOTE_ACTIVITY_FALLBACK: ${JSON.stringify(logMessage)}`, "warn");
      }
    });
  } catch (error) {
    console.error("Error creating log directory or writing log:", error);
    // Fallback to console logging
    envLog(`VOTE_ACTIVITY_FALLBACK: ${JSON.stringify(logMessage)}`, "error");
  }
}

module.exports = {
  logVoteActivity,
};
