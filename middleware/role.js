// middleware/role.js

module.exports = function checkRole(requiredRole) {
  return function (req, res, next) {
    const user = req.user;

    if (!user || !user.role) {
      return res.status(403).json({ message: 'Access denied. No role found.' });
    }

    if (user.role !== requiredRole) {
      return res.status(403).json({ message: 'Access denied. Insufficient role.' });
    }

    next();
  };
};
