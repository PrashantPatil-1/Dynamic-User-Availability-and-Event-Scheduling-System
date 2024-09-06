const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  user: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  duration: { type: Number, required: true },
  booked: { type: Boolean, default: false }, // Add this field
});

module.exports = mongoose.model('Availability', availabilitySchema);
