import mongoose from 'mongoose';
import { v4 as uuidv4 } from "uuid";

const ArtistsSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    required: true,
    unique: true,
  },
  name: 
  { type: String, 
    required: true
  },
  email: 
  { type: String,
    required: true, 
    unique: true 
  },
  password: 
  { 
    type: String,
    required: true
  },
  businessName: 
  { 
    type: String 
  },
  specialization: [{type: String}],
  
  DOB: {
    type:Date,
    required:true
  },
  AboutHimself:{
    type : String,
    required:true
  },
  contact:{
    value:{
    type:String,
    required:true,
    unique:true
    },
    verify: {
      type:Boolean,
      default:false
    }
  },
  address: {
      type: String,
      required: true,
    },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  aadhar:{
    type: String,
    required:true
  },
  profileImage: {
    type: String,
    default: '',
  },
  profileViews: {
    type: Number,
    default: 0, // Start with 0 views
  },
  verified:{
    type:Boolean,
    default:false
  },
  createdAt: { 
    type: Date,
    default: Date.now 
  },

});

export default mongoose.models.Artists || mongoose.model('Artists', ArtistsSchema );