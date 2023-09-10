const User = require("../models/User.model");
const createError = require('http-errors');

module.exports.profile = (req, res, next) => {
  User.findById(req.user._id)
    .populate('locals') // Popula los locales asociados al usuario
    .then((user) => {
      const creatorRole = req.user.role === 'Creator';

      if (user) {
        res.render('user/profile', { user, creatorRole });
      } else {
        next(createError(404, 'User not found'));
      }
    })
    .catch((error) => {
      next(error);
    });
};

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