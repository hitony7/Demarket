// controllers/listingController.js

const Listing = require('../models/listings');

/**
 * Create a new listing
 * POST /api/listings
 */
exports.createListing = async (req, res) => {
  console.log("Received request body:", req.body);
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


    // Collect missing required fields
    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!category) missingFields.push('category');
    if (!description) missingFields.push('description');
    if (price === undefined || price === null) missingFields.push('price');
    if (!currency) missingFields.push('currency');
    if (!saleType) missingFields.push('saleType');

    // If there are missing fields, return an error response
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'All required fields must be provided',
        missingFields,
      });
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
      image: image || null,
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

// @route   GET /api/listings
// @access  Public
// Get all listings
exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Get listings with optional category filter and pagination
// @route   GET /api/listings
// @access  Public
exports.getListings = async (req, res) => {
  const { category, page, pageSize } = req.query;

  if (!category && !page && !pageSize) {
    // No query parameters; return all listings
    return listingController.getAllListings(req, res);
  }

  // Apply filtering and pagination
  try {
    const { category, page = 1, pageSize = 20 } = req.query;

    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const query = {};
    if (category) query.category = category;

    const [listings, total] = await Promise.all([
      Listing.find(query).skip(offset).limit(limit),
      Listing.countDocuments(query),
    ]);

    res.json({
      listings,
      pagination: {
        totalItems: total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
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
