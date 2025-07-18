import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { FaBox, FaShippingFast, FaCheckCircle, FaEdit, FaEye } from 'react-icons/fa';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    paymentStatus: '',
    location: '',
    note: '',
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get('/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data.orders);
      
      // Calculate stats
      const total = response.data.orders.length;
      const pending = response.data.orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
      const inTransit = response.data.orders.filter(o => o.status === 'in_transit').length;
      const delivered = response.data.orders.filter(o => o.status === 'delivered').length;
      
      setStats({ total, pending, inTransit, delivered });
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (orderId) => {
    try {
      const token = Cookies.get('token');
      await axios.put('/api/admin/update-order', {
        orderId,
        ...updateData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success('Order updated successfully');
      setShowUpdateModal(false);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const openUpdateModal = (order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.status,
      paymentStatus: order.paymentStatus,
      location: '',
      note: '',
    });
    setShowUpdateModal(true);
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
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage orders and track shipments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <FaBox className="text-3xl text-blue-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <FaBox className="text-3xl text-yellow-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <FaShippingFast className="text-3xl text-purple-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-purple-600">{stats.inTransit}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <FaCheckCircle className="text-3xl text-green-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">All Orders</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Tracking #</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Recipient</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Payment</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Cost</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-medium">{order.trackingNumber}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{order.userId?.firstName} {order.userId?.lastName}</p>
                        <p className="text-sm text-gray-600">{order.userId?.email}</p>
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus.toUpperCase()}
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
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openUpdateModal(order)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <FaEdit />
                        </button>
                        <a
                          href={`/track?tracking=${order.trackingNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          <FaEye />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Update Order Modal */}
        {showUpdateModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Update Order: {selectedOrder.trackingNumber}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">Status</label>
                  <select
                    value={updateData.status}
                    onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                    className="form-input"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="paid">Paid</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Payment Status</label>
                  <select
                    value={updateData.paymentStatus}
                    onChange={(e) => setUpdateData({...updateData, paymentStatus: e.target.value})}
                    className="form-input"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={updateData.location}
                    onChange={(e) => setUpdateData({...updateData, location: e.target.value})}
                    className="form-input"
                    placeholder="Current location"
                  />
                </div>

                <div>
                  <label className="form-label">Note</label>
                  <textarea
                    value={updateData.note}
                    onChange={(e) => setUpdateData({...updateData, note: e.target.value})}
                    className="form-input"
                    rows="3"
                    placeholder="Update note..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateOrder(selectedOrder._id)}
                  className="btn-primary"
                >
                  Update Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}