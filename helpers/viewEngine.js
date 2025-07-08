/**
 * Custom view engine wrapper to fix path resolution issues on Vercel
 */
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");

// Create a custom EJS view engine that fixes path resolution issues
const customEjsEngine = (filePath, options, callback) => {
  console.log(`[ViewEngine] Original file path: ${filePath}`);

  // Get the views directory
  const viewsDir = path.join(process.cwd(), "views");
  let normalizedPath = filePath;

  // Fix duplicated voter paths
  if (normalizedPath.includes("/voter/voter/")) {
    normalizedPath = normalizedPath.replace("/voter/voter/", "/voter/");
    console.log(`[ViewEngine] Fixed duplicated voter path: ${normalizedPath}`);
  }

  // Replace ultramodern with bootstrap for vote templates
  if (normalizedPath.includes("vote-ultramodern")) {
    normalizedPath = normalizedPath.replace(
      "vote-ultramodern",
      "vote-bootstrap"
    );
    console.log(
      `[ViewEngine] Changed ultramodern to bootstrap: ${normalizedPath}`
    );
  }

  // If the path doesn't exist, try alternative paths
  if (!fs.existsSync(normalizedPath)) {
    console.log(`[ViewEngine] Path doesn't exist: ${normalizedPath}`);

    // Try without the voter prefix if it's a vote template
    if (normalizedPath.includes("vote-bootstrap")) {
      const altPath = path.join(viewsDir, "voter", "vote-bootstrap.ejs");
      if (fs.existsSync(altPath)) {
        normalizedPath = altPath;
        console.log(`[ViewEngine] Found alternative path: ${normalizedPath}`);
      }
    }

    // Still doesn't exist? Try relative to views directory
    if (!fs.existsSync(normalizedPath)) {
      const fileName = path.basename(normalizedPath);
      const altPath2 = path.join(viewsDir, "voter", fileName);
      if (fs.existsSync(altPath2)) {
        normalizedPath = altPath2;
        console.log(`[ViewEngine] Found fallback path: ${normalizedPath}`);
      }
    }
  }

  console.log(`[ViewEngine] Final path: ${normalizedPath}`);

  // Use the standard EJS renderer with our fixed path
  ejs.renderFile(normalizedPath, options, {}, (err, result) => {
    if (err) {
      console.error(`[ViewEngine] Error rendering ${normalizedPath}:`, err);
    }
    callback(err, result);
  });
};

module.exports = customEjsEngine;
