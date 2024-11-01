// controllers/authController.js

const User = require('../models/User');
const crypto = require('crypto');

exports.requestNonce = async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ message: 'Wallet address is required' });
  }

  try {
    // Normalize the wallet address
    const normalizedAddress = walletAddress.toLowerCase();

    // Find or create the user
    let user = await User.findOne({ wallet: normalizedAddress });

    if (!user) {
      // Create a new user with the wallet address
      user = new User({
        wallet: [normalizedAddress],
      });
    }

    // Generate a random nonce
    const nonce = crypto.randomBytes(16).toString('hex');
    user.nonce = nonce;

    // Save the user
    await user.save();

    res.status(200).json({ nonce });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.verifySignature = async (req, res) => {
  const { walletAddress, signature } = req.body;

  if (!walletAddress || !signature) {
    return res.status(400).json({ message: 'Wallet address and signature are required' });
  }

  try {
    // Find the user by wallet address
    const user = await User.findOne({ wallet: walletAddress.toLowerCase() });

    if (!user || !user.nonce) {
      return res.status(400).json({ message: 'User not found or nonce missing' });
    }

    const message = `I am signing my one-time nonce: ${user.nonce}`;

    // Hash the message
    const msgBuffer = Buffer.from(message);
    const msgHash = ethUtil.hashPersonalMessage(msgBuffer);

    // Extract the signature parameters
    const signatureBuffer = ethUtil.toBuffer(signature);
    const signatureParams = ethUtil.fromRpcSig(signatureBuffer);

    // Get the public key
    const publicKey = ethUtil.ecrecover(
      msgHash,
      signatureParams.v,
      signatureParams.r,
      signatureParams.s
    );

    const addressBuffer = ethUtil.publicToAddress(publicKey);
    const address = ethUtil.bufferToHex(addressBuffer);

    if (address.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ message: 'Signature verification failed' });
    }

    // Signature is valid, generate JWT
    const token = jwt.sign(
      { id: user._id, walletAddress: user.wallet },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Reset nonce to prevent replay attacks
    user.nonce = null;
    await user.save();

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};