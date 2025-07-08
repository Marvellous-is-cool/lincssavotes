// controllers/adminController.js

const { Award, Contestant, Admin } = require("../models");
const uploadFile = require("../helpers/uploadFile");
const awardContestantController = require("./awardContestantController");

const adminController = {
  // Get admin dashboard data (e.g., award titles)
  getDashboardData: async () => {
    try {
      const awards = await Award.find().sort({ title: 1 });

      // Fetch contestants for each award using the awardContestantController
      const awardsWithContestants = await Promise.all(
        awards.map(async (award) => {
          const contestants =
            await awardContestantController.getContestantsForAward(award._id);
          return { ...award.toObject(), contestants };
        })
      );

      return awardsWithContestants;
    } catch (error) {
      console.error(
        "ADMINCONTROLLER - Error fetching award titles and contestants:",
        error
      );
      throw new Error("ADMINCONTROLLER - Internal Server Error");
    }
  },

  // Get award titles for the dropdown
  getAwardTitles: async () => {
    try {
      const awards = await Award.find().select("_id title").sort({ title: 1 });
      return awards;
    } catch (error) {
      console.error("ADMINCONTROLLER - Error fetching award titles:", error);
      throw new Error("ADMINCONTROLLER - Internal Server Error");
    }
  },

  // Authenticate admin
  authenticateAdmin: async (username, password) => {
    try {
      // Added error handling for empty inputs
      if (!username || !password) {
        return {
          success: false,
          error: "Username and password are required",
          admin: null,
        };
      }

      // Convert username to lowercase for case-insensitive matching
      const admin = await Admin.findOne({
        username: username.toLowerCase(),
      });

      // Check if admin exists
      if (!admin) {
        return {
          success: false,
          error: "Admin account not found",
          admin: null,
        };
      }

      // Check if password matches
      if (admin.password !== password) {
        return {
          success: false,
          error: "Incorrect password",
          admin: null,
        };
      }

      // Authentication successful
      console.log(`Admin login successful: ${username}`);

      const result = {
        success: true,
        error: null,
        admin: admin, // Include admin data for session
      };

      return result;
    } catch (error) {
      console.error("ADMINCONTROLLER - Error authenticating admin:", error);
      throw new Error("ADMINCONTROLLER - Internal Server Error");
    }
  },

  // Add Contestant operation
  addContestant: async (req, res) => {
    const { contestantName, contestantLevel, selectedAwardId } = req.body;

    // Check if contestantName is set before proceeding
    if (!contestantName) {
      console.error(
        "ADMINCONTROLLER - Contestant name is missing in the request."
      );
      res.status(400).send("Contestant name is required.");
      return;
    }

    // Use uploadFile to handle file upload and get the generated filename
    const contestantData = await uploadFile(
      req.files.contestantPhoto,
      { name: contestantName }, // Pass an object with a 'name' property
      "photo"
    );

    try {
      // Create a new contestant document
      const newContestant = new Contestant({
        name: contestantName,
        nickname: contestantName, // Using name as nickname
        level: contestantLevel,
        votes: 0,
        photo: contestantData.photo || "default.jpg",
        awards: [selectedAwardId], // Directly associate with award
      });

      // Save the contestant
      const savedContestant = await newContestant.save();

      req.flash("success", "Contestant added successfully.");
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.error("ADMINCONTROLLER - Error adding contestant:", error);

      // Provide a user-friendly error message based on the type of error
      if (error.code === 11000) {
        // MongoDB duplicate key error
        res
          .status(400)
          .send("Contestant with the same name already exists for this award.");
      } else {
        // Generic internal server error message
        res.status(500).send("Internal Server Error");
      }
    }
  },

  // Delete Contestant operation
  deleteContestant: async (awardId, contestantId) => {
    try {
      // Fetch the contestant to get photo URL before deletion
      const contestant = await Contestant.findById(contestantId);

      if (!contestant) {
        return {
          success: false,
          message: "Contestant not found.",
        };
      }

      const photoUrl = contestant.photo;

      // Delete the contestant
      await Contestant.findByIdAndDelete(contestantId);

      // Delete the contestant's photo from the uploads folder if it exists (only in local environments)
      if (
        !process.env.VERCEL &&
        !process.env.NETLIFY &&
        !process.env.AWS_LAMBDA_FUNCTION_NAME
      ) {
        const fs = require("fs");
        const path = require("path");
        const photoPath = path.join(__dirname, "..", "uploads", photoUrl);
        if (fs.existsSync(photoPath)) {
          try {
            fs.unlinkSync(photoPath);
            console.log(`Deleted photo file: ${photoPath}`);
          } catch (error) {
            console.error("Error deleting photo file:", error);
          }
        }
      } else {
        console.log(
          `Skipping photo deletion in serverless environment: ${photoUrl}`
        );
      }

      return {
        success: true,
        message: "Contestant deleted successfully.",
      };
    } catch (error) {
      console.error("ADMINCONTROLLER - Error deleting contestant:", error);
      throw new Error("ADMINCONTROLLER - Internal Server Error");
    }
  },

  // Get Payments details
  getPaymentsDetails: async () => {
    try {
      const payments = await Payment.find()
        .populate({
          path: "award_id",
          select: "title",
        })
        .sort({ payment_date: -1 });

      // Format the payment data similar to the MySQL version
      const formattedPayments = payments.map((payment) => {
        return {
          id: payment._id,
          status: payment.status,
          contestant_nickname: payment.contestant_nickname,
          award_title: payment.award_id ? payment.award_id.title : "Unknown",
          amount_divided_by_10: payment.amount_divided_by_10,
          payment_date: payment.payment_date,
        };
      });

      return formattedPayments;
    } catch (error) {
      console.error(
        "ADMINCONTROLLER - Error fetching Payments details:",
        error
      );
      throw new Error("ADMINCONTROLLER - Internal Server Error");
    }
  },
};

module.exports = adminController;
