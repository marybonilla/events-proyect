const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { REQUIRED_FIELD, } = require('../errors');

const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, REQUIRED_FIELD]
    },
    description: {
        type: String,
        required: true,
        minlength: 15,
    },
    image: {
        type: String,
        default: 'https://eventmasters.eu/webp-express/webp-images/uploads/2020/04/tci-1800x1131.jpg',
      },
    cost: {
      type: Number,
      required: true,
      address: {
        type: String,
        required: true,
      },
      location: {
        type: [Number, Number],
        required: true,
      },
    },
    local: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Local',
      required: true,
    },
  },
  {
    timestamps: true,
    virtuals: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;