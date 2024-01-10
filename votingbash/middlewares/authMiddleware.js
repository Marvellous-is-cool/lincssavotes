// middlewares/authMiddleware.js

function authMiddleware(req, res, next) {
  const isAdminAuthenticated = req.session.admin;
  const isSessionValid = req.session.cookie.expires > Date.now();

  console.log("Auth Middleware Triggered");
  console.log("Current Time:", Date.now());
  console.log("Session Expiration:", req.session.cookie.expires);
  console.log("Session Data:", req.session);

  if (isAdminAuthenticated && isSessionValid) {
    res.locals.adminUsername = req.session.adminUsername; // Include admin's username in locals
    next();
  } else if (req.url === "/login" || req.url === "/authenticate") {
    // Allow access to login and authentication routes
    next();
  } else {
    console.log("Redirecting to /login");
    res.redirect("/login");
  }
}

module.exports = authMiddleware;
