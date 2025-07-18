import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaBox, FaShippingFast, FaCheckCircle } from 'react-icons/fa';

export default function Track() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTrack = useCallback(async (tracking = trackingNumber) => {
    if (!tracking.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/orders/track?tracking=${tracking}`);
      setOrderData(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Package not found');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  }, [trackingNumber]);

  useEffect(() => {
    const { tracking } = router.query;
    if (tracking) {
      setTrackingNumber(tracking);
      handleTrack(tracking);
    }
  }, [router.query, handleTrack]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return <FaBox className="text-yellow-500" />;
      case 'in_transit':
        return <FaShippingFast className="text-blue-500" />;
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Package</h1>
          <p className="text-gray-600">Enter your tracking number to see the latest updates</p>
        </div>

        {/* Search Form */}
        <div className="card mb-8">
          <form onSubmit={(e) => { e.preventDefault(); handleTrack(); }} className="flex gap-4">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number (e.g., HLX123456789)"
              className="flex-1 form-input"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </form>
        </div>

        {/* Order Details */}
        {orderData && (
          <div className="space-y-6">
            {/* Status Overview */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Package Status</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData.status)}`}>
                  {orderData.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-semibold">{orderData.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="font-semibold capitalize">{orderData.shippingInfo.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-semibold">
                    {new Date(orderData.shippingInfo.estimatedDelivery).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
              <div className="space-y-4">
                {orderData.statusHistory.map((event, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium capitalize">
                          {event.status.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">{event.location}</p>
                      {event.note && (
                        <p className="text-sm text-gray-700 mt-1">{event.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Sender</h3>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {orderData.senderInfo.name}</p>
                  <p><strong>Email:</strong> {orderData.senderInfo.email}</p>
                  <p><strong>Phone:</strong> {orderData.senderInfo.phone}</p>
                  <p><strong>Address:</strong> {orderData.senderInfo.address.street}, {orderData.senderInfo.address.city}, {orderData.senderInfo.address.country}</p>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Recipient</h3>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {orderData.recipientInfo.name}</p>
                  <p><strong>Email:</strong> {orderData.recipientInfo.email}</p>
                  <p><strong>Phone:</strong> {orderData.recipientInfo.phone}</p>
                  <p><strong>Address:</strong> {orderData.recipientInfo.address.street}, {orderData.recipientInfo.address.city}, {orderData.recipientInfo.address.country}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Package Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Description:</strong> {orderData.packageInfo.description}</p>
                  <p><strong>Weight:</strong> {orderData.packageInfo.weight}g</p>
                  <p><strong>Dimensions:</strong> {orderData.packageInfo.dimensions.length} x {orderData.packageInfo.dimensions.width} x {orderData.packageInfo.dimensions.height} cm</p>
                </div>
                <div>
                  <p><strong>Category:</strong> {orderData.packageInfo.category}</p>
                  <p><strong>Value:</strong> ${orderData.packageInfo.value}</p>
                  <p><strong>Shipping Cost:</strong> ${orderData.shippingInfo.cost}</p>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData.paymentStatus)}`}>
                  {orderData.paymentStatus.toUpperCase()}
                </span>
              </div>
              {orderData.paymentStatus === 'pending' && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-800">
                    <strong>Payment Pending:</strong> Our admin will contact you shortly regarding payment details.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}