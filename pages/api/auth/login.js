// pages/api/auth/login.js
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { verifyPassword, generateJWT } from '../../../lib/auth';
import { validateEmail, sanitizeInput } from '../../../lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email, password, rememberMe } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase());

    // Find user
    const user = await User.findOne({ email: sanitizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ 
        message: 'Please verify your email before logging in',
        needsVerification: true,
        userId: user._id
      });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT with longer expiration if remember me is checked
    const expiresIn = rememberMe ? '30d' : process.env.JWT_EXPIRES_IN;
    const token = generateJWT({
      userId: user._id,
      email: user.email,
    }, expiresIn);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}