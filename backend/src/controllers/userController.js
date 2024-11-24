// /controllers/userController.js
const User = require('../models/user');
const Listing = require('../models/listings')
const jwt = require('jsonwebtoken');
const validator = require('validator'); // Use the validator library for email and link validation


// @desc    Get specific user by ID (Protected version)
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res) => {
  try {
      console.log('Received request to get user by ID:', req.params.id);

      const user = await User.findById(req.params.id, '-password');
      console.log('User retrieval result:', user);

      if (!user) {
          console.log('User not found for ID:', req.params.id);
          return res.status(404).json({ message: 'User not found' });
      }

      console.log('Returning user data (without password):', user);
      res.json(user);
  } catch (error) {
      console.error('Error in getUserById:', error); // Log the exact error
      res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get specific user by ID (Public version)
// @route   GET /api/users/:id/public
// @access  Public
exports.getUserByIdPublic = async (req, res) => {
  try {
    console.log("Received request to get public user data for ID:", req.params.id);

    // Attempt to find the user by ID and select only the public fields
    const user = await User.findById(req.params.id).select('username wallet rep createdAt bio links');
    console.log("Database query complete");

    // Check if the user was found
    if (!user) {
      console.warn(`User with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare response data with all required fields
    const responseData = {
      username: user.username,
      wallet: user.wallet?.[0] || null, // Return the first wallet address or null if wallet is empty or undefined
      rep: user.rep || 0, // Return rep or default to 0 if undefined
      dateJoined: user.createdAt, // Use createdAt as dateJoined
      bio: user.bio || 'No bio available', // Default to message if bio is empty
      links: user.links || null, // Return links or null if undefined
    };

    console.log("Sending response:", responseData);
    res.json(responseData);
  } catch (error) {
    console.error("Error fetching public user data:", error); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Get specific user by wallet address (Public version)
// @route   GET /api/users/by-wallet/:walletAddress
// @access  Public
exports.getUserByWalletAddressPublic = async (req, res) => {
  try {
      const walletAddress = req.params.walletAddress.toLowerCase(); // Normalize to lowercase
      
      // Finds any user document where `wallet` contains the `walletAddress`
      const user = await User.findOne({ wallet: walletAddress }).select('-password');

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
  } catch (error) {
      console.error('Error fetching user by wallet address:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all listings by User ID
// @route   GET /api/users/:id/listings
// @access  Public
exports.getAllListingsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    console.log("Fetching listings for user ID:", userId);

    // Find all listings associated with the user ID
    const listings = await Listing.find({ sellerId: userId });

    if (!listings || listings.length === 0) {
      console.warn(`No listings found for user ID: ${userId}`);
      return res.status(404).json({ message: 'No listings found for this user.' });
    }

    console.log("Listings retrieved:", listings);
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings by user ID:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user details by ID
// @route   PUT /api/users/:id
// @access  Private
exports.updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, bio, email, links } = req.body;

    console.log("Received update request for user ID:", userId);

    // Initialize an empty updates object
    const updates = {};

    // Check and validate each field
    if (username) {
      // Check if username is unique
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      updates.username = username;
    }

    if (bio) {
      // Ensure bio is under 250 characters
      if (bio.length > 250) {
        return res.status(400).json({ message: 'Bio must be under 250 characters' });
      }
      updates.bio = bio;
    }

    if (email) {
      // Validate email format
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
      }
      // Check if email is unique
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser && existingEmailUser._id.toString() !== userId) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      updates.email = email;
    }

    if (links) {
      // Ensure all links are valid URLs
      if (!Array.isArray(links) || !links.every(link => validator.isURL(link))) {
        return res.status(400).json({ message: 'All links must be valid URLs' });
      }
      updates.links = links;
    }

    console.log("Validated updates:", updates);

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true, // Return the updated document
      runValidators: true, // Run mongoose schema validations
    });

    if (!updatedUser) {
      console.warn(`User with ID ${userId} not found`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("User successfully updated:", updatedUser);
    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
