// backend/routes/productRoutes.js
import express from 'express';
import { createProduct, updateProduct, deleteProduct, getArtistProducts, getAllProducts, getProductsByIds, getArtistsWithProducts } from '../controllers/productController.js';
import { getFeaturedProducts, getProductsById } from '../controllers/productController.js';
import artistAuth from '../middlewares/artistAuth.js'; // Import Artist Authorization middleware
const router = express.Router();
// Product routes
router.post('/create', artistAuth, createProduct); // Protected route
router.put('/update/:id',artistAuth, updateProduct); // Protected route
router.delete('/delete/:id', artistAuth, deleteProduct); // Protected route
router.get('/artistsproducts/:artistId', getArtistProducts); // /:artistId -> id of Artist.
router.get('/getArtistWithProducts',getArtistsWithProducts);
// Route to fetch featured products (products with ratings above 3)
router.get('/featured-products', getFeaturedProducts);
router.get('/all-products', getAllProducts);
router.get('/product-id/:productId', getProductsById);
router.post('/id-products', getProductsByIds);
router.get('/getartistproducts/:artistId',getArtistProducts);
export default router;
