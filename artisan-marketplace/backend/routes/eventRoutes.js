// backend/routes/eventRoutes.js
import express from 'express';
import { createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { checkAuth } from '../middlewares/authMiddleware.js'; // assuming you want to protect these routes

const router = express.Router();

// Event routes
router.post('/create', checkAuth, createEvent); // Protected route
router.put('/update/:id', checkAuth, updateEvent); // Protected route
router.delete('/delete/:id', checkAuth, deleteEvent); // Protected route

export default router;
