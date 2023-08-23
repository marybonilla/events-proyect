const Like = require('../models/like.model');

module.exports.create = (req, res, next) => {
  const userId = req.params.userId;
  const eventId = req.params.eventId;

  Like.findOne({ user: userId, event: eventId })
    .then((like) => {
      if (like) {
        Like.findByIdAndDelete(like._id)
          .then(() => {
            res.send("DELETED");
          })
          .catch((e) => next(e));
      } else {
        const like = new Like({
          user: userId,
          event: eventId,
        });
        like
          .save()
          .then(() => {
            res.send("CREATED");
          })
          .catch((e) => next(e));
      }
    })
    .catch((e) => next(e));
};