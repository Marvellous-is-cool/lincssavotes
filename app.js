const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const flash = require("express-flash");
const path = require("path");
const validator = require("validator");
const cors = require("cors");
const fs = require("fs");
const {
  isServerless,
  canWriteFiles,
  envLog,
  getTempDir,
} = require("./helpers/envUtils");
require("dotenv").config(); // Load environment variables

// Import MongoDB connection
const connectDB = require("./config/mongodb");

const app = express();

// Set the port using an environment variable or default to 3000
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Configure session middleware
const sessionSecret = process.env.SESSION_SECRET || "keyboard cat";
const sessionExpiration = 1000 * 60 * 60 * 20; // 20 hours

app.use(
  session({
    secret: sessionSecret,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collection: "sessions",
      ttl: sessionExpiration / 1000, // Convert to seconds
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: sessionExpiration },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

// Set up view engine with custom path resolution for Vercel compatibility
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", require("./helpers/viewEngine"));

// Set absolute path for views to prevent path duplication issues in different environments
app.locals.basedir = path.join(__dirname, "views");

// Serve static files
app.use(express.static("public"));

// Configure file upload with proper temp directory for serverless environments
const fileUploadConfig = {
  tempFileDir: getTempDir(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  abortOnLimit: true,
  createParentPath: true,
};
app.use(fileUpload(fileUploadConfig));

envLog(`File upload configured with temp directory: ${getTempDir()}`, "info");

app.use(express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Add validator to res.locals
app.use((req, res, next) => {
  res.locals.validator = validator;
  next();
});
// Simple logging middleware
app.use((req, res, next) => {
  envLog(`${req.method} ${req.url}`, "info");

  // Only use file logging in non-serverless environments
  if (canWriteFiles()) {
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${
      req.url
    }\n`;

    // Create logs directory if it doesn't exist
    const logDir = path.join(__dirname, "logs");
    if (!fs.existsSync(logDir)) {
      try {
        fs.mkdirSync(logDir, { recursive: true });
      } catch (err) {
        envLog(`Error creating logs directory: ${err.message}`, "error");
        return next();
      }
    }

    fs.appendFile(
      path.join(__dirname, "logs", "app.log"),
      logMessage,
      (err) => {
        if (err) {
          envLog(`Error writing to log file: ${err.message}`, "error");
        }
      }
    );
  }

  next();
});

app.use(express.json());

// Use routes from the 'routes' folder
const clientRoutes = require("./routes/clientRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Add middleware to fix path resolution issues and provide debugging
const vercelPathFix = require("./middlewares/vercelPathFix");
const debugPaths = require("./middlewares/debugPaths");
const templateDebug = require("./middlewares/templateDebug");

// Apply template debugging first to catch all render attempts
app.use(templateDebug);
app.use(vercelPathFix);
app.use(debugPaths);

// Initialize global settings middleware
app.use(async (req, res, next) => {
  try {
    const SystemSetting = require("./models/SystemSetting");
    res.locals.settings = await SystemSetting.getSettings();
    next();
  } catch (error) {
    console.error("Error loading system settings:", error);
    res.locals.settings = {
      votingEnabled: false,
      registrationEnabled: false,
      displayResults: false,
      maintenanceMode: false,
      electionTitle: "LINCSSA VOTES",
      electionDescription: "Student Union Election",
    };
    next();
  }
});

// Use routes
app.use("/", clientRoutes);
app.use("/admin", adminRoutes);

// Maintenance mode middleware
app.use(async (req, res, next) => {
  // Skip maintenance check for admin routes
  if (req.path.startsWith("/admin")) {
    return next();
  }

  try {
    const settings = res.locals.settings;
    if (settings && settings.maintenanceMode) {
      return res.status(503).render("maintenance");
    }
    next();
  } catch (error) {
    console.error("Error checking maintenance mode:", error);
    next();
  }
});

// 404 handler
app.use((req, res, next) => {
  // Log 404 errors
  envLog(`404 NOT FOUND: ${req.method} ${req.url}`, "warn");

  // Only use file logging in non-serverless environments
  if (canWriteFiles()) {
    const log404Message = `[${new Date().toISOString()}] 404 NOT FOUND: ${
      req.method
    } ${req.url}\n`;

    // Create logs directory if it doesn't exist
    const logDir = path.join(__dirname, "logs");
    if (!fs.existsSync(logDir)) {
      try {
        fs.mkdirSync(logDir, { recursive: true });
      } catch (err) {
        envLog(`Error creating logs directory: ${err.message}`, "error");
      }
    } else {
      fs.appendFile(
        path.join(__dirname, "logs", "404.log"),
        log404Message,
        (err) => {
          if (err) {
            envLog(`Error writing to 404 log file: ${err.message}`, "error");
          }
        }
      );
    }
  }

  // Check if the request is for an admin page
  const isAdminRequest = req.path.startsWith("/admin");

  res.status(404).render("error", {
    title: "Page Not Found",
    status: 404,
    message: "Page Not Found",
    error: {
      status: 404,
      message: "Page Not Found",
    },
    isAdmin: isAdminRequest,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Log the error to console and optionally to file
  const errorLog = `[${new Date().toISOString()}] ERROR: ${
    err.stack || err.message || err
  }\n`;

  envLog(`ERROR: ${err.message || "Unknown error"}`, "error");

  // Only use file logging in non-serverless environments
  if (canWriteFiles()) {
    // Create logs directory if it doesn't exist
    const logDir = path.join(__dirname, "logs");
    if (!fs.existsSync(logDir)) {
      try {
        fs.mkdirSync(logDir, { recursive: true });
      } catch (err) {
        envLog(`Error creating logs directory: ${err.message}`, "error");
      }
    } else {
      fs.appendFile(
        path.join(__dirname, "logs", "error.log"),
        errorLog,
        (writeErr) => {
          if (writeErr) {
            envLog(
              `Error writing to error log file: ${writeErr.message}`,
              "error"
            );
          }
        }
      );
    }
  }

  // Check if the request is for an admin page
  const isAdminRequest = req.path.startsWith("/admin");

  // Use an appropriate title based on error status
  const errorStatus = err.status || 500;
  const errorTitle = errorStatus === 404 ? "Page Not Found" : "Error";

  res.status(errorStatus).render("error", {
    title: errorTitle,
    status: errorStatus,
    message: err.message || "Something went wrong",
    error: {
      status: errorStatus,
      message: err.message || "Something went wrong",
      stack: process.env.NODE_ENV === "development" ? err.stack : null,
    },
    isAdmin: isAdminRequest,
  });
});

// Start the server only if not in serverless environment
if (!isServerless()) {
  app.listen(port, () => {
    envLog(`Server running on port ${port}`, "info");
    envLog(`Connected - ${process.env.NODE_ENV || "development"}`, "info");
  });
} else {
  envLog("Running in serverless environment - server startup skipped", "info");
}

// Export the app for serverless functions
module.exports = app;
