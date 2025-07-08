const serverless = require("serverless-http");

// Import the Express app
const app = require("../../app");

// Wrap the Express app with serverless-http
exports.handler = serverless(app);
