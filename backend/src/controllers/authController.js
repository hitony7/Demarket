import dotenv from 'dotenv'; // Import dotenv for environment variables
dotenv.config(); // Load environment variables

import User from '../models/User.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';


const TEST_PRIVATE_KEY = process.env.PRIVATE_KEY_DEV;


export const requestNonce = async (req, res) => { 
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ message: 'Wallet address is required' });
  }

  try {
    const normalizedAddress = walletAddress.toLowerCase();
    let user = await User.findOne({ wallet: normalizedAddress });

    if (!user) {
      user = new User({
        wallet: [normalizedAddress],
      });
    }

    const nonce = crypto.randomBytes(16).toString('hex');
    user.nonce = nonce;

    await user.save();

    res.status(200).json({ nonce });
  } catch (error) {
    console.error('Error in requestNonce:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifySignature = async (req, res) => {
  const { walletAddress, signature } = req.body;

  if (!walletAddress || !signature) {
    return res.status(400).json({ message: 'Wallet address and signature are required' });
  }

  try {
    const normalizedAddress = walletAddress.toLowerCase();
    const user = await User.findOne({ wallet: normalizedAddress });

    if (!user || !user.nonce) {
      return res.status(400).json({ message: 'User not found or nonce missing' });
    }

    const message = `I am signing my one-time nonce: ${user.nonce}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== normalizedAddress) {
      return res.status(401).json({ message: 'Signature verification failed' });
    }

    const token = jwt.sign(
      { id: user._id, walletAddress: user.wallet },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    user.nonce = null;
    await user.save();

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during signature verification:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const generateSignatureForTesting = async (req, res) => {
  const { nonce } = req.body;

  if (!nonce) {
    return res.status(400).json({ message: 'Nonce is required to generate a signature' });
  }

  try {
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);
    const message = `I am signing my one-time nonce: ${nonce}`;
    const signature = await wallet.signMessage(message);

    res.status(200).json({ signature });
  } catch (error) {
    console.error("Error generating signature:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


export default {
  requestNonce,
  verifySignature,
  generateSignatureForTesting,
};
