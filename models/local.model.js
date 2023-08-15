const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { REQUIRED_FIELD, } = require('../errors');

const localSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, REQUIRED_FIELD],
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: [Number, Number],
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
      enum: ['Restaurant', 'Bar', 'Cafeteria'],
      required: true,
    },
    restaurantDetails: {
      type: {
        typeOfCuisine: {
          type: String,
          enum: ['Mexican', 'European', 'Mediterranean', 'Italian', 'Latin', 'Indian', 'Asian', 'Street food'],
        },
        capacity: {
          type: Number,
          required: function () {
            return this.type === 'restaurant';
          },
        },
      },
      required: function () {
        return this.type === 'restaurant';
      },
    },
    barDetails: {
      type: {
        typeBar: {
          type: String,
          enum: ['tapas bar', 'wine bar', 'lounge bar', 'pub', 'hotel bar', 'tavern', 'canteen bar'],
        },
      },
      required: function () {
        return this.type === 'bar';
      },
    },
    cafeteriaDetails: {
      type: {
        typeCafeteria: {
          type: String,
          enum: ['Breakfast shop', 'Pastry shop', 'Coworking', 'Bistro', 'Library', 'Vegan'],
        },
      },
      required: function () {
        return this.type === 'cafeteria';
      },
    },
    capacity: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);


const Local = mongoose.model('Local', localSchema);

module.exports = Local;