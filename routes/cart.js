const express = require('express');
const router = express.Router();
const Cart = require('../models/Carts');

// Get cart by userId
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (cart) {
      res.json(cart.items);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/', async (req, res) => {
  try {
    const { userId, name, image, price, quantity } = req.body;
    
    // Find cart by userId
    let cart = await Cart.findOne({ userId });
    
    if (cart) {
      // Check if item already exists in cart
      const itemIndex = cart.items.findIndex(item => item.name === name);
      
      if (itemIndex > -1) {
        // Item exists, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Item doesn't exist, add new item
        cart.items.push({ name, image, price, quantity });
      }
      
      await cart.save();
    } else {
      // Create new cart
      cart = new Cart({
        userId,
        items: [{ name, image, price, quantity }]
      });
      
      await cart.save();
    }
    
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update item quantity - NEW ENDPOINT
router.put('/update', async (req, res) => {
  try {
    const { userId, productName, quantity } = req.body;
    
    // Find cart by userId
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Find item in cart
    const itemIndex = cart.items.findIndex(item => item.name === productName);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/:userId/item/:itemName', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Filter out the item to remove
    cart.items = cart.items.filter(item => item.name !== req.params.itemName);
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.delete('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = [];
    await cart.save();
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;