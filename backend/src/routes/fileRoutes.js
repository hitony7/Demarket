import express from 'express';
import multer from 'multer';
import * as fileController from '../controllers/fileController.js';

const router = express.Router();

// Configure Multer with memory storage and file type/field validation
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  fileFilter: (req, file, cb) => {
    console.log('FileFilter Debug: Processing file:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size || 'Size not available',
    });

    const allowedFields = ['file', 'files'];
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!allowedFields.includes(file.fieldname)) {
      console.error(`FileFilter Error: Unexpected field: ${file.fieldname}`);
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      console.error(`FileFilter Error: Unsupported file type: ${file.mimetype}`);
      return cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }

    console.log(`FileFilter Success: File accepted - ${file.originalname}`);
    cb(null, true); // Accept file
  },
});


// Route for single file upload
router.post('/upload', upload.single('file'), async (req, res) => {
  console.log('Multer Middleware Debug: req.file:', req.file);

  try {
    // Delegate request handling to the controller
    await fileController.uploadFileToIPFS(req, res);
  } catch (error) {
    console.error('Route Error:', error.message);

    // Optionally log unhandled errors (if any) before passing to the controller
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});



// Route for multiple file uploads
router.post('/upload-images', upload.array('files', 10), async (req, res, next) => {
  try {
    console.log('Uploaded files:', req.files); // Debugging uploaded files
    await fileController.uploadImagesForListing(req, res);
  } catch (err) {
    next(err); // Pass errors to the error handler middleware
  }
});

// Route to fetch a listing with its associated images
router.get('/listings/:id', async (req, res, next) => {
  try {
    await fileController.getListingWithImages(req, res);
  } catch (err) {
    next(err); // Pass errors to the error handler middleware
  }
});

// Centralized error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      console.error(`Unexpected field encountered: ${err.field}`);
      return res.status(400).json({ error: `Unexpected field: ${err.field}` });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      console.error('File size exceeds limit');
      return res.status(400).json({ error: 'File size exceeds limit' });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err.message.includes('Unsupported file type')) {
    console.error('File Upload Error:', err.message);
    return res.status(400).json({ error: err.message });
  }

  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

export default router;


