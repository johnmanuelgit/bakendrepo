const express = require('express');
const router = express.Router();
const Carts = require('../models/Carts');

// Add to Cart
router.post('/', async (req, res) => {
  const { userId, name, image, price, quantity } = req.body;

  try {
    // Find the cart
    const cart = await Carts.findOne({ userId });

    if (!cart) {
      // Create a new cart if not found
      const newCart = new Carts({
        userId,
        items: [{ name, image, price, quantity }]
      });
      await newCart.save();
      return res.status(200).json({ message: 'Item added to cart.' });
    }

    // Check if the item already exists
    const existingItem = cart.items.find(item => item.name === name);

    if (existingItem) {
      // If item exists, update its quantity
      existingItem.quantity += quantity;
    } else {
      // If item does not exist, add it to the cart
      cart.items.push({ name, image, price, quantity });
    }

    // Save the updated cart
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
      return res.status(200).json([]); // Return empty array instead of 404
    }

    res.status(200).json(cart.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart items.' });
  }
});

// Update item quantity by ID
router.put('/:userId/:itemId', async (req, res) => {
  const { userId, itemId } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await Carts.findOneAndUpdate(
      { userId, 'items._id': itemId },
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

// Update item quantity by product name
router.put('/:userId/updateByName', async (req, res) => {
  const { userId } = req.params;
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

// Clear cart (remove all items)
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;
  
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

// Remove specific item from cart
router.delete('/:userId/item/:itemName', async (req, res) => {
  const { userId, itemName } = req.params;
  
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