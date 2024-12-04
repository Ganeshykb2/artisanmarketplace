import express from 'express';
import { 
  registerCustomer, 
  loginCustomer, 
  getCustomerOrders, 
  placeOrder, 
  getProducts, 
  getEventByName,
  joinEventById,
  joinEventByName,
  getArtistProfile, 
  getAllArtists,
  getProductById, // New method to fetch product by ID
  getProductReviews, // New method to fetch product reviews
  submitProductReview, // New method to submit product review
  getEvents, // New method to fetch all events
  makePayment,
} from '../controllers/customerController.js';
import { checkAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerCustomer); // Public route for registration
router.post('/login', loginCustomer); // Public route for login
router.get('/artists', getAllArtists); // Route to get a list of all artists
router.get('/products', getProducts); // View products available for sale
router.get('/products/:productId', getProductById); // View single product by ID
router.get('/products/:productId/reviews', getProductReviews); // View product reviews
router.get('/events', getEvents); // View all events
router.get('/event/name/:eventName', getEventByName); // Get event by name

// Authenticated routes
router.get('/orders', checkAuth, getCustomerOrders); // Get customer's orders
router.post('/order', checkAuth, placeOrder); // Place a new order
router.post('/join-event/id/:eventId', checkAuth, joinEventById); // Join event by ID
router.post('/join-event/name/:eventName', checkAuth, joinEventByName); // Join event by name
router.post('/products/:productId/reviews', checkAuth, submitProductReview); // Submit product review
router.get('/artist/:artistId', checkAuth, getArtistProfile); // Get particular artist profile details, rate-limited
router.post('/payment', checkAuth, makePayment); // New route for making a payment



export default router;
