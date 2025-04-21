const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Changed from MONGO_URL to MONGO_URI
        console.log('mongodb connected');
    }
    catch(err) {
        console.error('mongodb connection error', err);
        process.exit(1);
    }
};

module.exports = connectDB;