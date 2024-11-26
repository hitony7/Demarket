// /routes/userRoutes.js
import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

//Base Url api/users

// GET /api/users/:id - Get specific user by ID
router.get('/:id', protect, userController.getUserById);

// GET /api/users/by-wallet/:walletAddress - Get specific user by walletAddress Public Version 
router.get('/by-wallet/:walletAddress', userController.getUserByWalletAddressPublic);

// GET /api/users/:id - Get specific user by ID Public Version 
router.get('/:id/public', userController.getUserByIdPublic);

// PUT /api/users/:id - Update user by ID
router.put('/:id', protect, userController.updateUserById);

// GET /api/users/:id/listings - Get all listings by User ID
router.get('/:id/listings' , userController.getAllListingsByUserId);


export default router;
