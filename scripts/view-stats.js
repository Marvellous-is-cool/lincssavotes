#!/usr/bin/env node
// filepath: /Users/mac/Documents/My Projects/lincssavotes/scripts/view-stats.js

const fs = require("fs");
const path = require("path");

// Path to the votes log file
const voteLogPath = path.join(__dirname, "..", "logs", "votes.log");

// Check if the file exists
if (!fs.existsSync(voteLogPath)) {
  console.log("No vote logs found. Start voting to create logs!");
  process.exit(0);
}

// Read the vote log file
const voteLogContent = fs.readFileSync(voteLogPath, "utf8");
const voteEntries = voteLogContent
  .trim()
  .split("\n")
  .map((line) => {
    try {
      return JSON.parse(line);
    } catch (e) {
      return null;
    }
  })
  .filter((entry) => entry !== null);

// Total votes
const totalVotes = voteEntries.reduce((total, entry) => {
  return total + (entry.status === "success" ? entry.votes : 0);
}, 0);

// Votes by contestant
const votesByContestant = {};
voteEntries.forEach((entry) => {
  if (entry.status === "success") {
    const nickname = entry.nickname;
    if (!votesByContestant[nickname]) {
      votesByContestant[nickname] = 0;
    }
    votesByContestant[nickname] += entry.votes;
  }
});

// Display statistics
console.log("\n=============================================");
console.log("              VOTING STATISTICS              ");
console.log("=============================================\n");
console.log(`Total successful votes: ${totalVotes}`);
console.log(`Total vote transactions: ${voteEntries.length}`);
console.log("\n--- Votes by Contestant ---");

Object.entries(votesByContestant)
  .sort((a, b) => b[1] - a[1])
  .forEach(([nickname, votes], index) => {
    console.log(`${index + 1}. ${nickname}: ${votes} votes`);
  });

console.log("\n=============================================");
