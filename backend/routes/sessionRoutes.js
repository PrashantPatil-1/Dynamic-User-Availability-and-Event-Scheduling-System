// backend/routes/sessionRoutes.js
const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

// Create a new session
router.post("/", async (req, res) => {
  try {
    const {
      sessionId,
      participants,
      scheduledTime,
      createdBy,
      duration,
      sessionType,
      notifications,
    } = req.body;

    // Check required fields
    if (
      !sessionId ||
      !participants.length ||
      !scheduledTime ||
      !createdBy ||
      !duration ||
      !sessionType
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure participants are valid emails
    const invalidEmails = participants.filter(
      (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
    if (invalidEmails.length > 0) {
      return res
        .status(400)
        .json({ message: `Invalid email format: ${invalidEmails.join(", ")}` });
    }

    const session = new Session({
      sessionId,
      participants,
      scheduledTime: new Date(scheduledTime),
      createdBy,
      duration,
      sessionType,
      notifications,
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// backend/routes/sessionRoutes.js
router.get("/:userId", async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [
        { participants: req.params.userId },
        { createdBy: req.params.userId },
      ],
    }).exec();
    res.json(sessions);
  } catch (error) {
    console.error("Error retrieving sessions:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Reschedule a session
router.put("/reschedule/:sessionId", async (req, res) => {
  try {
    const { scheduledTime, duration } = req.body;
    const session = await Session.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { scheduledTime: new Date(scheduledTime), duration },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(session);
  } catch (error) {
    console.error("Error rescheduling session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Cancel a session
router.delete("/cancel/:sessionId", async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      sessionId: req.params.sessionId,
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json({ message: "Session cancelled" });
  } catch (error) {
    console.error("Error cancelling session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
