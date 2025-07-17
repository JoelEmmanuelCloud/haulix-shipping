// components/Dashboard/UserDashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaPlus, FaEye, FaBox, FaShippingFast, FaCheckCircle, FaClock } from 'react-icons/fa';
import OrderCard from './OrderCard';
import Button from '../UI/Button';

export default function UserDashboard({ user, orders, onRefresh }) {
  const router = useRouter();
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === filter));
    }
  };

  const getStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => ['pending', 'confirmed'].includes(o.status)).length,
      inTransit: orders.filter(o => o.status === 'in_transit').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-blue-100 mb-4">
          Manage your shipments and track packages from your dashboard
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.push('/ship')}
            variant="white"
            className="flex items-center justify-center"
          >
            <FaPlus className="mr-2" />
            Create New Shipment
          </Button>
          <Button
            onClick={() => router.push('/track')}
            variant="outline-white"
            className="flex items-center justify-center"
          >
            <FaEye className="mr-2" />
            Track Package
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaBox className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaClock className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaShippingFast className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inTransit}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
              Your Orders
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                onClick={onRefresh}
                variant="outline"
                size="sm"
              >
                Refresh
              </Button>
              <Link href="/ship">
                <Button size="sm">
                  <FaPlus className="mr-2" />
                  New Order
                </Button>
              </Link>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All Orders' },
              { key: 'pending', label: 'Pending' },
              { key: 'in_transit', label: 'In Transit' },
              { key: 'delivered', label: 'Delivered' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <FaBox className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeFilter === 'all' ? 'No orders yet' : `No ${activeFilter} orders`}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeFilter === 'all'
                  ? 'Create your first shipment to get started'
                  : `You don't have any ${activeFilter} orders at the moment`}
              </p>
              {activeFilter === 'all' && (
                <Link href="/ship">
                  <Button>Create Your First Shipment</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}