const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// DB connect
connectDB();

// Routes
app.get('/', (req, res) => res.send("Server is working!"));
app.use('/', require('./routes/auth'));

const userRoute = require('./routes/auth');
app.use('/api/user', userRoute);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
