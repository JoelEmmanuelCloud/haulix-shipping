// pages/api/admin/update-order.js
import connectDB from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Admin from '../../../models/Admin';
import { verifyJWT } from '../../../lib/auth';
import { sendStatusUpdateEmail } from '../../../lib/sendgrid';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Get token from headers
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify admin token
    const decoded = verifyJWT(token);
    const admin = await Admin.findById(decoded.userId);
    if (!admin) {
      return res.status(401).json({ message: 'Admin access required' });
    }

    const { orderId, status, paymentStatus, location, note } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ message: 'Order ID and status are required' });
    }

    // Find order
    const order = await Order.findById(orderId).populate('userId', 'firstName lastName email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    order.status = status;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    // Add to status history
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      location: location || 'Kiev, Ukraine',
      note: note || `Order status updated to ${status}`,
    });

    await order.save();

    // Send status update email to user
    if (order.userId && order.userId.email) {
      await sendStatusUpdateEmail(order.userId.email, order, status);
    }

    res.status(200).json({
      message: 'Order updated successfully',
      order: {
        id: order._id,
        trackingNumber: order.trackingNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}