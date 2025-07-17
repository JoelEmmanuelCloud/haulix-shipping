// pages/dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { FaPlus, FaEye, FaBox, FaShippingFast, FaCheckCircle } from 'react-icons/fa';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get('/api/orders/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data.orders);
      setUser(response.data.user);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">Manage your shipments and track packages</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/ship" className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center">
              <FaPlus className="text-2xl text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Create New Shipment</h3>
                <p className="text-sm text-gray-600">Ship a package worldwide</p>
              </div>
            </div>
          </Link>
          
          <Link href="/track" className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center">
              <FaEye className="text-2xl text-green-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Track Package</h3>
                <p className="text-sm text-gray-600">Track any package status</p>
              </div>
            </div>
          </Link>

          <div className="card">
            <div className="flex items-center">
              <FaBox className="text-2xl text-purple-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Total Orders</h3>
                <p className="text-2xl font-bold text-purple-600">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
            <Link href="/ship" className="btn-primary">
              <FaPlus className="inline mr-2" />
              New Shipment
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8">
              <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">Create your first shipment to get started</p>
              <Link href="/ship" className="btn-primary">
                Create Shipment
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Tracking Number</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Recipient</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Cost</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="ml-2 font-medium">{order.trackingNumber}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{order.recipientInfo.name}</p>
                          <p className="text-sm text-gray-600">{order.recipientInfo.address.city}, {order.recipientInfo.address.country}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="capitalize">{order.shippingInfo.service}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium">${order.shippingInfo.cost}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Link 
                          href={`/track?tracking=${order.trackingNumber}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}