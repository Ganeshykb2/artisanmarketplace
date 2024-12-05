// backend/routes/productRoutes.js
import express from 'express';
import { createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import artistAuth from '../middlewares/artistAuth.js'; // Import Artist Authorization middleware

const router = express.Router();

// Product routes
router.post('/create', createProduct); // Protected route
router.put('/update/:id',artistAuth, updateProduct); // Protected route
router.delete('/delete/:id', artistAuth, deleteProduct); // Protected route

export default router;
