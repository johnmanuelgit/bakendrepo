const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  quantity: Number
});

const cartSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});


module.exports = mongoose.model('Cart', cartSchema);
