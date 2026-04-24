const roleGuard = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // PM and admin can access everything
    if (req.user.role === 'admin' || req.user.role === 'pm') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Requires one of: ${allowedRoles.join(', ')}` });
    }

    next();
  };
};

module.exports = roleGuard;
