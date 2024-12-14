import Event from '../models/Events.js';
import Artist from '../models/Artists.js';
import Customer from '../models/Customers.js';


export const createEvent = async (req, res) => {
  try {
    const { name, eventType, dateOfEvent, location, description } = req.body;
    const artistId = req.user.id; // Get artistId from the authenticated user

    // Check if the authenticated user is an artisan (artist)
    if (!req.user.artistId) {
      return res.status(403).json({ message: 'Only artisans can create events.' });
    }

    const newEvent = new Event({
      name,
      eventType,
      dateOfEvent,
      location,
      description,
      artistId: req.user.artistId, // Attach the artist's ID to the event
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
};

export const getEventById = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findOne({ eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event details', error });
  }
};
export const getUpcomingEvents = async (req, res) => {
  try {
    const currentDate = new Date();

    // Fetch events sorted by closest future dates
    const upcomingEvents = await Event.find({ dateOfEvent: { $gte: currentDate } })
      .sort({ dateOfEvent: 1 }) // Sort by ascending date
      .limit(4) // Limit to 4 events
      .select('dateOfEvent location description name'); // Select only necessary fields

    if (!upcomingEvents.length) {
      return res.status(404).json({ message: 'No upcoming events found' });
    }

    res.status(200).json({ message: 'Upcoming events fetched successfully', events: upcomingEvents });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming events', error });
  }
};
export const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findOne({ eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the authenticated user is the event's creator (artisan)
    if (event.artistId.toString() !== req.user.artistId.toString()) {
      return res.status(403).json({ message: 'Only the event creator can update this event.' });
    }

    // Update event details
    const updatedEvent = await Event.findOneAndUpdate({ eventId }, req.body, { new: true });
    res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
};

export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findOne({ eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the authenticated user is the event's creator (artisan)
    if (event.artistId.toString() !== req.user.artistId.toString()) {
      return res.status(403).json({ message: 'Only the event creator can delete this event.' });
    }

    await Event.findOneAndDelete({ eventId });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
};

export const registerForEvent = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;
  try {
    const event = await Event.findOne({ eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user has already registered
    const alreadyRegistered = event.participants.some(participant => participant.participantId.toString() === userId.toString());
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'User already registered for this event' });
    }

    // Register user for event
    event.participants.push({
      participantId: userId,
      type: req.user.artistId ? 'Artists' : 'Users', // If artist, it's an artisan, otherwise customer
    });
    await event.save();

    res.status(200).json({ message: 'Registered successfully for the event', event });
  } catch (error) {
    res.status(500).json({ message: 'Error registering for event', error });
  }
};

export const getEventsByArtist = async (req, res) => {
  const { artistId } = req.params;
  try {
    const events = await Event.find({ artistId });
    if (!events.length) {
      return res.status(404).json({ message: 'No events found for this artist' });
    }
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events for this artist', error });
  }
};

export const getUserRegistrations = async (req, res) => {
  const userId = req.user.id;
  try {
    const events = await Event.find({ 'participants.participantId': userId });
    if (!events.length) {
      return res.status(404).json({ message: 'No events found for this user' });
    }
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user registrations', error });
  }
};
