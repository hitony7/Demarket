// /routes/listingRoutes.js
import express from 'express';
import * as listingController from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
// POST /api/listings - Create a new listing (Protected)
router.post('/', protect, listingController.createListing);

// GET /api/listings - Get all listings
router.get('/all', listingController.getAllListings);

// GET /api/listings -  Get listings with optional category filter and pagination
router.get('/', listingController.getListings);


// GET /api/listings/:id - Get a specific listing
router.get('/:id', listingController.getListingById);

// PUT /api/listings/:id - Update a specific listing (Protected)
router.put('/:id', protect, listingController.updateListing);

// DELETE /api/listings/:id - Delete a specific listing (Protected)
router.delete('/:id', protect, listingController.deleteListing);

export default router;

