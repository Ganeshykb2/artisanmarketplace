import express from 'express';
import { getAllArtists, getAllProducts, getAllOrders, getAllEvents } from '../controllers/adminController.js';
const router = express.Router();

// Admin can view all artists, products, orders, and events
router.get('/artists', getAllArtists);
router.get('/products', getAllProducts);
router.get('/orders', getAllOrders);
router.get('/events', getAllEvents);

export default router;
