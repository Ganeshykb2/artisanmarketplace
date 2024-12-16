import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const CartSchema = new mongoose.Schema({
    cartId: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true,
    },
    customerId: {
      type: String,
      ref: 'Customers', // Refers to the Customers collection
    },
    artistId: {
      type: String,
      ref: 'Artists', // Refers to the Artists collection
    },
    products: [{
      productId: {
        type: String,
        ref: 'Products', // Refers to the Product collection
        required: true
      },
      productName: {
        type: String,
        required: true
      },
      productPrice: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        default: 1, // Default quantity is 1 if not specified
        required: true
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });
  
  // Add a pre-save hook to update the 'updatedAt' field automatically
  CartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

export default mongoose.models.Carts || mongoose.model('Carts', CartSchema);