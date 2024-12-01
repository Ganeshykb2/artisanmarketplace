import mongoose from 'mongoose';
import { v4 as uuidv4 } from "uuid";

const OrdersSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true,
    default: uuidv4
  },
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artists',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  description: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  price: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
export default mongoose.models.Orders || mongoose.model('Orders', OrdersSchema);