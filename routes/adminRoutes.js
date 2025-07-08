const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminDashboardController = require("../controllers/adminDashboardController");
const authMiddleware = require("../middlewares/authMiddleware");

// Admin login (these routes don't require authentication)
router.get("/login", (req, res) => {
  res.render("admin/login-ultramodern", { title: "Admin Login" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate input
    if (!username || !password) {
      req.flash("error", "Username and password are required");
      return res.redirect("/admin/login");
    }

    const result = await adminController.authenticateAdmin(username, password);

    if (result.success) {
      // Set admin session with more details
      req.session.admin = {
        id: result.admin._id,
        username: result.admin.username,
        lastLogin: new Date().toISOString(),
        isAdmin: true,
      };

      // Log successful login
      console.log(
        `Admin login successful: ${username} at ${new Date().toISOString()}`
      );

      req.flash("success", "Login successful! Welcome to the admin dashboard.");
      res.redirect("/admin/dashboard");
    } else {
      // Log failed login attempt
      console.log(
        `Failed admin login attempt: ${username} at ${new Date().toISOString()}`
      );

      req.flash("error", result.error || "Invalid credentials");
      res.redirect("/admin/login");
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    req.flash(
      "error",
      "An error occurred during login. Please try again later."
    );
    res.redirect("/admin/login");
  }
});

// Admin logout
router.get("/logout", (req, res) => {
  req.session.admin = null;
  req.flash("success", "Logout successful");
  res.redirect("/admin/login");
});

// Protected admin routes
router.use(authMiddleware.isAdmin);

// Dashboard
router.get("/dashboard", adminDashboardController.renderDashboard);

// System Settings
router.get("/settings", adminDashboardController.renderSystemSettings);
router.post("/settings", adminDashboardController.updateSystemSettings);

// Position Management
router.get("/positions", adminDashboardController.renderPositions);
router.get("/positions/add", (req, res) => res.redirect("/admin/positions")); // Redirect GET requests to the main positions page
router.post("/positions/add", adminDashboardController.createPosition);
router.post("/positions/create", adminDashboardController.createPosition); // Keep for backward compatibility
router.post("/positions/edit", adminDashboardController.updatePosition);
router.post("/positions/update", adminDashboardController.updatePosition); // Keep for backward compatibility
router.post("/positions/delete/:id", adminDashboardController.deletePosition);
router.post(
  "/positions/toggle-status",
  adminDashboardController.togglePositionStatus
);
router.post(
  "/positions/update-order",
  adminDashboardController.updatePositionsOrder
);

// Contestant Management
router.get("/contestants", adminDashboardController.renderContestants);
router.get("/contestants/add", (req, res) =>
  res.redirect("/admin/contestants")
); // Redirect GET requests to the main contestants page
router.post("/contestants/add", adminDashboardController.createContestant);
router.post("/contestants/create", adminDashboardController.createContestant); // Keep for backward compatibility
router.post("/contestants/edit", adminDashboardController.updateContestant);
router.post("/contestants/update", adminDashboardController.updateContestant); // Keep for backward compatibility
router.post(
  "/contestants/delete/:id",
  adminDashboardController.deleteContestant
);
// Fallback route in case the ID isn't in the URL
router.post("/contestants/delete", (req, res) => {
  req.flash("error", "Contestant ID is required to delete");
  res.redirect("/admin/contestants");
});

// Voter Management
router.get("/voters", adminDashboardController.renderVoters);
router.post("/voters/reset/:id", adminDashboardController.resetVoterVotes);
router.post("/voters/delete/:id", adminDashboardController.deleteVoter);

// Results Management
router.get("/results", adminDashboardController.renderResults);
router.post("/results/reset-all", adminDashboardController.resetAllVotes);

// API JSON endpoints
router.get("/positions/:id/json", adminDashboardController.getPositionJson);
router.get("/positions/data", adminDashboardController.getAllPositionsJson);
router.get("/api/settings", adminDashboardController.getSystemSettingsAPI);
router.post(
  "/api/settings/restore",
  adminDashboardController.restoreSystemSettings
);

module.exports = router;
