import express from 'express';
import { 
  createOrder, 
  getOrderById, 
  getOrdersByCustomer, 
  getOrdersByArtist, 
  updateOrderStatus, 
  deleteOrder 
} from '../controllers/orderController.js';
import { checkAuth } from '../middlewares/authMiddleware.js'; // Authentication middleware

const router = express.Router();

// Order routes
router.post('/create', checkAuth, createOrder); // Protected route for creating an order
router.get('/:orderId', checkAuth, getOrderById); // Protected route to get order by ID
router.get('/customer/orders', checkAuth, getOrdersByCustomer); // Protected route to get orders of a customer
router.get('/artist/orders', checkAuth, getOrdersByArtist); // Protected route to get all orders for an artist
router.put('/:orderId/status', checkAuth, updateOrderStatus); // Protected route to update order status
router.delete('/:orderId', checkAuth, deleteOrder); // Protected route to delete order

export default router;
