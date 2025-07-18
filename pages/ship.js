import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function Ship() {
  const [formData, setFormData] = useState({
    senderInfo: {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Ukraine',
      },
    },
    recipientInfo: {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    },
    packageInfo: {
      weight: '',
      dimensions: {
        length: '',
        width: '',
        height: '',
      },
      description: '',
      value: '',
      category: '',
    },
    shippingService: 'standard',
  });
  const [loading, setLoading] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const router = useRouter();

  const shippingCosts = {
    standard: 25,
    express: 45,
    priority: 85,
  };

  useEffect(() => {
    // Calculate estimated cost when weight or service changes
    if (formData.packageInfo.weight && formData.shippingService) {
      const baseRate = shippingCosts[formData.shippingService];
      const weightMultiplier = Math.max(1, Math.ceil(formData.packageInfo.weight / 1000));
      setEstimatedCost(baseRate * weightMultiplier);
    }
  }, [formData.packageInfo.weight, formData.shippingService, shippingCosts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    setFormData(prev => {
      const updated = { ...prev };
      let current = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('Please login to create a shipment');
        router.push('/login');
        return;
      }

      const response = await axios.post('/api/orders/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Order created successfully!');
      router.push(`/track?tracking=${response.data.order.trackingNumber}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Shipment</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sender Information */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Sender Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="senderInfo.name"
                    required
                    value={formData.senderInfo.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="senderInfo.email"
                    required
                    value={formData.senderInfo.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    name="senderInfo.phone"
                    required
                    value={formData.senderInfo.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    name="senderInfo.address.street"
                    required
                    value={formData.senderInfo.address.street}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="senderInfo.address.city"
                    required
                    value={formData.senderInfo.address.city}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="senderInfo.address.state"
                    required
                    value={formData.senderInfo.address.state}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">ZIP Code *</label>
                  <input
                    type="text"
                    name="senderInfo.address.zipCode"
                    required
                    value={formData.senderInfo.address.zipCode}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Country *</label>
                  <input
                    type="text"
                    name="senderInfo.address.country"
                    required
                    value={formData.senderInfo.address.country}
                    onChange={handleChange}
                    className="form-input"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Recipient Information */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Recipient Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="recipientInfo.name"
                    required
                    value={formData.recipientInfo.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="recipientInfo.email"
                    required
                    value={formData.recipientInfo.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    name="recipientInfo.phone"
                    required
                    value={formData.recipientInfo.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Street Address *</label>
                  <input
                    type="text"
                    name="recipientInfo.address.street"
                    required
                    value={formData.recipientInfo.address.street}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="recipientInfo.address.city"
                    required
                    value={formData.recipientInfo.address.city}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="recipientInfo.address.state"
                    required
                    value={formData.recipientInfo.address.state}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">ZIP Code *</label>
                  <input
                    type="text"
                    name="recipientInfo.address.zipCode"
                    required
                    value={formData.recipientInfo.address.zipCode}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Country *</label>
                  <input
                    type="text"
                    name="recipientInfo.address.country"
                    required
                    value={formData.recipientInfo.address.country}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Package Information */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Package Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Weight (grams) *</label>
                  <input
                    type="number"
                    name="packageInfo.weight"
                    required
                    value={formData.packageInfo.weight}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                  />
                </div>
                <div>
                  <label className="form-label">Value (USD) *</label>
                  <input
                    type="number"
                    name="packageInfo.value"
                    required
                    value={formData.packageInfo.value}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="form-label">Length (cm) *</label>
                  <input
                    type="number"
                    name="packageInfo.dimensions.length"
                    required
                    value={formData.packageInfo.dimensions.length}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                  />
                </div>
                <div>
                  <label className="form-label">Width (cm) *</label>
                  <input
                    type="number"
                    name="packageInfo.dimensions.width"
                    required
                    value={formData.packageInfo.dimensions.width}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                  />
                </div>
                <div>
                  <label className="form-label">Height (cm) *</label>
                  <input
                    type="number"
                    name="packageInfo.dimensions.height"
                    required
                    value={formData.packageInfo.dimensions.height}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                  />
                </div>
                <div>
                  <label className="form-label">Category *</label>
                  <select
                    name="packageInfo.category"
                    required
                    value={formData.packageInfo.category}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="documents">Documents</option>
                    <option value="gifts">Gifts</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Description *</label>
                  <textarea
                    name="packageInfo.description"
                    required
                    value={formData.packageInfo.description}
                    onChange={handleChange}
                    className="form-input"
                    rows="3"
                    placeholder="Describe the contents of your package"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Service */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Shipping Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="shippingService"
                    value="standard"
                    checked={formData.shippingService === 'standard'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`${formData.shippingService === 'standard' ? 'ring-2 ring-blue-500' : ''} rounded-lg p-2`}>
                    <h3 className="font-semibold">Standard</h3>
                    <p className="text-sm text-gray-600">5-10 business days</p>
                    <p className="text-lg font-bold text-blue-600">$25+</p>
                  </div>
                </label>
                <label className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="shippingService"
                    value="express"
                    checked={formData.shippingService === 'express'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`${formData.shippingService === 'express' ? 'ring-2 ring-blue-500' : ''} rounded-lg p-2`}>
                    <h3 className="font-semibold">Express</h3>
                    <p className="text-sm text-gray-600">3-5 business days</p>
                    <p className="text-lg font-bold text-blue-600">$45+</p>
                  </div>
                </label>
                <label className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="shippingService"
                    value="priority"
                    checked={formData.shippingService === 'priority'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`${formData.shippingService === 'priority' ? 'ring-2 ring-blue-500' : ''} rounded-lg p-2`}>
                    <h3 className="font-semibold">Priority</h3>
                    <p className="text-sm text-gray-600">1-3 business days</p>
                    <p className="text-lg font-bold text-blue-600">$85+</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Cost Estimate */}
            {estimatedCost > 0 && (
              <div className="card bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Estimated Cost</h3>
                <p className="text-2xl font-bold text-blue-600">${estimatedCost}</p>
                <p className="text-sm text-blue-600">Final cost may vary based on exact weight and dimensions</p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating Order...' : 'Create Shipment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}