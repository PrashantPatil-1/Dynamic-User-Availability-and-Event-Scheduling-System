// backend/models/Session.js
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  participants: [{ type: String, required: true }],
  scheduledTime: { type: Date, required: true },
  createdBy: { type: String, required: true },
  duration: { type: Number, required: true },
  sessionType: { type: String, required: true },
  notifications: [{
    email: { type: String, required: true },
    type: { type: String, required: true },
    time: { type: Date, required: true },
  }],
});

export default mongoose.model('Session', sessionSchema);
