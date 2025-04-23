const express = require('express');
const router = express.Router();
const Carts = require('../models/Carts');

// Add to Cart
router.post('/', async (req, res) => {
  const { userId, name, image, price, quantity } = req.body;

  try {
    const existingItem = await Carts.findOne({ userId, name });
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).json({ message: 'Item updated in cart.' });
    }

    const newItem = new Carts({ userId, name, image, price, quantity });
    await newItem.save();
    res.status(201).json({ message: 'Item added to cart.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save item to cart.' });
  }
});

// Get Cart Items by userId
router.get('/:userId', async (req, res) => {
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
