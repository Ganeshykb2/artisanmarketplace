import Event from '../models/Events.js';
export const createEvent = async (req, res) => {
  try {
    const { name, eventType, dateOfEvent, location,images, description } = req.body;
    // const artistId = req.user.id; // Get artistId from the authenticated user
    // Get the artistId from the authenticated user (assuming it's attached to the request)
    const artistId = req.user.id;

    // Check if the authenticated user is an artisan (artist)
    if (!artistId) {
      return res.status(403).json({ message: 'Only artisans can create events.' });
    }

    const newEvent = new Event({
      name,
      eventType,
      dateOfEvent,
      location,
      description,
      images,
      artistId: artistId, // Attach the artist's ID to the event
    });


    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
};


export const getEvents = async  (req, res) => {
  try{
  
    // Get the artistId from the authenticated user (assuming it's attached to the request)
    const artistId = req.user.id;
    if (!artistId) {
      return res.status(403).json({ message: 'artisans not found' });
    }

    const events = await Event.find({ artistId: artistId });
    if (!events) {
      return res.status(404).json({ message: 'Events 3 not found' });
    }
    res.status(200).json({ message: 'Events fetched successfully', events });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error });
}
};
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findOne({ eventId });
    if (!event) {
      return res.status(404).json({ message: 'Events not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event details', error });
  }
};

export const registerForEvent = async (req, res) => {
  const { eventId } = req.params;  // Get event ID from request params
  console.log(eventId);
  const user = req.user;      // Get user ID from the decoded token

  try {
    const event = await Event.findOne({eventId: eventId}); // Assuming MongoDB _id is used
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    // Register the user for the event
    if(req.user?.artistId){
      const alreadyRegistered = event.participants?.find(participant => 
        participant.artistId?.toString() === req.user?.artistId?.toString()
      );
      if (alreadyRegistered) {
        return res.status(400).json({ message: 'User already registered for this event' });
      }
      event.participants.push({
        artistId: req.user?.artistId,
        name: req.user?.name,
        type: 'Artist',
      });
    }else{
      const alreadyRegistered = event.participants?.find(participant => 
        participant.customerId?.toString() === req.user?.customerId?.toString()
      );
      if (alreadyRegistered) {
        return res.status(400).json({ message: 'User already registered for this event' });
      }
      event.participants.push({
        artistId: req.user?.customerId,
        name: req.user?.name,
        type: 'Customer',
      });
    }
    await event.save(); // Save the event with the new participant

    return res.status(200).json({ message: 'Registered successfully for the event', event });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Error registering for event', error });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const currentDate = new Date();

    // Fetch events sorted by closest future dates
    const upcomingEvents = await Event.find({ dateOfEvent: { $gte: currentDate } })
      .sort({ dateOfEvent: 1 }) // Sort by ascending date
      .limit(4) // Limit to 4 events
      .select('dateOfEvent location description name eventId images evenType'); // Select only necessary fields

    if (!upcomingEvents) {
      console.log(upcomingEvents);
      return res.status(404).json({ message: 'No upcoming events found' });
    }

    res.status(200).json({ message: 'Upcoming events fetched successfully', events: upcomingEvents });
  } catch (error) {
    console.log(error);
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
