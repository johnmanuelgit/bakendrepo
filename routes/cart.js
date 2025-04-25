const express = require('express');
const router = express.Router();
const Carts = require('../models/Carts');

// Add to Cart
router.post('/', async (req, res) => {
  const { userId, name, image, price, quantity } = req.body;

  try {
    let cart = await Carts.findOne({ userId });

    if (!cart) {
      // Create a new cart
      cart = new Carts({
        userId,
        items: [{ name, image, price, quantity }]
      });
    } else {
      // Check if item already exists in items array
      const existingItem = cart.items.find(item => item.name === name);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ name, image, price, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Item added/updated in cart.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save item to cart.' });
  }
});

// Get Cart Items by userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Carts.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    res.status(200).json(cart.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart items.' });
  }
});

// PUT /cart/:productId
router.put('/cart/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const { userId, quantity } = req.body;

  try {
    const updatedCart = await Carts.findOneAndUpdate(
      { userId, 'items._id': itemId }, // match by item's _id
      { $set: { 'items.$.quantity': quantity } }, // update quantity
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    res.status(200).json({ message: 'Cart updated', cart: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating cart quantity' });
  }
});



module.exports = router;
