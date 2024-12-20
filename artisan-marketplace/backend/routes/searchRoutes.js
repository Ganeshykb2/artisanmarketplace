// routes/searchRoutes.js
import express from 'express';
import {search} from '../controllers/searchController.js';

const router = express.Router();

// Search routes
router.get('/search/:query', search); 

export default router;

