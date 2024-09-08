// backend/routes/availabilityRoutes.js
import express from 'express';
import Availability from '../models/Availability.js';

const router = express.Router();

// Route to add availability or update existing availability
router.post("/", async (req, res) => {
  const { user, start, end, duration } = req.body;
  try {
    const existingAvailability = await Availability.findOne({ user, start, end });

    if (existingAvailability) {
      existingAvailability.duration = duration;
      await existingAvailability.save();
      return res.json(existingAvailability);
    } else {
      const availability = new Availability({ user, start, end, duration });
      await availability.save();
      return res.json(availability);
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Route to update availability
router.put("/:slotId", async (req, res) => {
  const { slotId } = req.params;
  const { start, end, duration } = req.body;
  try {
    const updatedAvailability = await Availability.findByIdAndUpdate(
      slotId,
      { start, end, duration },
      { new: true }
    );
    res.json(updatedAvailability);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Route to delete availability
router.delete("/:slotId", async (req, res) => {
  const { slotId } = req.params;
  try {
    await Availability.findByIdAndDelete(slotId);
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Route to get availability for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const availability = await Availability.find({ user: req.params.userId });
    res.json(availability);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

export default router;
