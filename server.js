const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder to serve uploaded images
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/', require('./routes/auth'));
app.use('/api/user', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/payment', require('./routes/payment'));
app.use('/api/products', require('./routes/productRoutes')); // ✅ updated

app.get('/', (req, res) => res.send("Server is working!"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
