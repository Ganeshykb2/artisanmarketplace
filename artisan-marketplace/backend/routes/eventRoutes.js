import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventsByArtist,
  getUserRegistrations
} from '../controllers/eventController.js';
import { checkAuth } from '../middlewares/authMiddleware.js'; // Assuming checkAuth middleware is correctly defined
import artistAuth from '../middlewares/artistAuth.js'

const router = express.Router();

// Public Routes
router.get('/getevents', getEvents);
router.get('/:eventId', getEventById);  // Fetch single event details (public)


router.post('/create',  createEvent); 

// Protected Routes
//  router.get('/getevents',artistAuth,getevents);
// router.post('/create',artistAuth,createEvent);  // Only artisans can create events
router.put('/:eventId', artistAuth, updateEvent);  // Only the artisan who created the event can update
router.delete('/:eventId', artistAuth, deleteEvent);  // Only the artisan who created the event can delete


router.post('/register/:eventId', checkAuth, registerForEvent);  // Register for an event (both customers and artisans)
router.get('/artist/:artistId', checkAuth, getEventsByArtist);  // Fetch all events hosted by a specific artist
router.get('/registrations', checkAuth, getUserRegistrations);  // Fetch events user is registered for

export default router;
