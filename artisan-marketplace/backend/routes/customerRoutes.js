// routes/customerRoutes.js
import express from 'express';
import { registerCustomer, loginCustomer, getCustomerOrders } from '../controllers/customerController.js';
import { checkAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.get('/orders', checkAuth, getCustomerOrders); // Removed :customerId, relying on authenticated user

export default router;

