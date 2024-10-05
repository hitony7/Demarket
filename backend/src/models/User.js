const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User Schema
const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },  // Automatically generated ObjectId
  username: { type: String, required: true, unique: true },   // Unique username
  password: { type: String, required: true },  // Hashed password
  email: { type: String, required: true, unique: true },  // Unique email
  usertype: { type: String, enum: ['normal', 'admin'], default: 'normal' },  // User type (e.g., normal, admin)
  wallet: { type: [String], default: [] }  // Array of public wallet addresses (e.g., Ethereum, Bitcoin, etc.)
}, { timestamps: true });  // Automatically add createdAt and updatedAt fields

// Pre-save middleware to hash the password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
module.exports = mongoose.model('User', userSchema);
