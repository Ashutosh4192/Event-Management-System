const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Access denied: Admin only' });
};

const requireVendor = (req, res, next) => {
  if (req.user && req.user.role === 'vendor') return next();
  return res.status(403).json({ message: 'Access denied: Vendor only' });
};

const requireUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') return next();
  return res.status(403).json({ message: 'Access denied: User only' });
};

module.exports = { requireAdmin, requireVendor, requireUser };
