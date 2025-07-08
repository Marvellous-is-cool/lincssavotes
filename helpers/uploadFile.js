const fs = require("fs");
const { extname, join } = require("path");
const { promisify } = require("util");

const uploadFile = async (file, object, property = "photo") => {
  if (file) {
    const move = promisify(file.mv);
    if (file.mimetype.startsWith("image/")) {
      const fileName =
        object.name.replace(/ /g, "-") +
        new Date().getTime().toString(36) +
        extname(file.name);

      // Use /tmp for serverless environments (Vercel), uploads for local
      const uploadDir = process.env.VERCEL
        ? "/tmp"
        : join(__dirname, "..", "uploads");

      // Ensure directory exists for local development
      if (!process.env.VERCEL && !fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fullPath = join(uploadDir, fileName);
      await move(fullPath);
      object[property] = fileName;
    }
  }

  return object;
};

module.exports = uploadFile;
