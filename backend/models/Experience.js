const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  available: {
    type: Number,
    default: 10
  },
  status: {
    type: String,
    enum: ['available', 'sold-out'],
    default: 'available'
  }
});

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  dates: [{
    type: String,
    required: true
  }],
  times: [timeSlotSchema],
  about: {
    type: String,
    required: true
  },
  taxes: {
    type: Number,
    required: true,
    default: 59
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Experience', experienceSchema);
