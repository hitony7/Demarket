// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/request-nonce', authController.requestNonce);
router.post('/verify-signature', authController.verifySignature);

module.exports = router;
