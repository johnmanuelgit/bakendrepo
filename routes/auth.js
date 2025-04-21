const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

//  Register
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
    res.status(201).send({ message: "User Registered" });
  } catch (err) {
    res.status(500).send({ error: "Server error" });
  }
});

//  Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).send({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send({ error: "Incorrect password" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

  res.send({
    message: "Welcome back, already registered user!",
    token,
    user: { name: user.name, email: user.email }
  });
});

//profiile
router.get('/profile',async(req,res)=>{
  const token =req.header.authorization?.split('')[1];
  if(!token)return res.status(401).json({message:'no token provide'});

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.id); 

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
})

module.exports = router;
