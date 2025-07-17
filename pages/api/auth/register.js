// pages/api/auth/register.js
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { hashPassword, generateOTP } from '../../../lib/auth';
import { sendOTPEmail } from '../../../lib/sendgrid';
import { validateEmail, validatePhone, sanitizeInput } from '../../../lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email, password, firstName, lastName, phone, address } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone format
    if (!validatePhone(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Sanitize inputs
    const sanitizedData = {
      email: sanitizeInput(email.toLowerCase()),
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      phone: sanitizeInput(phone),
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: sanitizedData.email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: 'User already exists and is verified' });
      } else {
        // User exists but not verified, update and resend OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        existingUser.otp = {
          code: otp,
          expiresAt: otpExpires,
        };
        existingUser.firstName = sanitizedData.firstName;
        existingUser.lastName = sanitizedData.lastName;
        existingUser.phone = sanitizedData.phone;
        existingUser.address = address;

        await existingUser.save();
        await sendOTPEmail(sanitizedData.email, otp, sanitizedData.firstName);

        return res.status(200).json({
          message: 'OTP resent to your email. Please verify to complete registration.',
          userId: existingUser._id,
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      email: sanitizedData.email,
      password: hashedPassword,
      firstName: sanitizedData.firstName,
      lastName: sanitizedData.lastName,
      phone: sanitizedData.phone,
      address: address || {},
      otp: {
        code: otp,
        expiresAt: otpExpires,
      },
    });

    await user.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(sanitizedData.email, otp, sanitizedData.firstName);
    
    if (!emailResult.success) {
      // If email fails, delete the user and return error
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
    }

    res.status(201).json({
      message: 'User registered successfully. Please check your email for OTP verification.',
      userId: user._id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
}