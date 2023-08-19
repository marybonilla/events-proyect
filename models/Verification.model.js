const mongoose = require('mongoose');
const { REQUIRED_FIELD } = require('../errors');

const verificationSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, REQUIRED_FIELD]
      },
      local: {
        type: mongoose.Types.ObjectId,
        ref: 'Artwork',
        required: [true, REQUIRED_FIELD]
      },
      validation: {
        type: Boolean,
        required: [true, REQUIRED_FIELD]
      },
      
    },
    {
      timestamps: true,
      virtuals: true,
    }
  )
  
  const Verification = mongoose.model('Verification', verificationSchema);
  
  module.exports = Verification;