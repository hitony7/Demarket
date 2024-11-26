// routes/authRoutes.js

import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/request-nonce', authController.requestNonce);
router.post('/verify-signature', authController.verifySignature);
router.post("/generate-signature", authController.generateSignatureForTesting);

export default router;