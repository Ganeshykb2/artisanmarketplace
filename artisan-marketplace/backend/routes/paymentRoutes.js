import express from 'express';
import { submitPaymentReference, verifyPaymentManually } from '../controllers/paymentController.js';

const router = express.Router();

// Route for customer to submit payment reference ID
router.post('/submit-payment', submitPaymentReference);

// Route for admin/artist to manually verify payment
router.post('/verify-payment', verifyPaymentManually);

export default router;
