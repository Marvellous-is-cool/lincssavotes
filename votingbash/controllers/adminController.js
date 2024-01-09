// controllers/adminController.js

const connection = require("../models/connection");
const uploadFile = require("../helpers/uploadFile");

const adminController = {
  // Get admin dashboard data (e.g., award titles)
  getDashboardData: async () => {
    try {
      const [awards] = await connection.query("SELECT * FROM awards");

      // Fetch contestants for each award
      const awardsWithContestants = await Promise.all(
        awards.map(async (award) => {
          const [contestants] = await connection.query(
            "SELECT * FROM contestants WHERE award_id = ? ORDER BY votes DESC",
            [award.id]
          );
          return { ...award, contestants };
        })
      );

      return awardsWithContestants;
    } catch (error) {
      console.error("Error fetching award titles and contestants:", error);
      throw new Error("Internal Server Error");
    }
  },

  // Get award titles for the dropdown
  getAwardTitles: async () => {
    try {
      const [awards] = await connection.query("SELECT id, title FROM awards");
      return awards;
    } catch (error) {
      console.error("Error fetching award titles:", error);
      throw new Error("Internal Server Error");
    }
  },

  // Authenticate admin
  authenticateAdmin: async (username, password) => {
    try {
      const [admin] = await connection.query(
        "SELECT * FROM admins WHERE username = ? AND password = ?",
        [username.toLowerCase(), password]
      );

      return {
        success: admin.length > 0,
        error: admin.length > 0 ? null : "Incorrect username or password",
      };
    } catch (error) {
      console.error("Error authenticating admin:", error);
      throw new Error("Internal Server Error");
    }
  },

  // Add Contestant operation
  addContestant: async (req, res) => {
    const { contestantName, contestantLevel, selectedAwardId } = req.body;
    const contestantData = { name: contestantName };

    try {
      // Use uploadFile to handle file upload and get the generated filename
      const updatedContestantData = await uploadFile(
        req.files.contestantPhoto,
        contestantData,
        "photo"
      );

      // Insert the contestant into the database
      const sql =
        "INSERT INTO contestants (nickname, level, photo_url, award_id) VALUES (?, ?, ?, ?)";
      const values = [
        contestantName,
        contestantLevel, // Use the selected contestantLevel from the form
        updatedContestantData.photo, // Use the generated filename
        selectedAwardId,
      ];

      await connection.query(sql, values);
      req.flash("success", "Contestant added successfully.");
      res.redirect("/admin/dashboard");
    } catch (error) {
      console.error("Error adding contestant:", error);

      // Provide a user-friendly error message based on the type of error
      if (error.code === "ER_DUP_ENTRY") {
        // Duplicate entry error (e.g., contestant with the same name for the same award)
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
      // Fetch the contestant's photo URL from the database
      const [contestant] = await connection.query(
        "SELECT photo_url FROM contestants WHERE id = ?",
        [contestantId]
      );

      if (contestant.length > 0) {
        const photoUrl = contestant[0].photo_url;

        // Delete the contestant from the database
        await connection.query("DELETE FROM contestants WHERE id = ?", [
          contestantId,
        ]);

        // Delete the contestant's photo from the uploads folder
        const fs = require("fs");
        const path = require("path");
        const photoPath = path.join("uploads", photoUrl);
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
        }

        return { success: true, message: "Contestant deleted successfully." };
      }
    } catch (error) {
      console.error("Error deleting contestant:", error);
      throw new Error("Internal Server Error");
    }
  },
  // Get Payments details
  getPaymentsDetails: async () => {
    try {
      const [payments] = await connection.query(`
      SELECT p.id, p.status, p.contestant_nickname, p.amount_divided_by_10, p.payment_date, a.title as award_title
      FROM payments p
      JOIN awards a ON p.award_id = a.id
    `);
      return payments;
    } catch (error) {
      console.error("Error fetching Payments details:", error);
      throw new Error("Internal Server Error");
    }
  },
};

module.exports = adminController;
