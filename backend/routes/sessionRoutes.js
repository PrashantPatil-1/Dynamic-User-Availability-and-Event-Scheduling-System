import express from 'express';
import Session from '../models/Session.js';
import Availability from '../models/Availability.js';
// import nodemailer from 'nodemailer'; // Uncomment this line when ready to use Nodemailer

const router = express.Router();

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

    if (!sessionId || !participants.length || !scheduledTime || !createdBy || !duration || !sessionType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const invalidEmails = participants.filter(
      (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
    if (invalidEmails.length > 0) {
      return res.status(400).json({ message: `Invalid email format: ${invalidEmails.join(", ")}` });
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

    await Availability.findOneAndUpdate(
      { user: createdBy, start: new Date(scheduledTime), duration },
      { booked: true }
    );

    // Uncomment and update this section when ready to send emails
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Example using Gmail
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: participants.join(", "), // Send to all participants
      subject: 'Session Scheduled',
      text: `Dear Participant,

      A session has been scheduled.

      Date and Time: ${new Date(scheduledTime).toLocaleString()}
      Created by: ${createdBy}

      Please mark your calendar.

      Best regards,
      Your Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    */

    res.status(201).json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

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

    await Availability.findOneAndUpdate(
      { user: session.createdBy, start: session.scheduledTime, duration: session.duration },
      { booked: false }
    );

    res.json({ message: "Session cancelled and availability updated" });
  } catch (error) {
    console.error("Error cancelling session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
