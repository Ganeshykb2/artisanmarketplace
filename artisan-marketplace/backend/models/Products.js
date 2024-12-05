import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true,
    required: true,
    default: uuidv4,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'out of stock', 'discontinued'],
    default: 'available',
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reviews',
  }],
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  salesCount: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  artistId: { 
    // type: mongoose.Schema.Types.ObjectId, 
    // ref: 'Artists',
    type : String,
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Events',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a pre-save hook to update the updatedAt field
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Products || mongoose.model('Products', ProductSchema);
