// components/Dashboard/OrderCard.js
import { useState } from 'react';
import Link from 'next/link';
import { FaBox, FaShippingFast, FaCheckCircle, FaClock, FaEdit, FaEye, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import Button from '../UI/Button';

export default function OrderCard({ order, isAdmin = false, onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return <FaClock className="text-yellow-500" />;
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
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getStatusIcon(order.status)}
          <div>
            <h3 className="font-semibold text-gray-900">
              {order.trackingNumber}
            </h3>
            <p className="text-sm text-gray-600">
              {isAdmin && order.userId ? 
                `${order.userId.firstName} ${order.userId.lastName}` :
                order.recipientInfo.name
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ').toUpperCase()}
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
        <div className="flex items-center text-gray-600">
          <FaMapMarkerAlt className="mr-1" />
          <span>{order.recipientInfo.address.city}, {order.recipientInfo.address.country}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FaCalendarAlt className="mr-1" />
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <div className="text-gray-600">
          Service: <span className="capitalize font-medium">{order.shippingInfo.service}</span>
        </div>
        <div className="text-gray-600">
          Cost: <span className="font-medium">${order.shippingInfo.cost}</span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Sender Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Sender</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{order.senderInfo.name}</p>
                <p>{order.senderInfo.email}</p>
                <p>{order.senderInfo.phone}</p>
                <p>{order.senderInfo.address.street}, {order.senderInfo.address.city}</p>
                <p>{order.senderInfo.address.state}, {order.senderInfo.address.country}</p>
              </div>
            </div>

            {/* Recipient Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Recipient</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{order.recipientInfo.name}</p>
                <p>{order.recipientInfo.email}</p>
                <p>{order.recipientInfo.phone}</p>
                <p>{order.recipientInfo.address.street}, {order.recipientInfo.address.city}</p>
                <p>{order.recipientInfo.address.state}, {order.recipientInfo.address.country}</p>
              </div>
            </div>
          </div>

          {/* Package Info */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Package Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
              <div>Weight: {order.packageInfo.weight}g</div>
              <div>Value: ${order.packageInfo.value}</div>
              <div>Category: {order.packageInfo.category}</div>
              <div>
                Dimensions: {order.packageInfo.dimensions.length}×{order.packageInfo.dimensions.width}×{order.packageInfo.dimensions.height}cm
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Description:</strong> {order.packageInfo.description}
            </p>
          </div>

          {/* Payment Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Payment: 
                <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus.toUpperCase()}
                </span>
              </span>
              <span className="text-sm text-gray-600">
                Estimated Delivery: {new Date(order.shippingInfo.estimatedDelivery).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
        <div className="flex space-x-2">
          <Link href={`/track?tracking=${order.trackingNumber}`}>
            <Button variant="outline" size="sm">
              <FaEye className="mr-1" />
              Track
            </Button>
          </Link>
          {isAdmin && onUpdate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onUpdate}
            >
              <FaEdit className="mr-1" />
              Update
            </Button>
          )}
        </div>
        {order.paymentStatus === 'pending' && (
          <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
            Payment pending - Admin will contact you
          </div>
        )}
      </div>
    </div>
  );
}
