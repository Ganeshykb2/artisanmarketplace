import express from 'express';
import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventsByArtist,
  getUserRegistrations
} from '../controllers/eventController.js';
import { checkAuth } from '../middlewares/authMiddleware.js'; // Assuming checkAuth middleware is correctly defined

const router = express.Router();

// Public Routes
router.get('/:eventId', getEventById);  // Fetch single event details (public)

// Protected Routes
router.post('/create', checkAuth, createEvent);  // Only artisans can create events
router.put('/:eventId', checkAuth, updateEvent);  // Only the artisan who created the event can update
router.delete('/:eventId', checkAuth, deleteEvent);  // Only the artisan who created the event can delete
router.post('/register/:eventId', checkAuth, registerForEvent);  // Register for an event (both customers and artisans)
router.get('/artist/:artistId', checkAuth, getEventsByArtist);  // Fetch all events hosted by a specific artist
router.get('/registrations', checkAuth, getUserRegistrations);  // Fetch events user is registered for

export default router;
