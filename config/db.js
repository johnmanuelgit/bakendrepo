const mongoose = require('mongoose');
const initAdmin = require('../utiles/initAdmin');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongodb connected');
            initAdmin();
    }
    catch(err) {
        console.error('mongodb connection error', err);
        process.exit(1);
    }
};

module.exports = connectDB;