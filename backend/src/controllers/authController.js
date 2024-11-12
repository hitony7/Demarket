const User = require('../models/user');
const crypto = require('crypto');
const ethUtil = require('ethereumjs-util');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers'); // Import ethers.js

// Temporary private key for testing purposes (do not use in production)
const TEST_PRIVATE_KEY = process.env.PRIVATE_KEY_DEV; // Replace with an actual private key for testing


exports.requestNonce = async (req, res) => { 
  const { walletAddress } = req.body;

  console.log('Received request for nonce with walletAddress:', walletAddress);

  if (!walletAddress) {
    console.error('Wallet address is missing in the request body.');
    return res.status(400).json({ message: 'Wallet address is required' });
  }

  try {
    // Normalize the wallet address
    const normalizedAddress = walletAddress.toLowerCase();
    console.log('Normalized wallet address:', normalizedAddress);

    // Find or create the user
    let user = await User.findOne({ wallet: normalizedAddress });

    if (user) {
      console.log('User found with wallet address:', normalizedAddress);
    } else {
      console.log('No user found with wallet address:', normalizedAddress);
      console.log('Creating new user.');
      // Create a new user with the wallet address
      user = new User({
        wallet: [normalizedAddress],
      });
    }

    // Generate a random nonce
    const nonce = crypto.randomBytes(16).toString('hex');
    console.log('Generated nonce:', nonce);
    user.nonce = nonce;

    // Save the user
    await user.save();
    console.log('User saved successfully with new nonce.');

    res.status(200).json({ nonce });
  } catch (error) {
    console.error('Error in requestNonce:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifySignature = async (req, res) => {
  console.log("Received request to verify signature");

  const { walletAddress, signature } = req.body;
  console.log("Provided Wallet Address:", walletAddress);
  console.log("Provided Signature:", signature);

  if (!walletAddress || !signature) {
    console.error("Missing wallet address or signature");
    return res.status(400).json({ message: 'Wallet address and signature are required' });
  }

  try {
    // Find the user by wallet address
    const normalizedAddress = walletAddress.toLowerCase();
    console.log("Searching for user with normalized address:", normalizedAddress);
    const user = await User.findOne({ wallet: normalizedAddress });

    if (!user || !user.nonce) {
      console.error("User not found or nonce missing");
      return res.status(400).json({ message: 'User not found or nonce missing' });
    }

    const message = `I am signing my one-time nonce: ${user.nonce}`;
    console.log("Message to be hashed:", message);

    // Hash the original message
    const msgHash = ethUtil.hashPersonalMessage(Buffer.from(message));
    console.log("Message hash:", msgHash.toString('hex'));

    // Extract the signature parameters
    const signatureBuffer = ethUtil.toBuffer(signature);
    const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
    console.log("Signature parameters:", signatureParams);

    // Recover public key
    const publicKey = ethUtil.ecrecover(
      msgHash,
      signatureParams.v,
      signatureParams.r,
      signatureParams.s
    );
    console.log("Recovered public key:", publicKey.toString('hex'));

    // Convert public key to address
    const addressBuffer = ethUtil.publicToAddress(publicKey);
    const recoveredAddress = ethUtil.bufferToHex(addressBuffer);
    console.log("Recovered address from signature:", recoveredAddress);

    // Compare the recovered address with the provided wallet address
    if (recoveredAddress.toLowerCase() !== normalizedAddress) {
      console.error("Signature verification failed: Addresses do not match");
      return res.status(401).json({ message: 'Signature verification failed' });
    }

    console.log("Signature verification successful");

    // Signature is valid, generate JWT
    const token = jwt.sign(
      { id: user._id, walletAddress: user.wallet },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log("Generated JWT:", token);

    // Reset nonce to prevent replay attacks
    user.nonce = null;
    await user.save();
    console.log("Nonce reset and user saved");

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during signature verification:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Generates a signature for the provided nonce using the test private key (for testing purposes only)
exports.generateSignatureForTesting = async (req, res) => {
  const { nonce } = req.body;

  if (!nonce) {
    return res.status(400).json({ message: 'Nonce is required to generate a signature' });
  }

  try {
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);
    console.log("Derived Wallet Address from Private Key:", wallet.address);

    const message = `I am signing my one-time nonce: ${nonce}`;
    console.log("Message to be signed:", message);

    // Sign the original message string, allowing ethers.js to handle hashing
    const signature = await wallet.signMessage(message);
    console.log("Generated signature:", signature);

    res.status(200).json({ signature });
  } catch (error) {
    console.error("Error generating signature:", error);
    res.status(500).json({ message: 'Server error' });
  }
};