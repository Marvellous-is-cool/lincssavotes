const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const flash = require("express-flash");
const connection = require("./models/connection");
const path = require("path");
const validator = require("validator");
// const cors = require("cors"); // Add this line
const app = express();
const port = 3000;

// Set the NODE_ENV variable to "development"
process.env.NODE_ENV = "development";

// Configure session middleware
const sessionStore = new MySQLStore({}, connection);
app.use(
  session({
    key: "keyboard cat",
    secret: "keyboard cat",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(fileUpload({ tempFileDir: "/temp" }));
app.use(express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Use the cors middleware
// app.use(cors()); // Enable CORS for all routes

// Add validator to res.locals
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

app.listen(port, () => {
  console.log(
    `Server is running on port ${port} in ${process.env.NODE_ENV} mode`
  );
});
