// controllers/listingController.js

const Listing = require('../models/listings');

/**
 * Create a new listing
 * POST /api/listings
 */
exports.createListing = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      image,
      price,
      currency,
      saleType,
      bidDuration,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !category ||
      !description ||
      !image ||
      price === undefined ||
      price === null ||
      !currency ||
      !saleType
    ) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Additional validation for bidDuration when saleType is 'bid'
    if (saleType === 'bid' && (!bidDuration || bidDuration <= 0)) {
      return res.status(400).json({ message: 'Valid bidDuration is required for bid sales' });
    }

    // Create a new Listing instance
    const newListing = new Listing({
      title,
      category,
      description,
      image,
      price,
      currency,
      saleType,
      bidDuration: saleType === 'bid' ? bidDuration : null,
      sellerId: req.user.id, // Set the sellerId from the authenticated user
    });

    // Save the listing to the database
    const savedListing = await newListing.save();

    // Respond with the saved listing
    res.status(201).json(savedListing);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({ errors });
    } else {
      console.error('Server Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Get all listings
exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific listing by ID
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(listing);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400).json({ message: 'Invalid listing ID' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Update a specific listing
exports.updateListing = async (req, res) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(updatedListing);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({ errors });
    } else if (error.kind === 'ObjectId') {
      res.status(400).json({ message: 'Invalid listing ID' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Delete a specific listing
exports.deleteListing = async (req, res) => {
  try {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);

    if (!deletedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(400).json({ message: 'Invalid listing ID' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};
