const User = require("../models/User.model");
const createError = require('http-errors');

module.exports.profile = (req, res, next) => {
  res.render('user/profile', { user: req.user });
}

module.exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      const formattedCreatedAt = user.createdAt.toLocaleDateString();
      res.render('user/profile', { user, formattedCreatedAt });
    } else {
      next(createError(404, 'User not found'))
    }
  } catch (error) {
    next(error);
  }
}