const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const multer = require('multer');

const app = express(); // ✅ Define app first!

// Middleware setup
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing x-www-form-urlencoded
app.use(bodyParser.json()); // Optional: could remove if using express.json()

// Handle multipart/form-data
const upload = multer();
app.use(upload.none()); // For parsing multipart/form-data without files

dotenv.config();

// Connect DB
connectDB();

// Routes
app.get('/', (req, res) => res.send("Server is working!"));
app.use('/', require('./routes/auth'));
app.use('/api/user', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/payment', require('./routes/payment'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
