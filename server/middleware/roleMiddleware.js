const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      if (req.user && req.user.role === 'Admin') {
        return next(); // Admins bypass all role checks
      }
      return res.status(403).json({ message: `Role (${req.user ? req.user.role : 'None'}) is not allowed to access this resource` });
    }
    next();
  };
};

module.exports = { authorizeRoles };
