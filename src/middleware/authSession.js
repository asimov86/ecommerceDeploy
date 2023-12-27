module.exports.authSession = (req, res, next) => {
    if (req.session.user) {
      req.logger.info('Autenticado ' + req.session)
      return next();
    } else {
      req.logger.info("Usuario no autenticado");
      return res.redirect('/api/views/login');
    }
  };

  