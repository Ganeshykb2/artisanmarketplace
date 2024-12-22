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
import artistAuth from '../middlewares/artistAuth.js';
const router = express.Router();
// Order routes
router.get('/orders', checkAuth, getOrdersByCustomer);
router.post('/create', checkAuth, createOrder); // Protected route for creating an order
router.get('/:orderId', checkAuth, getOrderById); // Protected route to get order by ID
router.get('/customer/orders', checkAuth, getOrdersByCustomer); // Protected route to get orders of a customer
router.get('/artist/orders', artistAuth, getOrdersByArtist); // Protected route to get all orders for an artist
router.put('/:orderId/status', artistAuth, updateOrderStatus); // Protected route to update order status
router.delete('/:orderId', checkAuth, deleteOrder); // Protected route to delete order
export default router;

