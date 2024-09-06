// backend/routes/availabilityRoutes.js
const express = require("express");
const router = express.Router();
const Availability = require("../models/Availability");

// Route to add availability or update existing availability
router.post("/", async (req, res) => {
  const { user, start, end, duration } = req.body;
  try {
    const existingAvailability = await Availability.findOne({
      user,
      start,
      end,
    });

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

// Route to get availability for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const availability = await Availability.find({ user: req.params.userId });
    res.json(availability);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
