// backend/models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  participants: [{ type: String, required: true }], // Expecting just strings (emails)
  scheduledTime: { type: Date, required: true },
  createdBy: { type: String, required: true },
  duration: { type: Number, required: true },
  sessionType: { type: String, required: true },
  notifications: [{
    email: { type: String, required: true }, // Expecting email
    type: { type: String, required: true },
    time: { type: Date, required: true }, // Ensure time is present
  }],
});

module.exports = mongoose.model('Session', sessionSchema);
