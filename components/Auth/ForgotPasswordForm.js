import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import Button from '../UI/Button';
import Input from '../UI/Input';

export default function ForgotPasswordForm() {
  const [step, setStep] = useState('email'); // 'email', 'token', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('/api/auth/forgot-password', {
        email: formData.email,
      });
      toast.success('Reset link sent to your email!');
      setStep('token');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('/api/auth/verify-reset-token', {
        email: formData.email,
        token: formData.token,
      });
      toast.success('Token verified! Set your new password.');
      setStep('reset');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid token');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      await axios.post('/api/auth/reset-password', {
        email: formData.email,
        token: formData.token,
        newPassword: formData.newPassword,
      });
      toast.success('Password reset successfully!');
      // Redirect to login or auto-login
      window.location.href = '/login';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'email') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <FaEnvelope className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a reset link
          </p>
        </div>
        
        <form onSubmit={handleSendResetEmail} className="space-y-4">
          <Input
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            icon={<FaEnvelope />}
          />
          
          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Send Reset Link
          </Button>
        </form>
      </div>
    );
  }

  if (step === 'token') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <FaLock className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Check Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;ve sent a 6-digit code to {formData.email}
          </p>
        </div>
        
        <form onSubmit={handleVerifyToken} className="space-y-4">
          <Input
            name="token"
            type="text"
            label="Reset Code"
            value={formData.token}
            onChange={handleChange}
            required
            placeholder="Enter 6-digit code"
            maxLength="6"
          />
          
          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Verify Code
          </Button>
          
          <button
            type="button"
            onClick={() => setStep('email')}
            className="w-full text-sm text-blue-600 hover:text-blue-500"
          >
            Back to email entry
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FaLock className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>
      
      <form onSubmit={handleResetPassword} className="space-y-4">
        <Input
          name="newPassword"
          type="password"
          label="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required
          placeholder="Enter new password"
          minLength="6"
        />
        
        <Input
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Confirm new password"
          minLength="6"
        />
        
        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}