import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
  },
  senderInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  recipientInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  packageInfo: {
    weight: { type: Number, required: true },
    dimensions: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    description: { type: String, required: true },
    value: { type: Number, required: true },
    category: { type: String, required: true },
    images: [String], // Cloudinary URLs
  },
  shippingInfo: {
    service: { type: String, required: true }, // Standard, Express, Priority
    estimatedDelivery: { type: Date, required: true },
    cost: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'paid', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    location: String,
    note: String,
  }],
  adminNotes: String,
}, {
  timestamps: true,
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);