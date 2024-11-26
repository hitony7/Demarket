import express from 'express';
import listingRoutes from './listingRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import fileRoutes from './fileRoutes.js';

const router = express.Router();

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

 //Use '/users' as the route prefix 
 router.use('/users', userRoutes );

 //Use '/file' as the route prefix 
 router.use('/file', fileRoutes);

 export default router;
