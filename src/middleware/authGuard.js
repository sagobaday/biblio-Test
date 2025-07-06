function authGuard(req, res, next) {
  if (!req.session || !req.session.user) {
    res.status(401).end();
    return;
  }
  next();
}

module.exports = authGuard;
