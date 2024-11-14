// /controllers/userController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');

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
  
      // Attempt to find the user by ID and select only the fields we need
      const user = await User.findById(req.params.id).select('username wallet');
      console.log("Database query complete");
  
      // Check if the user was found
      if (!user) {
        console.warn(`User with ID ${req.params.id} not found`);
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Prepare response data
      const responseData = {
        username: user.username,
        wallet: user.wallet?.[0] || null, // Return the first wallet address or null if wallet is empty or undefined
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


  exports.updateUserById = async (req, res) => {

  };