const express = require("express");
const router = express.Router();
const connection = require("../../models/connection");
const adminController = require("../../controllers/adminController");
const authMiddleware = require("../../middlewares/authMiddleware");
const adminContestantRoute = require("./adminContestantRoute");

// Admin authentication route
router.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;

  try {
    const isAuthenticated = await adminController.authenticateAdmin(
      username,
      password
    );

    if (isAuthenticated) {
      // Authentication successful
      req.session.admin = true;
      req.flash("success", "Login successful.");
      res.redirect("/admin/dashboard");
    } else {
      // Authentication failed
      req.flash("error", "Incorrect username or password. Please try again.");
      res.redirect("/admin/login");
    }
  } catch (error) {
    console.error("Error during admin authentication:", error);
    req.flash("error", "Internal Server Error");
    res.redirect("/admin/login");
  }
});

// Use the authMiddleware to secure routes
router.use(authMiddleware);

// Admin dashboard route
router.get("/dashboard", async (req, res) => {
  try {
    // Get the admin dashboard data
    const awards = await adminController.getDashboardData();

    // Render the admin dashboard with the fetched data
    res.render("admin/admin-dashboard", { awards });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    req.flash("error", "Internal Server Error");
    res.redirect("/admin/login");
  }
});

router.get("/add-contestant", adminContestantRoute);

// Admin logout route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/admin/login");
  });
});

module.exports = router;
