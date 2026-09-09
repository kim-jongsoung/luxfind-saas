const requireSuperAdmin = (req, res, next) => {
  if (!req.session.superAdmin) {
    return res.redirect('/auth/super-admin/login');
  }
  next();
};

const requireAgencyAdmin = (req, res, next) => {
  if (!req.session.agencyAdmin) {
    return res.redirect('/auth/agency-admin/login');
  }
  next();
};

const checkSuperAdmin = (req, res, next) => {
  req.isSuperAdmin = !!req.session.superAdmin;
  next();
};

const checkAgencyAdmin = (req, res, next) => {
  req.isAgencyAdmin = !!req.session.agencyAdmin;
  next();
};

module.exports = {
  requireSuperAdmin,
  requireAgencyAdmin,
  checkSuperAdmin,
  checkAgencyAdmin
};
