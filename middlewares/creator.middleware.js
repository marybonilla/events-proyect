module.exports.isCreator = (req, res, next) => {
    if (req.user && req.user.role === 'Creator') {
      next();
    } else {
      res.redirect('/locals/create');
    }
  }


module.exports.isCreator = (req, res, next) => {
    if (req.user && req.user.role === 'Creator') {
      next();
    } else {
      res.redirect('/events/create');
    }
}