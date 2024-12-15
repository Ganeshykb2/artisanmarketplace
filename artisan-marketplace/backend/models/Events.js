import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Schema for events
const EventsSchema = new mongoose.Schema({
  eventId: {
    type: String,
    default: uuidv4,
    required: true,
    unique: true, 
  },
  name: {
    type: String,
    required: true, 
  },
  eventType: {
    type: String,
    enum: ["conference", "workshop", "meetup", "seminar", "government"],
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  dateOfEvent: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  artistId: { 
    type: String,
    required: true,
  },
  participants: {
    type: [
      {
        participantId: { 
          type: mongoose.Schema.Types.ObjectId, 
          required: true, 
          refPath: 'participants.type' // Dynamic reference to either 'Artists' or 'Users'
        },
        type: { 
          type: String, 
          enum: ["Artists", "Users"], 
          required: true 
        },
      }
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Events || mongoose.model('Events', EventsSchema);
