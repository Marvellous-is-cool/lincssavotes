// Middleware for admin authentication

const authMiddleware = {
  isAdmin: (req, res, next) => {
    const isAdminAuthenticated = req.session.admin;
    const isSessionValid = req.session.cookie.expires > Date.now();

    if (isAdminAuthenticated && isSessionValid) {
      // Make admin data available to templates
      res.locals.admin = req.session.admin;
      next();
    } else {
      req.flash("error", "Please login to access admin area");
      res.redirect("/admin/login");
    }
  },

  // Redirect if already authenticated
  redirectIfAuthenticated: (req, res, next) => {
    if (req.session.admin) {
      return res.redirect("/admin/dashboard");
    }
    next();
  },
};

module.exports = authMiddleware;
