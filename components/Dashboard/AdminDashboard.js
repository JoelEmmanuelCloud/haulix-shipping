// components/Dashboard/AdminDashboard.js
import { useState, useEffect } from 'react';
import { FaBox, FaShippingFast, FaCheckCircle, FaClock, FaFilter, FaSearch } from 'react-icons/fa';
import OrderCard from './OrderCard';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';

export default function AdminDashboard({ orders, onUpdateOrder, onRefresh }) {
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    paymentStatus: '',
    location: '',
    note: '',
  });

  useEffect(() => {
    let filtered = orders;
    
    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => order.status === activeFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.senderInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.recipientInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.senderInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(filtered);
  }, [orders, activeFilter, searchTerm]);

  const getStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => ['pending', 'confirmed'].includes(o.status)).length,
      inTransit: orders.filter(o => o.status === 'in_transit').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    };
  };

  const stats = getStats();

  const handleUpdateOrder = async () => {
    try {
      await onUpdateOrder(selectedOrder._id, updateData);
      setShowUpdateModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to update order:', error);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Admin Dashboard 🚀
        </h1>
        <p className="text-blue-100 mb-4">
          Manage all orders and track shipments across the platform
        </p>
        <Button
          onClick={onRefresh}
          variant="white"
          className="flex items-center"
        >
          <FaSearch className="mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaBox className="text-blue-600 text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaClock className="text-yellow-600 text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaShippingFast className="text-purple-600 text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-3xl font-bold text-purple-600">{stats.inTransit}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Management */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Order Management
          </h2>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by tracking number, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<FaSearch />}
              />
            </div>
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'pending', label: 'Pending' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'in_transit', label: 'In Transit' },
                { key: 'delivered', label: 'Delivered' },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeFilter === filter.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <FaFilter className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  isAdmin={true}
                  onUpdate={() => openUpdateModal(order)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Update Order Modal */}
      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title={`Update Order: ${selectedOrder?.trackingNumber}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Status
            </label>
            <select
              value={updateData.status}
              onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              value={updateData.paymentStatus}
              onChange={(e) => setUpdateData({...updateData, paymentStatus: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <Input
            label="Current Location"
            type="text"
            value={updateData.location}
            onChange={(e) => setUpdateData({...updateData, location: e.target.value})}
            placeholder="e.g., Kiev Sorting Facility"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Update Note
            </label>
            <textarea
              value={updateData.note}
              onChange={(e) => setUpdateData({...updateData, note: e.target.value})}
              placeholder="Add a note about this update..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowUpdateModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateOrder}
            >
              Update Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}