const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars (create a .env file locally with MONGO_URI and JWT_SECRET)
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json()); // Body parser

// Routes (to be defined)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/company', require('./routes/companyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const path = require('path');

// Basic Route
// app.get('/', (req, res) => {
//     res.send('InternConnect API is running...');
// });

// Serve static files from the "website" directory (parent of "server")
app.use(express.static(path.join(__dirname, '../')));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
