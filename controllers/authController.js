const { User, SystemSetting } = require("../models");

const authController = {
  // Render the registration form
  renderRegister: async (req, res) => {
    try {
      const settings = await SystemSetting.getSettings();
      if (!settings.registrationEnabled) {
        req.flash("info", "Registration is currently disabled");
        return res.redirect("/");
      }

      res.render("auth/register-redesign", {
        title: "Register to Vote",
        settings,
        messages: req.flash(),
      });
    } catch (error) {
      console.error("Error rendering registration page:", error);
      req.flash("error", "Something went wrong. Please try again.");
      res.redirect("/");
    }
  },

  // Process registration
  register: async (req, res) => {
    try {
      const { fullName, matricNumber, level, phoneNumber } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ matricNumber });
      if (existingUser) {
        req.flash("error", "A user with this matric number already exists");
        return res.redirect("/register");
      }

      // Create new user
      const newUser = new User({
        fullName,
        matricNumber,
        level,
        phoneNumber,
      });

      await newUser.save();

      req.flash("success", "Registration successful! You can now login.");
      res.redirect("/login");
    } catch (error) {
      console.error("Error registering user:", error);

      // Handle validation errors
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        req.flash("error", messages.join(", "));
      } else {
        req.flash("error", "Registration failed. Please try again.");
      }

      res.redirect("/register");
    }
  },

  // Render login form
  renderLogin: async (req, res) => {
    try {
      const settings = await SystemSetting.getSettings();

      res.render("auth/login-redesign", {
        title: "Login to Vote",
        settings,
        messages: req.flash(),
      });
    } catch (error) {
      console.error("Error rendering login page:", error);
      req.flash("error", "Something went wrong. Please try again.");
      res.redirect("/");
    }
  },

  // Process login
  login: async (req, res) => {
    try {
      const { matricNumber, phoneNumber } = req.body;

      // Find the user
      const user = await User.findOne({ matricNumber, phoneNumber });

      if (!user) {
        req.flash("error", "Invalid credentials. Please try again.");
        return res.redirect("/login");
      }

      // Store user data in session
      req.session.voter = {
        id: user._id,
        fullName: user.fullName,
        matricNumber: user.matricNumber,
        level: user.level,
        department: user.department || "Computer Science",
        hasVoted: user.hasVoted,
        votedPositions: user.votedPositions,
      };

      // Redirect to the previously attempted URL or dashboard
      const redirectUrl = req.session.returnTo || "/dashboard";
      delete req.session.returnTo;

      req.flash("success", "Login successful!");
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Error logging in:", error);
      req.flash("error", "Login failed. Please try again.");
      res.redirect("/login");
    }
  },

  // Logout
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.redirect("/");
    });
  },
};

module.exports = authController;
