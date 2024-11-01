// models/userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Automatically generated ObjectId
    username: { type: String, unique: true }, // Unique username
    password: { type: String }, // Hashed password
    email: { type: String, unique: true }, // Unique email
    usertype: { type: String, enum: ['normal', 'admin'], default: 'normal' }, // User type
    wallet: { type: [String], default: [] }, // Array of public wallet addresses
    nonce: { type: String }, // Add nonce field
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);



// Custom validation to ensure either username/password or wallet is provided
userSchema.pre('validate', function (next) {
  if (
    (!this.username || !this.password) &&
    (!this.wallet || this.wallet.length === 0)
  ) {
    next(
      new Error('User must have either a username and password or a wallet address.')
    );
  } else {
    next();
  }
});

// Pre-save middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
module.exports = mongoose.model('User', userSchema);
