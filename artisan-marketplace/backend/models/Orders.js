import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const OrderItemSchema = new mongoose.Schema({
  productId: { 
    type: String, 
    ref: 'Products', 
    required: true,
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
  quantity: { 
    type: Number, 
    required: true,
  },
});

const OrdersSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true,
    default: uuidv4,
  },
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artisans',
    required: true,
  },
  customerId: {
    type: String,
    ref: 'Customers',
    required: true,
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentId: {
    type: String,
    ref: 'Payments',
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deliveredAt: {
    type: Date,
  },
});

// Add a pre-save to update the updatedAt field
OrdersSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Orders || mongoose.model('Orders', OrdersSchema);
