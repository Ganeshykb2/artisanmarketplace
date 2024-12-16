import express from 'express';
import { getCart, addItemToCart, removeItemFromCart, deleteCart } from '../controllers/cartController.js';
import artistOrCustomerAuth from '../middlewares/artistOrCustomerAuth.js';

const router = express.Router();

router.get('/get-cart', artistOrCustomerAuth, getCart);

router.post('/add-item', artistOrCustomerAuth, addItemToCart);

router.put('/remove-item', artistOrCustomerAuth, removeItemFromCart);

router.delete('/delete-cart', artistOrCustomerAuth, deleteCart);

export default router;