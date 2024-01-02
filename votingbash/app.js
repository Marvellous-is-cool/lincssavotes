const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const flash = require("express-flash");
const connection = require("./models/connection");
const path = require("path");
const validator = require("validator");
const app = express();

// Set the port using an environment variable or default to 3000
const port = process.env.PORT;

// Configure session middleware
const sessionSecret = process.env.SESSION_SECRET;
const sessionStore = new MySQLStore({}, connection);
app.use(
  session({
    key: "keyboard cat",
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));
app.use(fileUpload({ tempFileDir: "/temp" }));
app.use(express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Add validator tores.locals
app.use((req, res, next) => {
  res.locals.validator = validator;
  next();
});

// Use routes from the 'routes' folder
const adminRoutes = require("./routes/adminRoutes/adminContestantRoute");
const clientRoutes = require("./routes/clientRoutes");

// Use the adminContestantRoute with the base path /admin
app.use("/admin", adminRoutes);

// Use other routes as needed
app.use("/", clientRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(port, () => {
  console.log(
    `Server is running on port ${port} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
});
