const express = require('express');
const router = express.Router();
const Carts = require('../models/Carts');
const authenticateToken = require('../middleware/auth');

// Add to Cart (Protected)
router.post('/', authenticateToken, async (req, res) => {
  const { name, image, price, quantity } = req.body;
  const userId = req.user.userId;

  try {
    const cart = await Carts.findOne({ userId });

    if (!cart) {
      const newCart = new Carts({
        userId,
        items: [{ name, image, price, quantity }]
      });
      await newCart.save();
      return res.status(200).json({ message: 'Item added to cart.' });
    }

    const existingItem = cart.items.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ name, image, price, quantity });
    }

    await cart.save();
    res.status(200).json({ message: 'Item added/updated in cart.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save item to cart.' });
  }
});

// Get Cart Items (Protected)
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const cart = await Carts.findOne({ userId });
    if (!cart) {
      return res.status(200).json([]);
    }

    res.status(200).json(cart.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart items.' });
  }
});

// Update item quantity by item ID (Protected)
router.put('/:itemId', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await Carts.findOneAndUpdate(
      { userId, 'items._id': new mongoose.Types.ObjectId(itemId) },
      { $set: { 'items.$.quantity': quantity } },
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

// Update item quantity by product name (Protected)
router.put('/updateByName', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { productName, quantity } = req.body;

  try {
    const updatedCart = await Carts.findOneAndUpdate(
      { userId, 'items.name': productName },
      { $set: { 'items.$.quantity': quantity } },
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

// Clear Cart (Protected)
router.delete('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    await Carts.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
});

// Remove specific item by name (Protected)
router.delete('/item/:itemName', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { itemName } = req.params;

  try {
    const updatedCart = await Carts.findOneAndUpdate(
      { userId },
      { $pull: { items: { name: itemName } } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    res.status(200).json({ message: 'Item removed from cart', cart: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
});

module.exports = router;
