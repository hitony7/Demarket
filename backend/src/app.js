import dotenv from 'dotenv'; // Import dotenv for environment variables
dotenv.config(); // Load environment variables


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import { errorHandler} from './middleware/errorhandler.js';
import { pathToFileURL } from 'node:url';


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON requests

// Routes base route is /api
app.use('/api', apiRoutes);

// Error handling middleware
app.use(errorHandler);

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not set. Database-backed routes will fail until it is configured.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

export async function startServer() {
  await connectDatabase();

  return app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}

export default app;
