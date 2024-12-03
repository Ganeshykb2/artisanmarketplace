import express from 'express';
import { 
  registerCustomer, 
  loginCustomer, 
  getCustomerOrders, 
  placeOrder, 
  getProducts, 
  getEventByName, // New method to fetch event by name
  joinEventById,
  joinEventByName,
  getArtistProfile, 
  getAllArtists
} from '../controllers/customerController.js';
import { checkAuth } from '../middlewares/authMiddleware.js';
import artistViewLimiter from '../middlewares/rateLimit.js';

const router = express.Router();

// Customer registration and login
router.post('/register', registerCustomer); // Public route for registration
router.post('/login', loginCustomer); // Public route for login
router.get('/artists', getAllArtists); // Route to get a list of all artists
router.get('/artist/:artistId', artistViewLimiter, getArtistProfile);//rate limited get particular artist profile details to stop inflating views


// Authenticated customer actions
router.get('/orders', checkAuth, getCustomerOrders); // Get customer's orders
router.post('/order', checkAuth, placeOrder); // Place a new order
router.get('/products', getProducts); // View products available for sale
router.get('/event/name/:eventName', getEventByName); // Get event by name
router.post('/join-event/id/:eventId', checkAuth, joinEventById); // Join event by ID
router.post('/join-event/name/:eventName', checkAuth, joinEventByName); // Join event by name


export default router;
