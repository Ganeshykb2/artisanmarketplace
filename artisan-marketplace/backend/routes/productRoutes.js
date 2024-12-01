// backend/routes/productRoutes.js
import express from 'express';
import { createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { checkAuth } from '../middlewares/authMiddleware.js'; // assuming you want to protect these routes

const router = express.Router();

// Product routes
router.post('/create', checkAuth, createProduct); // Protected route
router.put('/update/:id',checkAuth, updateProduct); // Protected route
router.delete('/delete/:id', checkAuth, deleteProduct); // Protected route

export default router;
