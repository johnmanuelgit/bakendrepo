const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register (public route)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send({ error: 'Email already registered' });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });

  try {
    // Save the user to the database
    await user.save();
    res.status(200).send({ message: "User Registered" });
  } catch (err) {
    res.status(500).send({ error: "Server error" });
  }
});

// Login (public route)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send({ error: "User not found" });

  // Compare the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send({ error: "Incorrect password" });

  // Send a success message without a token (since we removed authentication)
  res.send({
    message: "Welcome back, already registered user!",
    user: { _id: user._id, name: user.name, email: user.email }
  });
});

// Public profile route (no authentication required)
router.get('/profile/:id', async (req, res) => {
  try {
    // Fetch the user profile without password field
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

module.exports = router;
