const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { REQUIRED_FIELD, } = require('../errors');

const likeSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  });
  
  const Like = mongoose.model("Like", likeSchema);
  module.exports = Like;