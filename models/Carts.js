const mongoose = require('mongoose');


const cartItemSchema = new mongoose.Schema({
    name:String,
    price:Number,
    quantity:Number,
    image:String,
});

const cartSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        items:[cartItemSchema],
});

module.exports = mongoose.model('Carts',cartSchema);
