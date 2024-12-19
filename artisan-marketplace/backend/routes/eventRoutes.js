import express from 'express';
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventsByArtist,
  getUserRegistrations,
  getUpcomingEvents,
  getEventById,
  getAllEvents
} from '../controllers/eventController.js';
import { checkAuth } from '../middlewares/authMiddleware.js'; // Assuming checkAuth middleware is correctly defined
import artistAuth from '../middlewares/artistAuth.js';
import artistOrCustomerAuth from "../middlewares/artistOrCustomerAuth.js";

const router = express.Router();

// Public Routes
router.get('get-event/:eventId', getEventById);  // Fetch single event details (public)

// Protected Routes
router.post('/create',artistAuth,  createEvent); 
router.post('/getevents',artistAuth, getEvents);
router.put('/:eventId', artistAuth, updateEvent);  // Only the artisan who created the event can update
router.delete('/:eventId', artistAuth, deleteEvent);  // Only the artisan who created the event can delete
router.post('/:eventId/register', artistOrCustomerAuth, registerForEvent);

router.get('/artist/:artistId', checkAuth, getEventsByArtist);  // Fetch all events hosted by a specific artist
router.get('/registrations', checkAuth, getUserRegistrations);  // Fetch events user is registered for
router.get('/upcoming', getUpcomingEvents);
router.get('/getallevents',getAllEvents);


export default router;
