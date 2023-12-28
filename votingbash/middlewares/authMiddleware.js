// middlewares/authMiddleware.js

function authMiddleware(req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/admin/login");
  }
}

module.exports = authMiddleware;
