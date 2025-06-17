const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const middleware =require('../middleware/auth');
const Admin = require('../models/defaultAdmin')


router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send({ error: 'Email already registered' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });

  try {
    await user.save();
    res.status(200).send({ message: "User Registered" });
  } catch (err) {
    res.status(500).send({ error: "Server error" });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send({ error: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send({ error: "Incorrect password" });
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.send({
    message: "Welcome back, already registered user!",
    user: { _id: user._id, name: user.name, email: user.email },
    token 
  });
});

// admin-login
router.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;
  const adminUser = await Admin.findOne({ username }); // ✅ FIXED
  if (!adminUser) return res.status(404).send({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, adminUser.password);
  if (!isMatch) return res.status(401).send({ error: "Incorrect password" });

  const token = jwt.sign(
    { userId: adminUser._id, username: adminUser.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.send({
    message: "Welcome back, already registered user!",
    Admin: {
      _id: adminUser._id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role
    },
    token 
  });
});

// Public profile route (no authentication required)
router.get('/profile/:id',middleware, async (req, res) => {
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
