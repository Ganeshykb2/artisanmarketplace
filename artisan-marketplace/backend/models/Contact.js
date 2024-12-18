import mongoose from 'mongoose';
import { v4 as uuidv4 } from "uuid";

const ContactSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);