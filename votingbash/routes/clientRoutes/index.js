const express = require("express");
const router = express.Router();
const clientController = require("../../controllers/clientController");
const adminController = require("../../controllers/adminController");
const voteNowRouter = require("./voteNow.js");
const authMiddleware = require("../../middlewares/authMiddleware");
const adminContestantRouter = require("../adminRoutes/adminContestantRoute"); // Import the adminContestantRoute

// Index route
// router.get("/", async (req, res) => {
//   try {
//     const awards = await clientController.getAwards();
//     res.render("index", { awards });
//   } catch (error) {
//     console.error("Error rendering index:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

router.get("/", async (req, res) => {
  res.render("suspended");
});

// Apply authMiddleware only to the routes under /admin
router.use("/admin", authMiddleware, adminContestantRouter);

// Admin login route accessible without /admin prefix
router.get("/login", (req, res) => {
  const error = req.flash("error")[0]; // Get the first error message
  res.render("admin-login", { error });
});

// Admin authentication route
router.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;

  try {
    const { success, error, admin } = await adminController.authenticateAdmin(
      username,
      password
    );

    if (success) {
      // Authentication successful
      req.session.regenerate((err) => {
        if (err) {
          console.error("Error regenerating session:", err);
          res.status(500).send("Internal Server Error");
        } else {
          req.session.admin = true;
          req.session.adminUsername = admin.username; // Include admin's username

          // Set session expiration to 20 hours from now
          const sessionExpiration = 20 * 60 * 60 * 1000; // 20 hours in milliseconds
          req.session.cookie.expires = new Date(Date.now() + sessionExpiration);
          req.session.cookie.maxAge = sessionExpiration;

          res.redirect("/admin/dashboard");
        }
      });
    } else {
      // Authentication failed
      req.flash(
        "error",
        error || "Incorrect username or password. Please try again."
      );
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error during admin authentication:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Logout route
router.get("/logout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal Server Error");
    } else {
      // Redirect to the login page after destroying the session
      res.redirect("/");
    }
  });
});

// Endpoint to handle session destruction when the tab or connection is closed
router.post("/destroy-session", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.sendStatus(200);
    }
  });
});

// router.use("/", voteNowRouter);

// // Define the route for /voteNowSucess
// router.get("/voteNowSucess", async (req, res) => {
//   try {
//     const { status, email, nickname } = req.query;

//     // Fetch contestant details by nickname
//     const selectedContestant = await clientController.getContestantByNickname(
//       nickname
//     );

//     res.render("voteNowSucess", {
//       status,
//       email,
//       nickname,
//       selectedContestant,
//     });
//   } catch (error) {
//     console.error("Error fetching contestant details:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// router.get("/contestant/:nickname/votenow/payment", async (req, res) => {
//   try {
//     const nickname = req.params.nickname;

//     // Fetch contestant details by nickname
//     const selectedContestant = await clientController.getContestantByNickname(
//       nickname
//     );

//     res.render("voteNow", { selectedContestant });
//   } catch (error) {
//     console.error("Error fetching contestant details:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// router.post("/vote", async (req, res) => {
//   try {
//     const { award } = req.body;

//     // Fetch selected award details
//     const selectedAward = await clientController.getSelectedAward(award);

//     // Fetch contestants for the selected award
//     const contestants = await clientController.getContestantsForAward(award);

//     res.render("contestants", {
//       selectedAward,
//       contestants,
//     });
//   } catch (error) {
//     console.error("Error processing vote:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Endpoint to handle session destruction when the tab or connection is closed
// router.post("/destroy-session", (req, res) => {
//   // Destroy the session
//   req.session.destroy((err) => {
//     if (err) {
//       console.error("Error destroying session:", err);
//       res.status(500).send("Internal Server Error");
//     } else {
//       res.sendStatus(200);
//     }
//   });
// });

module.exports = router;
