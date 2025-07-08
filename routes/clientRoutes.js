const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const authController = require("../controllers/authController");
const voteController = require("../controllers/voteController");
const { clientController } = require("../controllers/clientController");
const voterAuthMiddleware = require("../middlewares/voterAuthMiddleware");

// Public routes
router.get("/", homeController.renderLanding);
router.get("/results", voteController.renderResults);

// Authentication routes
router.get(
  "/register",
  voterAuthMiddleware.redirectIfAuthenticated,
  voterAuthMiddleware.isRegistrationEnabled,
  authController.renderRegister
);
router.post(
  "/register",
  voterAuthMiddleware.isRegistrationEnabled,
  authController.register
);
router.get(
  "/login",
  voterAuthMiddleware.redirectIfAuthenticated,
  authController.renderLogin
);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

// Protected routes
router.get(
  "/dashboard",
  voterAuthMiddleware.isAuthenticated,
  homeController.renderDashboard
);
router.get(
  "/vote",
  voterAuthMiddleware.isAuthenticated,
  voterAuthMiddleware.isVotingEnabled,
  voteController.renderVotePositions
);
router.get(
  "/vote/:positionId",
  voterAuthMiddleware.isAuthenticated,
  voterAuthMiddleware.isVotingEnabled,
  voteController.renderVotePage
);
router.post(
  "/vote",
  voterAuthMiddleware.isAuthenticated,
  voterAuthMiddleware.isVotingEnabled,
  voteController.submitVote
);
router.get(
  "/voter/settings",
  voterAuthMiddleware.isAuthenticated,
  clientController.renderSettings
);

// Profile routes - both /profile and /voter/profile should work
router.get(
  "/profile",
  voterAuthMiddleware.isAuthenticated,
  clientController.renderProfile
);

router.get(
  "/voter/profile",
  voterAuthMiddleware.isAuthenticated,
  clientController.renderProfile
);

// Update profile route
router.post(
  "/voter/update-profile",
  voterAuthMiddleware.isAuthenticated,
  clientController.updateProfile
);

module.exports = router;
