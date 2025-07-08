const express = require("express");
const router = express.Router();
const clientController = require("../../controllers/clientController");
const awardContestantController = require("../../controllers/awardContestantController");

// Direct vote endpoint (without payment)
router.post("/:id/vote", async (req, res) => {
  try {
    const contestantId = req.params.id;
    const selectedContestant = await clientController.getContestantById(
      contestantId
    );

    // Extract email and number of votes from the request body
    const { email, numberOfVotes = 1 } = req.body;
    const votes = parseInt(numberOfVotes);

    if (selectedContestant) {
      // Increment votes for the contestant
      await clientController.incrementVotesForContestant(contestantId, votes);

      // Record the vote in the database (we'll update the controller function)
      await clientController.handleVoteRecord(
        selectedContestant.nickname,
        votes * 100, // multiply by 100 to maintain similar data structure (100 = 1 vote)
        "success",
        selectedContestant
      );

      // Redirect to success page
      res.redirect(
        `/voteNowSucess?status=success&email=${email}&contestantId=${contestantId}`
      );
    } else {
      res.status(404).json({ error: "Contestant not found" });
    }
  } catch (error) {
    console.error("Error processing vote:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
