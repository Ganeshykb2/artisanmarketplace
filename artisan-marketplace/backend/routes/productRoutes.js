// backend/routes/productRoutes.js
import express from 'express';
import { createProduct, updateProduct, deleteProduct, getArtistProduct, getAllProducts } from '../controllers/productController.js';
import { getFeaturedProducts } from '../controllers/productController.js';
import artistAuth from '../middlewares/artistAuth.js'; // Import Artist Authorization middleware
const router = express.Router();
// Product routes
router.post('/create', createProduct); // Protected route
router.get('/artistsproducts', getArtistProduct);//Protected route
router.put('/update/:id',artistAuth, updateProduct); // Protected route
router.delete('/delete/:id', artistAuth, deleteProduct); // Protected route
// Route to fetch featured products (products with ratings above 3)
router.get('/featured-products', getFeaturedProducts);
router.get('/all-products', getAllProducts);
export default router;
