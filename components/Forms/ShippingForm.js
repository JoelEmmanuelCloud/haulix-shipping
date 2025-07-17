// components/Forms/ShippingForm.js
import { useState, useEffect } from 'react';
import { FaBox, FaMapMarkerAlt, FaWeightHanging, FaDollarSign } from 'react-icons/fa';
import Button from '../UI/Button';
import Input from '../UI/Input';

export default function ShippingForm({ onSubmit, loading = false }) {
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
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [errors, setErrors] = useState({});

  const shippingCosts = {
    standard: { base: 25, days: '5-10 business days' },
    express: { base: 45, days: '3-5 business days' },
    priority: { base: 85, days: '1-3 business days' },
  };

  useEffect(() => {
    // Calculate estimated cost when weight or service changes
    if (formData.packageInfo.weight && formData.shippingService) {
      const baseRate = shippingCosts[formData.shippingService].base;
      const weightMultiplier = Math.max(1, Math.ceil(formData.packageInfo.weight / 1000));
      setEstimatedCost(baseRate * weightMultiplier);
    }
  }, [formData.packageInfo.weight, formData.shippingService]);

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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    const requiredFields = [
      'senderInfo.name',
      'senderInfo.email',
      'senderInfo.phone',
      'senderInfo.address.street',
      'senderInfo.address.city',
      'senderInfo.address.state',
      'senderInfo.address.zipCode',
      'recipientInfo.name',
      'recipientInfo.email',
      'recipientInfo.phone',
      'recipientInfo.address.street',
      'recipientInfo.address.city',
      'recipientInfo.address.state',
      'recipientInfo.address.zipCode',
      'recipientInfo.address.country',
      'packageInfo.weight',
      'packageInfo.dimensions.length',
      'packageInfo.dimensions.width',
      'packageInfo.dimensions.height',
      'packageInfo.description',
      'packageInfo.value',
      'packageInfo.category',
    ];

    requiredFields.forEach(field => {
      const keys = field.split('.');
      let value = formData;
      for (const key of keys) {
        value = value?.[key];
      }
      if (!value || value.toString().trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.senderInfo.email && !emailRegex.test(formData.senderInfo.email)) {
      newErrors['senderInfo.email'] = 'Please enter a valid email';
    }
    if (formData.recipientInfo.email && !emailRegex.test(formData.recipientInfo.email)) {
      newErrors['recipientInfo.email'] = 'Please enter a valid email';
    }

    // Numeric validations
    if (formData.packageInfo.weight && formData.packageInfo.weight <= 0) {
      newErrors['packageInfo.weight'] = 'Weight must be greater than 0';
    }
    if (formData.packageInfo.value && formData.packageInfo.value <= 0) {
      newErrors['packageInfo.value'] = 'Value must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getFieldError = (fieldName) => errors[fieldName];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sender Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-4">
          <FaMapMarkerAlt className="text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Sender Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="senderInfo.name"
            label="Full Name *"
            value={formData.senderInfo.name}
            onChange={handleChange}
            error={getFieldError('senderInfo.name')}
            placeholder="Enter full name"
          />
          <Input
            name="senderInfo.email"
            type="email"
            label="Email Address *"
            value={formData.senderInfo.email}
            onChange={handleChange}
            error={getFieldError('senderInfo.email')}
            placeholder="Enter email address"
          />
          <Input
            name="senderInfo.phone"
            type="tel"
            label="Phone Number *"
            value={formData.senderInfo.phone}
            onChange={handleChange}
            error={getFieldError('senderInfo.phone')}
            placeholder="Enter phone number"
          />
          <Input
            name="senderInfo.address.street"
            label="Street Address *"
            value={formData.senderInfo.address.street}
            onChange={handleChange}
            error={getFieldError('senderInfo.address.street')}
            placeholder="Enter street address"
          />
          <Input
            name="senderInfo.address.city"
            label="City *"
            value={formData.senderInfo.address.city}
            onChange={handleChange}
            error={getFieldError('senderInfo.address.city')}
            placeholder="Enter city"
          />
          <Input
            name="senderInfo.address.state"
            label="State/Province *"
            value={formData.senderInfo.address.state}
            onChange={handleChange}
            error={getFieldError('senderInfo.address.state')}
            placeholder="Enter state or province"
          />
          <Input
            name="senderInfo.address.zipCode"
            label="ZIP/Postal Code *"
            value={formData.senderInfo.address.zipCode}
            onChange={handleChange}
            error={getFieldError('senderInfo.address.zipCode')}
            placeholder="Enter ZIP code"
          />
          <Input
            name="senderInfo.address.country"
            label="Country *"
            value={formData.senderInfo.address.country}
            onChange={handleChange}
            error={getFieldError('senderInfo.address.country')}
            placeholder="Ukraine"
            readOnly
          />
        </div>
      </div>

      {/* Recipient Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-4">
          <FaMapMarkerAlt className="text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Recipient Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="recipientInfo.name"
            label="Full Name *"
            value={formData.recipientInfo.name}
            onChange={handleChange}
            error={getFieldError('recipientInfo.name')}
            placeholder="Enter recipient's full name"
          />
          <Input
            name="recipientInfo.email"
            type="email"
            label="Email Address *"
            value={formData.recipientInfo.email}
            onChange={handleChange}
            error={getFieldError('recipientInfo.email')}
            placeholder="Enter recipient's email"
          />
          <Input
            name="recipientInfo.phone"
            type="tel"
            label="Phone Number *"
            value={formData.recipientInfo.phone}
            onChange={handleChange}
            error={getFieldError('recipientInfo.phone')}
            placeholder="Enter recipient's phone"
          />
          <Input
            name="recipientInfo.address.street"
            label="Street Address *"
            value={formData.recipientInfo.address.street}
            onChange={handleChange}
            error={getFieldError('recipientInfo.address.street')}
            placeholder="Enter street address"
          />
          <Input
            name="recipientInfo.address.city"
            label="City *"
            value={formData.recipientInfo.address.city}
            onChange={handleChange}
            error={getFieldError('recipientInfo.address.city')}
            placeholder="Enter city"
          />
          <Input
            name="recipientInfo.address.state"
            label="State/Province *"
            value={formData.recipientInfo.address.state}
            onChange={handleChange}
            error={getFieldError('recipientInfo.address.state')}
            placeholder="Enter state or province"
          />
          <Input
            name="recipientInfo.address.zipCode"
            label="ZIP/Postal Code *"
            value={formData.recipientInfo.address.zipCode}
            onChange={handleChange}
            error={getFieldError('recipientInfo.address.zipCode')}
            placeholder="Enter ZIP code"
          />
          <Input
            name="recipientInfo.address.country"
            label="Country *"
            value={formData.recipientInfo.address.country}
            onChange={handleChange}
            error={getFieldError('recipientInfo.address.country')}
            placeholder="Enter destination country"
          />
        </div>
      </div>

      {/* Package Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-4">
          <FaBox className="text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Package Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="packageInfo.weight"
            type="number"
            label="Weight (grams) *"
            value={formData.packageInfo.weight}
            onChange={handleChange}
            error={getFieldError('packageInfo.weight')}
            placeholder="Enter weight in grams"
            min="1"
            icon={<FaWeightHanging />}
          />
          <Input
            name="packageInfo.value"
            type="number"
            label="Declared Value (USD) *"
            value={formData.packageInfo.value}
            onChange={handleChange}
            error={getFieldError('packageInfo.value')}
            placeholder="Enter package value"
            min="1"
            step="0.01"
            icon={<FaDollarSign />}
          />
          <Input
            name="packageInfo.dimensions.length"
            type="number"
            label="Length (cm) *"
            value={formData.packageInfo.dimensions.length}
            onChange={handleChange}
            error={getFieldError('packageInfo.dimensions.length')}
            placeholder="Length in cm"
            min="1"
          />
          <Input
            name="packageInfo.dimensions.width"
            type="number"
            label="Width (cm) *"
            value={formData.packageInfo.dimensions.width}
            onChange={handleChange}
            error={getFieldError('packageInfo.dimensions.width')}
            placeholder="Width in cm"
            min="1"
          />
          <Input
            name="packageInfo.dimensions.height"
            type="number"
            label="Height (cm) *"
            value={formData.packageInfo.dimensions.height}
            onChange={handleChange}
            error={getFieldError('packageInfo.dimensions.height')}
            placeholder="Height in cm"
            min="1"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="packageInfo.category"
              value={formData.packageInfo.category}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                getFieldError('packageInfo.category') ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing & Accessories</option>
              <option value="books">Books & Media</option>
              <option value="documents">Documents</option>
              <option value="gifts">Gifts & Toys</option>
              <option value="health">Health & Beauty</option>
              <option value="other">Other</option>
            </select>
            {getFieldError('packageInfo.category') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('packageInfo.category')}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Description *
            </label>
            <textarea
              name="packageInfo.description"
              value={formData.packageInfo.description}
              onChange={handleChange}
              rows={3}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                getFieldError('packageInfo.description') ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe the contents of your package in detail..."
            />
            {getFieldError('packageInfo.description') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('packageInfo.description')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Service */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Shipping Service</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(shippingCosts).map(([service, details]) => (
            <label
              key={service}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                formData.shippingService === service
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="shippingService"
                value={service}
                checked={formData.shippingService === service}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="text-center">
                <h3 className="font-semibold text-lg capitalize mb-2">{service}</h3>
                <p className="text-sm text-gray-600 mb-2">{details.days}</p>
                <p className="text-2xl font-bold text-blue-600">${details.base}+</p>
                <p className="text-xs text-gray-500 mt-1">Base rate per kg</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Cost Estimate */}
      {estimatedCost > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Estimated Shipping Cost</h3>
              <p className="text-sm text-blue-600">
                Based on {formData.packageInfo.weight}g weight and {formData.shippingService} service
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">${estimatedCost}</p>
              <p className="text-sm text-blue-600">Final cost may vary</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          loading={loading}
          size="lg"
          className="px-12"
        >
          {loading ? 'Creating Shipment...' : 'Create Shipment'}
        </Button>
      </div>
    </form>
  );
}
