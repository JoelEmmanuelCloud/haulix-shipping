// pages/api/auth/verify-reset-token.js
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ message: 'Email and token are required' });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    res.status(200).json({
      message: 'Token verified successfully',
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}