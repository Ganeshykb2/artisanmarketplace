import mongoose from 'mongoose';
import { v4 as uuidv4 } from "uuid";

const AddressSchema = new mongoose.Schema({
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
  country: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  }
});

const CustomersSchema = new mongoose.Schema({
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
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
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
  secondaryAddresses: {
    type: [AddressSchema], // Array 
    default: [],          // empty array
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  purchaseHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orders',  // Reference to Orders collection
    default: ''
  }],
  profileImage: {
    type: String,
    default: '',  // Optional field for profile picture
  }
});
export default mongoose.models.Customers || mongoose.model('Customers', CustomersSchema);
