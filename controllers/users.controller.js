const User = require("../models/User.model");
const createError = require('http-errors');

module.exports.profile = (req, res, next) => {
  res.render('user/profile', { user: req.user });
}

module.exports.getUserProfile = (req, res, next) => {
    User.findById(req.params.id)
      .then(user => {
        if (user) {
          res.render('user/profile', { user });
        } else {
          next(createError(404, 'User not found'))
        }
      })
      .catch(next)
  }