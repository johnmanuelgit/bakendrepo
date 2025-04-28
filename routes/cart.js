const express = require('express');
const router = express.Router();

// In-memory cart
let cartItems = [];

// Get all cart items
router.get('/', (req, res) => {
    res.json(cartItems);
});

// Add a new cart item (optional future use)
router.post('/', (req, res) => {
    const item = req.body;
    cartItems.push(item);
    res.status(201).json({ message: 'Item added to cart', cartItems });
});

// Clear the cart
router.delete('/clear', (req, res) => {
    cartItems = [];
    res.json({ message: 'Cart cleared successfully' });
});

module.exports = router;
