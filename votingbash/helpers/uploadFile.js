// helpers/uploadFile.js

const { extname } = require("path");
const { promisify } = require("util");

const uploadFile = async (file, object, property = "photo") => {
  if (file) {
    let move = promisify(file.mv);
    if (file.mimetype.startsWith("image/")) {
      let fileName =
        object.name.replaceAll(" ", "-") +
        new Date().getTime().toString(36) +
        extname(file.name);
      await move("uploads/" + fileName);
      object[property] = fileName;
    }
  }

  return object; // Return the updated object
};

module.exports = uploadFile;
