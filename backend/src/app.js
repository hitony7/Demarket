const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Global logging middleware
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.originalUrl}`);
  next(); // Pass control to the next middleware function
});

// Routes base route is /api 
app.use('/api', require('./routes'));

app.use(require('./middleware/errorhandler'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});