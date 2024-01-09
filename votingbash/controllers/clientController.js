// clientController.js
const connection = require("../models/connection");

async function getAwards() {
  try {
    const [awards] = await connection.query("SELECT * FROM awards");
    return awards;
  } catch (error) {
    console.error("Error fetching awards:", error);
    throw error;
  }
}

async function getSelectedAward(awardId) {
  try {
    const [selectedAward] = await connection.query(
      "SELECT * FROM awards WHERE id = ?",
      [awardId]
    );
    return selectedAward[0];
  } catch (error) {
    console.error("Error fetching selected award:", error);
    throw error;
  }
}

async function getContestantsForAward(awardId) {
  try {
    const [contestants] = await connection.query(
      "SELECT * FROM contestants WHERE award_id = ?",
      [awardId]
    );
    return contestants;
  } catch (error) {
    console.error("Error fetching contestants:", error);
    throw error;
  }
}

async function incrementVotesForContestant(contestantId) {
  try {
    const updateQuery = "UPDATE contestants SET votes = votes + 1 WHERE id = ?";
    await connection.query(updateQuery, [contestantId]);
  } catch (error) {
    console.error("Error incrementing votes for contestant:", error);
    throw error;
  }
}

async function getContestantByNickname(nickname) {
  try {
    const query = `
      SELECT contestants.*, awards.title as award_title
      FROM contestants
      JOIN awards ON contestants.award_id = awards.id
      WHERE contestants.nickname = ?;
    `;
    const [contestant] = await connection.query(query, [nickname]);
    return contestant[0];
  } catch (error) {
    console.error("Error fetching contestant by nickname:", error);
    throw error;
  }
}

module.exports = {
  getAwards,
  getSelectedAward,
  getContestantsForAward,
  incrementVotesForContestant,
  getContestantByNickname,
};
