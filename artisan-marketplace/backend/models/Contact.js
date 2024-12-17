const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  customerId : {
    type: String,
    ref: 'Customers',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }});

ContactSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

export default mongoose.models.Contacts || mongoose.model('Contacts', ContactSchema);