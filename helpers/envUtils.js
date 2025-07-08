/**
 * Environment detection utilities for the LINCSSA VOTES application
 */

/**
 * Check if running in a serverless environment
 * @returns {boolean} - True if in serverless environment
 */
function isServerless() {
  return !!(
    process.env.VERCEL ||
    process.env.NETLIFY ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.AZURE_FUNCTIONS_ENVIRONMENT ||
    process.env.NODE_ENV === "serverless"
  );
}

/**
 * Check if running on Vercel
 * @returns {boolean} - True if on Vercel
 */
function isVercel() {
  return !!process.env.VERCEL;
}

/**
 * Check if running on Netlify
 * @returns {boolean} - True if on Netlify
 */
function isNetlify() {
  return !!process.env.NETLIFY;
}

/**
 * Check if running in development mode
 * @returns {boolean} - True if in development
 */
function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

/**
 * Check if running in production mode
 * @returns {boolean} - True if in production
 */
function isProduction() {
  return process.env.NODE_ENV === "production";
}

/**
 * Get the appropriate temp directory for the current environment
 * @returns {string} - Path to temp directory
 */
function getTempDir() {
  if (isServerless()) {
    return "/tmp";
  }
  return "/temp";
}

/**
 * Get the appropriate uploads directory for the current environment
 * @returns {string} - Path to uploads directory
 */
function getUploadsDir() {
  if (isServerless()) {
    return "/tmp"; // In serverless, we use /tmp for temporary file storage
  }
  return "uploads";
}

/**
 * Check if file system operations are allowed
 * @returns {boolean} - True if file operations are allowed
 */
function canWriteFiles() {
  return !isServerless();
}

/**
 * Log a message with environment context
 * @param {string} message - Message to log
 * @param {string} level - Log level (info, warn, error)
 */
function envLog(message, level = "info") {
  const envInfo = {
    serverless: isServerless(),
    vercel: isVercel(),
    netlify: isNetlify(),
    nodeEnv: process.env.NODE_ENV,
  };

  const logMessage = `[ENV:${JSON.stringify(envInfo)}] ${message}`;

  if (level === "error") {
    console.error(logMessage);
  } else if (level === "warn") {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }
}

module.exports = {
  isServerless,
  isVercel,
  isNetlify,
  isDevelopment,
  isProduction,
  getTempDir,
  getUploadsDir,
  canWriteFiles,
  envLog,
};
