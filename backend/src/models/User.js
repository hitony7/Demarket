// models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    username: { type: String, unique: true },
    password: { type: String }, //Hashed
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values without violating unique constraint
    },
    usertype: { type: String, enum: ['normal', 'admin'], default: 'normal' },
    wallet: { type: [String], default: [] },  //Enforce Uniqueness Later if needed
    nonce: { type: String },
    bio: { type: String },
    links: { type: String },
    rep: { type: Number, default: 0}
  },
  { timestamps: true, collection: 'users' } // Adds explicit collection name
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

// Pre-save middleware to generate a unique username if it's missing
userSchema.pre('save', async function (next) {
  if (!this.username) {
    // Generate a unique username based on timestamp and a random suffix
    let username;
    let usernameExists = true;

    while (usernameExists) {
      username = `user_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`;
      // Check if the generated username already exists in the database
      const existingUser = await mongoose.models.User.findOne({ username });
      usernameExists = !!existingUser;
    }

    this.username = username; // Assign the generated unique username
  }

  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
module.exports = mongoose.model('User', userSchema);
