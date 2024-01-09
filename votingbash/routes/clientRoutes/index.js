// clientRoutes/index.js
const express = require("express");
const router = express.Router();
const clientController = require("../../controllers/clientController");
const voteNowRouter = require("./voteNow.js");

router.get("/", async (req, res) => {
  try {
    const awards = await clientController.getAwards();
    res.render("index", { awards });
  } catch (error) {
    console.error("Error rendering index:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Admin login route
router.get("/admin/login", (req, res) => {
  const error = req.flash("error")[0]; // Get the first error message
  res.render("admin/admin-login", { error });
});

router.use("/", voteNowRouter);

// Define the route for /voteNowSucess
router.get("/voteNowSucess", async (req, res) => {
  try {
    const { status, email, nickname } = req.query;

    // Fetch contestant details by nickname
    const selectedContestant = await clientController.getContestantByNickname(
      nickname
    );

    res.render("voteNowSucess", {
      status,
      email,
      nickname,
      selectedContestant,
    });
  } catch (error) {
    console.error("Error fetching contestant details:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/contestant/:nickname/votenow/payment", async (req, res) => {
  try {
    const nickname = req.params.nickname;

    // Fetch contestant details by nickname
    const selectedContestant = await clientController.getContestantByNickname(
      nickname
    );

    res.render("voteNow", { selectedContestant });
  } catch (error) {
    console.error("Error fetching contestant details:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/vote", async (req, res) => {
  try {
    const { award } = req.body;

    // Fetch selected award details
    const selectedAward = await clientController.getSelectedAward(award);

    // Fetch contestants for the selected award
    const contestants = await clientController.getContestantsForAward(award);

    res.render("contestants", {
      selectedAward,
      contestants,
    });
  } catch (error) {
    console.error("Error processing vote:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
