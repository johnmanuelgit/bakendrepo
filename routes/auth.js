const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Carts = require('../models/Carts');


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
    user: { _id: user._id,name: user.name, email: user.email }
  });
});
// profile

router.get('/profile/:id',async (req,res)=>{
  try{
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  }
  catch (err){
    res.status(500).json({message:'error fetching user'});
  }
});



// carts.js
router.post('/api/cart',async (req,res)=>{

//  Check if the cart already exists for this user and update it

const { userId, name, image, price, quantity } = req.body;

try {

  // Check if the cart already exists for this user and update it

  const existingItem = await Carts.findOne({ userId, name });
  if (existingItem) {
    existingItem.quantity += quantity;
    await existingItem.save();
    return res.status(200).json({ message: 'Item updated in cart.' });
  }

  // If the item doesn't exist in the cart, create a new entry

  const newItem = new Carts({ userId, name, image, price, quantity });
  await newItem.save();
  res.status(201).json({ message: 'Item added to cart.' });
} catch (err) {
  console.error(err);
  res.status(500).json({ error: 'Failed to save item to cart.' });
}
});

// Get cart by userId

router.get('/api/cart/:userId', async (req, res) => {
const { userId } = req.params;

try {
  const cartItems = await Carts.find({ userId });
  res.status(200).json(cartItems);
} catch (err) {
  console.error(err);
  res.status(500).json({ error: 'Failed to fetch cart items.' });
}
});

module.exports = router;
