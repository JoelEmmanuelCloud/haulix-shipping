// pages/api/orders/update-status.js
import connectDB from '../../../lib/mongodb';
import Order from '../../../models/Order';
import User from '../../../models/User';
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

    // Verify token (this should be admin token in production)
    const decoded = verifyJWT(token);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { trackingNumber, status, paymentStatus, location, note, notifyCustomer = true } = req.body;

    if (!trackingNumber || !status) {
      return res.status(400).json({ message: 'Tracking number and status are required' });
    }

    // Validate status values
    const validStatuses = ['pending', 'confirmed', 'paid', 'in_transit', 'delivered', 'cancelled'];
    const validPaymentStatuses = ['pending', 'paid', 'failed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status value' });
    }

    // Find order
    const order = await Order.findOne({ trackingNumber }).populate('userId', 'firstName lastName email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Store previous status for comparison
    const previousStatus = order.status;
    const previousPaymentStatus = order.paymentStatus;

    // Update order status
    order.status = status;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    // Add to status history
    const statusUpdate = {
      status,
      timestamp: new Date(),
      location: location || 'Processing Center',
      note: note || `Order status updated to ${status.replace('_', ' ')}`,
    };

    order.statusHistory.push(statusUpdate);

    // Set delivery date if delivered
    if (status === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

    // Send notification email to customer if requested and status changed
    if (notifyCustomer && order.userId && order.userId.email && 
        (status !== previousStatus || paymentStatus !== previousPaymentStatus)) {
      try {
        await sendStatusUpdateEmail(order.userId.email, order, status);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order: {
        id: order._id,
        trackingNumber: order.trackingNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        statusHistory: order.statusHistory,
      },
    });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}