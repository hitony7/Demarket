import ipfsClient from '../services/ipfsService.js'; // Assuming ipfsClient is exported as default
import Image from '../models/images.js'; // Assuming Image is exported as default
import Listing from '../models/listings.js'; // Assuming Listing is exported as default

export const uploadFileToIPFS = async (req, res) => {
  try {
    const file = req.file; // Assume you're using multer for file uploads
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await ipfsClient.add(file.buffer); // Add file to IPFS
    res.status(200).json({ ipfsHash: result.path });
  } catch (error) {
    console.error('IPFS Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload file to IPFS' });
  }
};




export const uploadImagesForListing = async (req, res) => {
  try {
    const { listingId } = req.body;
    const files = req.files; // Assume you're using multer for file uploads

    if (!listingId || !files || files.length === 0) {
      return res.status(400).json({ error: 'Listing ID and files are required' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const uploadedImages = [];
    for (const file of files) {
      // Upload file to IPFS
      const ipfsResult = await ipfsClient.add(file.buffer);

      // Save image metadata to the database
      const imageData = {
        listingId,
        ipfsHash: ipfsResult.path,
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `https://ipfs.io/ipfs/${ipfsResult.path}`, // Optional: Generate IPFS public URL
      };
      const savedImage = await Image.create(imageData);

      uploadedImages.push(savedImage);
    }

    // Optionally update the listing with image IDs
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