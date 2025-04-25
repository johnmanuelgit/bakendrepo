const Razorpay = require("razorpay");
const express = require("express");
const router = express.Router();

const instance = new Razorpay({
    key_id:'rzp_test_QIN4sfPHDDt9hq',
    key_secret:'GbpVMOkKsleNkBRwRTqQe53s'
});

router.post('/create-order',async(req,res)=>{
    const {amount,currency}=req.body;

    const options = {
        amount:amount*100,
        currency:currency||"INR",
        receipt:"receipt_order_"+ new Date().getTime(),
    };
    
    try {
        const order = await instance.orders.create(options);
        res.status(200).json(order);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
      }
});

module.exports = router;