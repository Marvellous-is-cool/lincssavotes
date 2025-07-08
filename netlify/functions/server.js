const serverless = require("serverless-http");
const app = require("../../app");

// Export the serverless function
module.exports.handler = serverless(app);
