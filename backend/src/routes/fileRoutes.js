import express from 'express';
import multer from 'multer';
import * as fileController from '../controllers/fileController.js';

const router = express.Router();
const upload = multer(); // Use multer for parsing file uploads

router.post('/upload', upload.single('file'), fileController.uploadFileToIPFS);

router.post('/upload-images', upload.array('files', 10), fileController.uploadImagesForListing);

// Route to fetch a listing with its associated images
router.get('/listings/:id', fileController.getListingWithImages);

export default router;