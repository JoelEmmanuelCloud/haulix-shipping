// pages/api/admin/orders.js
import connectDB from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Admin from '../../../models/Admin';
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

    // Verify admin token (you'll need to implement admin authentication)
    // For now, we'll use a simple check
    const decoded = verifyJWT(token);
    const admin = await Admin.findById(decoded.userId);
    if (!admin) {
      return res.status(401).json({ message: 'Admin access required' });
    }

    const { page = 1, limit = 10, status } = req.query;

    // Build query
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Get orders with pagination
    const orders = await Order.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      orders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      totalOrders,
    });
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}