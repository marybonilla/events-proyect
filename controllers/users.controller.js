const User = require("../models/User.model");
const createError = require('http-errors');

module.exports.profile = (req, res, next) => {
  const creatorRole = req.user.role === 'Creator';
  res.render('user/profile', { user: req.user, creatorRole });
}

module.exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      const formattedCreatedAt = user.createdAt.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      console.log('formattedCreatedAt:', formattedCreatedAt);
      
      res.render('user/profile', { user, formattedCreatedAt, });
    } else {
      next(createError(404, 'User not found'))
    }
  } catch (error) {
    next(error);
  }
}