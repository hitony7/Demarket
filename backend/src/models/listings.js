
import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    imageIds:  [{ 
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Image' }], // Reference to image documents,
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      enum: ['ETH', 'USDC', 'USDT', 'DAI'],
      required: [true, 'Currency is required'],
    },
    saleType: {
      type: String,
      enum: ['standard', 'bid'],
      required: [true, 'Sale Type is required'],
    },
    bidDuration: {
      type: Number,
      default: null,
      validate: {
        validator: function (value) {
          // Bid duration should only be specified for 'bid' sale type
          return this.saleType === 'bid' ? value > 0 : true;
        },
        message: 'Bid duration must be greater than 0 for bid sales',
      },
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller ID is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id; // Add id field
        delete ret._id; // Remove _id
        delete ret.__v; // Remove __v
        return ret;
      },
    },
    collection: 'listings', // Explicit collection name
  }
);

// Export the Listing model

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;