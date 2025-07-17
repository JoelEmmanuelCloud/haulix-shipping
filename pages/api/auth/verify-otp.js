// pages/api/auth/verify-otp.js
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { generateJWT } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: 'User ID and OTP are required' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    // Check OTP
    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP expired
    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Verify user
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    // Generate JWT
    const token = generateJWT({
      userId: user._id,
      email: user.email,
    });

    res.status(200).json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}