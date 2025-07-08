/**
 * Debug middleware for path resolution issues
 */

const path = require("path");
const fs = require("fs");
const { isServerless, envLog } = require("../helpers/envUtils");

const debugPathsMiddleware = (req, res, next) => {
  // Add a logger function to res.locals
  res.locals.debugLog = (message) => {
    const logMessage = `[${new Date().toISOString()}] ${message}`;

    // Use console logging in serverless environments
    if (isServerless()) {
      envLog(`DEBUG_PATH: ${logMessage}`, "info");
    } else {
      // Use file logging in local environments
      try {
        const logDir = path.join(process.cwd(), "logs");
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        fs.appendFileSync(logDir + "/path-debug.log", logMessage + "\n");
      } catch (error) {
        envLog(`DEBUG_PATH_FALLBACK: ${logMessage}`, "warn");
      }
    }
  };

  // Add helper to check if a file exists
  res.locals.fileExists = (filePath) => {
    try {
      return fs.existsSync(filePath);
    } catch (err) {
      return false;
    }
  };

  // Add a utility to get the correct template path
  res.locals.getTemplatePath = (templateName) => {
    // If template starts with 'voter/' make sure we don't duplicate it
    if (templateName.startsWith("voter/") && req.path.includes("/voter/")) {
      return templateName.split("/").pop();
    }
    return templateName;
  };

  next();
};

module.exports = debugPathsMiddleware;
