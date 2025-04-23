const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  quantity: Number
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  items: [cartItemSchema]
});

module.exports = mongoose.model('Cart', cartSchema);
