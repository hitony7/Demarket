import dotenv from 'dotenv'; // Import dotenv for environment variables
dotenv.config(); // Load environment variables


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer'; // Import multer
import apiRoutes from './routes/index.js'; // Adjust path as needed
import { errorHandler} from './middleware/errorhandler.js'; // Adjust path as needed


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON requests

// Multer setup to handle multipart form data
//const upload = multer();

// Use multer globally for multipart form data
//app.use(upload.none()); // This will parse form-data with no files

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Global logging middleware
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.originalUrl}`);
  next(); // Pass control to the next middleware function
});

// Routes base route is /api
app.use('/api', apiRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
