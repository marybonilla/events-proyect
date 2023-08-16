const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { REQUIRED_FIELD, } = require('../errors');

const localSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, REQUIRED_FIELD],
    },
    //address: {
      //type: String,
      //required: true,
    //},
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: 'https://media-cdn.tripadvisor.com/media/photo-s/17/75/3f/d1/restaurant-in-valkenswaard.jpg',
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
    },
    type: {
      type: String,
      enum: ['restaurant', 'bar', 'cafeteria'],
      required: [true, REQUIRED_FIELD],
    },
    restaurantDetails: {
          type: String,
          enum: ['Mexican', 'European', 'Mediterranean', 'Italian', 'Latin', 'Indian', 'Asian', 'Street food'],
          required: function () {
          return this.type === 'restaurant';
      },
    },
    barDetails: {
          type: String,
          enum: ['Tapas bar', 'Wine bar', 'Lounge bar', 'Pub', 'Hotel bar', 'Tavern', 'Canteen bar'],
          required: function () {
          return this.type === 'bar';
      },
    },
    cafeteriaDetails: {
      type: String,
      enum: ['Breakfast shop', 'Pastry shop', 'Coworking', 'Bistro', 'Library', 'Vegan'],
      required: function () {
        return this.type === 'cafeteria';
      },
    },
    capacity: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true },
);


const Local = mongoose.model('Local', localSchema);

module.exports = Local;