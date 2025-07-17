// pages/api/auth/forgot-password.js
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { generateOTP } from '../../../lib/auth';
import { sendEmail } from '../../../lib/sendgrid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token (using OTP for simplicity)
    const resetToken = generateOTP();
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // Send reset email
    const subject = 'Password Reset Request - Haulix';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Password Reset Request</h2>
        <p>Hi ${user.firstName},</p>
        <p>You requested to reset your password. Please use the following code to reset your password:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #3b82f6; font-size: 32px; margin: 0;">${resetToken}</h1>
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Haulix Team</p>
      </div>
    `;

    await sendEmail(email, subject, html);

    res.status(200).json({
      message: 'Password reset code sent to your email',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}