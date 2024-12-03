// backend/routes/orderRoutes.js
import express from 'express';
import { createOrder, getOrderById } from '../controllers/orderController.js';
import { checkAuth} from '../middlewares/authMiddleware.js'; // assuming you want to protect these routes

const router = express.Router();

// Order routes
router.post('/create', checkAuth, createOrder); // Protected route
router.get('/:orderId', checkAuth, getOrderById); // Protected route

export default router;

