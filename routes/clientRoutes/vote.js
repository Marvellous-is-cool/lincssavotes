// clientRoutes/vote.js
const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

router.post("/payment-success", async (req, res) => {
  try {
    const { contestantId } = req.body;
    await clientController.incrementVotesForContestant(contestantId);
    res.send("Payment successful! Vote counted.");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
