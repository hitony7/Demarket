const express = require('express');
const router = express.Router();
const listingRoutes = require('./listingRoutes');
const authRoutes = require('./authRoutes');


// Import other route files here
// const userRoutes = require('./userRoutes');

// Use route files
// router.use('/users', userRoutes);

// Example route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Use '/listings' as the route prefix
 router.use('/listing', listingRoutes);

// Use '/auth' as the route prefix
 router.use('/auth', authRoutes);

module.exports = router;