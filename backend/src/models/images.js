import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true }, // Reference to the listing
  ipfsHash: { type: String, required: true }, // IPFS hash for the image
  url: { type: String }, // Optional: Public gateway URL (e.g., IPFS gateway link)
  filename: { type: String, required: true }, // Original filename
  mimeType: { type: String, required: true }, // File MIME type (e.g., image/jpeg)
  size: { type: Number, required: true }, // File size in bytes
  uploadedAt: { type: Date, default: Date.now }, // Upload timestamp
});

const Image = mongoose.model('Image', imageSchema);

export default Image;
