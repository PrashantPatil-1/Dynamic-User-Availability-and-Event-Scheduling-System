//backend/models/Availability.js
import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  user: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  duration: { type: Number, required: true },
  booked: { type: Boolean, default: false },
});

export default mongoose.model('Availability', availabilitySchema);
