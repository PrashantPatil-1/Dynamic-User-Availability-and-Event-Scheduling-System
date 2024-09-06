// backend/models/Availability.js
const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  start: { 
    type: Date, 
    required: true
  },
  end: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(v) {
        return v > this.start;
      },
      message: 'End time must be after start time.'
    }
  },
  duration: { 
    type: Number, 
    required: true, 
    min: [5, 'Minimum duration is 5 minutes']
  }, // Duration in minutes
  booked: { type: Boolean, default: false } // Add this field
});

module.exports = mongoose.model('Availability', availabilitySchema);
