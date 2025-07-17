// pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [userId, setUserId] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', formData);
      setUserId(response.data.userId);
      setShowOTP(true);
      toast.success('Registration successful! Please check your email for OTP.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/verify-otp', {
        userId,
        otp,
      });
      
      // Store token
      document.cookie = `token=${response.data.token}; path=/`;
      toast.success('Email verified successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (showOTP) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verify Your Email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent a verification code to your email
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleOTPVerification}>
            <div>
              <label htmlFor="otp" className="form-label">
                Enter OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                className="form-input"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Address Information</h3>
            <div>
              <label htmlFor="address.street" className="form-label">
                Street Address
              </label>
              <input
                id="address.street"
                name="address.street"
                type="text"
                value={formData.address.street}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="address.city" className="form-label">
                  City
                </label>
                <input
                  id="address.city"
                  name="address.city"
                  type="text"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="address.state" className="form-label">
                  State
                </label>
                <input
                  id="address.state"
                  name="address.state"
                  type="text"
                  value={formData.address.state}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="address.zipCode" className="form-label">
                  ZIP Code
                </label>
                <input
                  id="address.zipCode"
                  name="address.zipCode"
                  type="text"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="address.country" className="form-label">
                  Country
                </label>
                <input
                  id="address.country"
                  name="address.country"
                  type="text"
                  value={formData.address.country}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
