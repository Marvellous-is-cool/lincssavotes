/**
 * Custom view engine wrapper to fix path resolution issues on Vercel
 */
const path = require("path");
const ejs = require("ejs");

// Create a custom EJS view engine that fixes path resolution issues
const customEjsEngine = (filePath, options, callback) => {
  // Get original file name without the root path
  const viewsDir = path.join(process.cwd(), "views");

  // Try to parse the filePath to fix double path segments
  let normalizedPath = filePath;

  // If we detect duplicated paths like 'voter/voter/something.ejs'
  if (normalizedPath.includes("/voter/voter/")) {
    normalizedPath = normalizedPath.replace("/voter/voter/", "/voter/");
    console.log(`[ViewEngine] Fixed duplicated path: ${normalizedPath}`);
  }

  // Use the standard EJS renderer with our fixed path
  ejs.renderFile(normalizedPath, options, {}, callback);
};

module.exports = customEjsEngine;
