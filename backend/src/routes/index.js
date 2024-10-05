const express = require('express');
const router = express.Router();

// Import other route files here
// const userRoutes = require('./userRoutes');

// Use route files
// router.use('/users', userRoutes);

// Example route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

module.exports = router;