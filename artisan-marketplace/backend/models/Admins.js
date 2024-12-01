// models/Admins.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from "uuid";

const AdminsSchema = new mongoose.Schema({
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
  username: {
    type: String,
    required: true,
    unique: true, // Ensure username is unique
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Admins || mongoose.model('Admins', AdminsSchema);
