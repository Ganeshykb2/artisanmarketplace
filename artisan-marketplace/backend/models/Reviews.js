import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customers',
    required: true 
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Products',
    required: true 
  },
  artistId:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Artists',
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.models.Reviews || mongoose.model('Reviews', ReviewSchema);
