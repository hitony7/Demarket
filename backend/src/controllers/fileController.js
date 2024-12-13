import uploadToPinata from '../services/ipfsService.js';
import Image from '../models/images.js';
import Listing from '../models/listings.js';
import mongoose from 'mongoose';

export const uploadFileToIPFS = async (req, res) => {
  try {
    console.log('Request Debug: Full Request Body:', req.body);
    console.log('Request Debug: Multer File Object:', req.file);

    const file = req.file;
    if (!file) {
      console.error('No file provided in the request.');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Processing file for IPFS upload:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    // Call uploadToPinata and validate response
    const result = await uploadToPinata(file);
    console.log('File uploaded successfully:', result);
    
    if (!result || !result.ipfsHash) {
      console.error('Upload to Pinata succeeded but returned an unexpected response:', result);
      return res.status(500).json({ error: 'Unexpected response from Pinata', details: result });
    }
    // Send success response
    return res.status(200).json({
      message: 'File uploaded successfully',
      ipfsHash: result.ipfsHash,
      fileUrl: result.fileUrl,
    });

  } catch (error) {
    // Log the error in detail
    console.error('IPFS Upload Error:', error.message);
    if (error.response) {
      console.error('Error Response from Pinata:', error.response.data);
    }

    // Ensure we return an appropriate error response
    return res.status(500).json({
      error: error.message || 'Internal Server Error',
      details: error.response?.data || null,
    });
  }
};



export const uploadImagesForListing = async (req, res) => {
  try {
    const { listingId } = req.body;
    const files = req.files; // Multiple file uploads (Multer)

    if (!listingId || !files || files.length === 0) {
      return res.status(400).json({ error: 'Listing ID and files are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ error: 'Invalid Listing ID format' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const ipfsResult = await uploadToPinata(file.buffer, { name: file.originalname });
        const imageData = {
          listingId,
          ipfsHash: ipfsResult.IpfsHash,
          filename: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: `https://ipfs.io/ipfs/${ipfsResult.IpfsHash}`,
        };
        return await Image.create(imageData);
      })
    );

    listing.imageIds = listing.imageIds.concat(uploadedImages.map((img) => img._id));
    await listing.save();

    res.status(200).json({
      message: 'Images uploaded successfully',
      images: uploadedImages,
    });
  } catch (error) {
    console.error('Image Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
};

export const getListingWithImages = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Listing ID format' });
    }

    const listing = await Listing.findById(id).populate('imageIds');
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.status(200).json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
};


  export default {
    uploadFileToIPFS,
    uploadImagesForListing,
    getListingWithImages,
  };