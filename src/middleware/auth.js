const requireLogin = (req, res, next) => {
  if (req.session?.user) {
    return next();
  }

  req.flash('error', 'Please log in to access that page.');
  res.redirect('/login');
};

const requireRole = (role) => (req, res, next) => {
  if (!req.session?.user) {
    req.flash('error', 'Please log in to access that page.');
    return res.redirect('/login');
  }

  if (req.session.user.role !== role) {
    req.flash('error', 'Admin access is required to view that page.');
    return res.redirect('/');
  }

  next();
};

export { requireLogin, requireRole };