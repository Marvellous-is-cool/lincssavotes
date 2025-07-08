const fs = require("fs");
const { extname, join } = require("path");
const { promisify } = require("util");
const { isServerless, getTempDir, envLog } = require("./envUtils");

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

      // Use appropriate directory based on environment
      let uploadDir;
      if (isServerless()) {
        uploadDir = getTempDir();
        envLog(`Using serverless temp directory: ${uploadDir}`, "info");
      } else {
        uploadDir = join(__dirname, "..", "uploads");
        // Ensure the uploads directory exists in local environments
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        envLog(`Using local uploads directory: ${uploadDir}`, "info");
      }

      const fullPath = join(uploadDir, fileName);
      await move(fullPath);
      object[property] = fileName;

      envLog(`File uploaded successfully: ${fileName} to ${fullPath}`, "info");
    }
  }

  return object; // Return the updated object
};

module.exports = uploadFile;
