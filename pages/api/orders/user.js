// pages/api/orders/user.js
import connectDB from '../../../lib/mongodb';
import Order from '../../../models/Order';
import User from '../../../models/User';
import { verifyJWT } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

    // Get user's orders
    const orders = await Order.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      orders,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('User orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}