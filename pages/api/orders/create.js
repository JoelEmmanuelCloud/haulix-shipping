// pages/api/orders/create.js
import connectDB from '../../../lib/mongodb';
import Order from '../../../models/Order';
import User from '../../../models/User';
import { verifyJWT, generateTrackingNumber } from '../../../lib/auth';
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from '../../../lib/sendgrid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Get token from headers
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = verifyJWT(token);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const {
      senderInfo,
      recipientInfo,
      packageInfo,
      shippingService,
    } = req.body;

    // Validate required fields
    if (!senderInfo || !recipientInfo || !packageInfo || !shippingService) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Calculate shipping cost based on service and package weight
    const shippingCosts = {
      standard: 25,
      express: 45,
      priority: 85,
    };

    const baseRate = shippingCosts[shippingService] || 25;
    const weightMultiplier = Math.max(1, Math.ceil(packageInfo.weight / 1000)); // Per kg
    const shippingCost = baseRate * weightMultiplier;

    // Calculate estimated delivery
    const deliveryDays = {
      standard: 10,
      express: 5,
      priority: 3,
    };

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays[shippingService]);

    // Generate tracking number
    const trackingNumber = generateTrackingNumber();

    // Create order
    const order = new Order({
      userId: user._id,
      trackingNumber,
      senderInfo,
      recipientInfo,
      packageInfo,
      shippingInfo: {
        service: shippingService,
        estimatedDelivery,
        cost: shippingCost,
      },
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        location: 'Kiev, Ukraine',
        note: 'Order received and pending confirmation',
      }],
    });

    await order.save();

    // Send confirmation email to user
    await sendOrderConfirmationEmail(user.email, order);

    // Send notification email to admin
    await sendAdminNotificationEmail(order);

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order._id,
        trackingNumber: order.trackingNumber,
        status: order.status,
        cost: order.shippingInfo.cost,
        estimatedDelivery: order.shippingInfo.estimatedDelivery,
      },
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}