import express from 'express';
import { getAllArtists, getAllProducts, getAllOrders, getAllEvents, deleteArtist, adminLogin ,adminRegister} from '../controllers/adminController.js';
import adminAuth from '../middlewares/adminAuth.js';

const router = express.Router();
// Admin registration (non-secure route, only allows 2 admins)
router.post('/register', adminRegister);
// Admin login
router.post('/login', adminLogin);

// Admin can view all artists, products, orders, and events only after login
router.get('/artists', adminAuth, getAllArtists);
router.get('/products', adminAuth, getAllProducts);
router.get('/orders', adminAuth, getAllOrders);
router.get('/events', adminAuth, getAllEvents);

// Admin can delete an artist
router.delete('/artists/:id', adminAuth, deleteArtist);

export default router;
