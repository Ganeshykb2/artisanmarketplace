import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    unique: true,
    required: true,
    default: () => uuidv4(),
  },
  orderId: {
    type: String,
    ref: 'Orders',
    required: true,
  },
  customerId: {
    type: String,
    ref: 'Customers',
    required: true,
  },
  artisanId: {
    type: String,
    ref: 'Artists',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'UPI'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  transactionId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});
export default mongoose.models.Payments || mongoose.model('Payments', PaymentSchema);
