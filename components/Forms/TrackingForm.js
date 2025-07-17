// components/Forms/TrackingForm.js
import { useState } from 'react';
import { FaSearch, FaBarcode } from 'react-icons/fa';
import Button from '../UI/Button';
import Input from '../UI/Input';

export default function TrackingForm({ onTrack, loading = false, initialValue = '' }) {
  const [trackingNumber, setTrackingNumber] = useState(initialValue);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }
    
    // Basic validation for tracking number format
    if (trackingNumber.length < 8) {
      setError('Tracking number should be at least 8 characters');
      return;
    }
    
    setError('');
    onTrack(trackingNumber.trim());
  };

  const handleChange = (e) => {
    setTrackingNumber(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <FaBarcode className="text-blue-600 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Package</h2>
        <p className="text-gray-600">
          Enter your tracking number to see real-time updates
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={trackingNumber}
          onChange={handleChange}
          placeholder="e.g., HLX123456789"
          error={error}
          icon={<FaBarcode />}
          className="text-center text-lg"
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          size="lg"
        >
          <FaSearch className="mr-2" />
          {loading ? 'Tracking...' : 'Track Package'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Don't have a tracking number?{' '}
            <a href="/ship" className="text-blue-600 hover:text-blue-500 font-medium">
              Create a shipment
            </a>
          </p>
        </div>
      </form>

      {/* Example tracking numbers for demo */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Example Format:</h4>
        <p className="text-sm text-gray-600 font-mono">HLX + 12 digits</p>
        <p className="text-xs text-gray-500 mt-1">
          e.g., HLX202401234567
        </p>
      </div>
    </div>
  );
}