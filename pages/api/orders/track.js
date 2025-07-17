// pages/api/orders/track.js
import connectDB from '../../../lib/mongodb';
import Order from '../../../models/Order';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { tracking } = req.query;

    if (!tracking) {
      return res.status(400).json({ message: 'Tracking number is required' });
    }

    // Find order by tracking number
    const order = await Order.findOne({ trackingNumber: tracking })
      .populate('userId', 'firstName lastName email')
      .lean();

    if (!order) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Return order details
    res.status(200).json({
      trackingNumber: order.trackingNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      senderInfo: order.senderInfo,
      recipientInfo: order.recipientInfo,
      packageInfo: order.packageInfo,
      shippingInfo: order.shippingInfo,
      statusHistory: order.statusHistory,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}