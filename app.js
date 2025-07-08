const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const flash = require("express-flash");
const path = require("path");
const validator = require("validator");
const cors = require("cors");
require("dotenv").config();

// Import MongoDB connection
const connectDB = require("./config/mongodb");

const app = express();
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
      ttl: sessionExpiration / 1000,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: sessionExpiration },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static("public", {
  maxAge: "1d", // Cache static files for 1 day
  etag: false
}));
app.use(fileUpload({ tempFileDir: "/tmp" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  maxAge: "1d",
  etag: false
}));

// Add validator to res.locals
app.use((req, res, next) => {
  res.locals.validator = validator;
  next();
});

app.use(cors());
app.use(express.json());

// Debug middleware for static files
app.use((req, res, next) => {
  if (req.url.includes('.css') || req.url.includes('.js') || req.url.includes('.png') || req.url.includes('.jpg')) {
    console.log(`Static file request: ${req.method} ${req.url}`);
  }
  next();
});

// Use routes
const clientRoutes = require("./routes/clientRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Global settings middleware
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

app.use("/", clientRoutes);
app.use("/admin", adminRoutes);

// 404 handler
app.use((req, res, next) => {
  const isAdminRequest = req.path.startsWith("/admin");
  res.status(404).render("error", {
    title: "Page Not Found",
    status: 404,
    message: "Page Not Found",
    error: { status: 404, message: "Page Not Found" },
    isAdmin: isAdminRequest,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const isAdminRequest = req.path.startsWith("/admin");
  const errorStatus = err.status || 500;

  res.status(errorStatus).render("error", {
    title: "Error",
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

// Start server (only for local development)
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
