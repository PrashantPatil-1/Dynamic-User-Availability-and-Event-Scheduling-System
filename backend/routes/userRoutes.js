//backend/routes/userRoutes.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Route to login or register a user based on email
router.post("/login", async (req, res) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Route to get all users (for Admin)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

export default router;
