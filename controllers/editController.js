const { Contestant } = require("../models");
const uploadFile = require("../helpers/uploadFile");

// Get contestant by ID
const getContestantById = async (awardId, contestantId) => {
  try {
    const contestant = await Contestant.findOne({
      _id: contestantId,
      awards: { $in: [awardId] },
    });

    return contestant;
  } catch (error) {
    console.error("Error fetching contestant by ID:", error);
    throw error;
  }
};

// Update contestant
const updateContestant = async (
  awardId,
  contestantId,
  editedDetails,
  photoFile
) => {
  try {
    // Get existing contestant
    const existingContestant = await Contestant.findById(contestantId);

    if (!existingContestant) {
      throw new Error(`Contestant with ID ${contestantId} not found.`);
    }

    let photoUrl = existingContestant.photo;

    if (photoFile) {
      const contestantData = await uploadFile(
        photoFile,
        { name: editedDetails.nickname },
        "photo"
      );
      photoUrl = contestantData.photo;
    }

    // Prepare update object
    const updateData = {
      nickname: editedDetails.nickname,
      level: editedDetails.level || existingContestant.level,
      photo: photoUrl,
      votes: editedDetails.votes || existingContestant.votes,
    };

    // Update the contestant in MongoDB
    await Contestant.findByIdAndUpdate(contestantId, updateData);
  } catch (error) {
    console.error("Error updating contestant:", error);
    throw error;
  }
};

// Render edit contestant page
const renderEditContestantPage = async (req, res) => {
  try {
    const awardId = req.params.awardId;
    const contestantId = req.params.contestantId;
    const contestant = await getContestantById(awardId, contestantId);

    if (!contestant) {
      console.error(
        `Contestant with ID ${contestantId} not found during render.`
      );
      req.flash("error", "Contestant not found. Please try again.");
      return res.redirect("/admin/dashboard");
    }

    res.render("admin/edit-contestant", { contestant, awardId });
  } catch (error) {
    console.error("Error rendering edit page:", error);
    req.flash("error", "Error rendering edit page. Please try again.");
    res.redirect("/admin/dashboard");
  }
};

// Edit contestant
const editContestant = async (req, res) => {
  try {
    const awardId = req.params.awardId;
    const contestantId = req.params.contestantId;
    const editedDetails = req.body;
    const photoFile = req.files ? req.files.contestantPhoto : null;

    // Fetch the contestant data to get the correct contestant ID
    const contestant = await getContestantById(awardId, contestantId);

    if (!contestant) {
      throw new Error(`Contestant with ID ${contestantId} not found.`);
    }

    await updateContestant(awardId, contestantId, editedDetails, photoFile);

    req.flash("success", "Contestant updated successfully.");
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error updating contestant:", error);
    req.flash("error", "Error updating contestant. Please try again.");
    res.redirect("/admin/dashboard");
  }
};

module.exports = { updateContestant, renderEditContestantPage, editContestant };
