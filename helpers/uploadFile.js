const fs = require("fs");
const { extname, join } = require("path");
const { promisify } = require("util");

// This function remains largely the same for MongoDB
// as we're still storing files in the filesystem and only saving paths in the DB
const uploadFile = async (file, object, property = "photo") => {
  if (file) {
    const move = promisify(file.mv);
    if (file.mimetype.startsWith("image/")) {
      const fileName =
        object.name.replace(/ /g, "-") +
        new Date().getTime().toString(36) +
        extname(file.name);

      // Ensure the uploads directory exists
      const uploadDir = join(__dirname, "..", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      await move(join(uploadDir, fileName));
      object[property] = fileName;
    }
  }

  return object; // Return the updated object
};

module.exports = uploadFile;
