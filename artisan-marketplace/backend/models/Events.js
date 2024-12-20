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
    ref : "Artists",
    required: true,
  },
  participants: {
    type: [{
      customerId: { 
        type: String,  
        refPath: 'Customers' // Dynamic reference to either 'Artists' or 'Users'
      },
      artistId: { 
        type: String,  
        refPath: 'Artists' // Dynamic reference to either 'Artists' or 'Users'
      },
      name: {
        type: String,
        required: true,
      },
      type: { 
        type: String, 
        enum: ["Artist", "Customer"], 
        required: true 
      },
    }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Events || mongoose.model('Events', EventsSchema);
