// utils/constants.js
export const SHIPPING_SERVICES = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  PRIORITY: 'priority',
};

export const SHIPPING_COSTS = {
  [SHIPPING_SERVICES.STANDARD]: 25,
  [SHIPPING_SERVICES.EXPRESS]: 45,
  [SHIPPING_SERVICES.PRIORITY]: 85,
};

export const DELIVERY_ESTIMATES = {
  [SHIPPING_SERVICES.STANDARD]: { min: 7, max: 10 },
  [SHIPPING_SERVICES.EXPRESS]: { min: 3, max: 5 },
  [SHIPPING_SERVICES.PRIORITY]: { min: 1, max: 3 },
};

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PAID: 'paid',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
};

export const PACKAGE_CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing & Accessories' },
  { value: 'books', label: 'Books & Media' },
  { value: 'documents', label: 'Documents' },
  { value: 'gifts', label: 'Gifts & Toys' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'health', label: 'Health & Beauty' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'other', label: 'Other' },
];

export const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
];

export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/,
  zipCode: {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
  },
  trackingNumber: /^HLX\d{10}$/,
};

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  FOLDER: 'haulix/packages',
};

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const ERROR_MESSAGES = {
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
    PASSWORDS_DONT_MATCH: 'Passwords do not match',
    INVALID_ZIP_CODE: 'Please enter a valid ZIP/postal code',
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again',
    UNAUTHORIZED: 'You are not authorized to perform this action',
  },
  UPLOAD: {
    FILE_TOO_LARGE: 'File is too large. Maximum size is 10MB',
    TOO_MANY_FILES: 'Too many files. Maximum is 5 files',
    INVALID_FILE_TYPE: 'Invalid file type. Only images are allowed',
  },
  ORDER: {
    NOT_FOUND: 'Order not found',
    INVALID_STATUS: 'Invalid order status',
    INSUFFICIENT_PERMISSIONS: 'You do not have permission to modify this order',
  },
  GENERAL: {
    SERVER_ERROR: 'Something went wrong. Please try again later',
    NETWORK_ERROR: 'Network error. Please check your connection',
  },
};

export const SUCCESS_MESSAGES = {
  AUTH: {
    REGISTRATION_SUCCESS: 'Account created successfully! Please check your email for verification',
    LOGIN_SUCCESS: 'Welcome back!',
    LOGOUT_SUCCESS: 'You have been logged out successfully',
    EMAIL_VERIFIED: 'Email verified successfully!',
    PASSWORD_RESET_SENT: 'Password reset link sent to your email',
    PASSWORD_RESET_SUCCESS: 'Password reset successfully',
  },
  ORDER: {
    CREATED: 'Order created successfully!',
    UPDATED: 'Order updated successfully',
    STATUS_UPDATED: 'Order status updated successfully',
  },
  UPLOAD: {
    SUCCESS: 'Files uploaded successfully',
  },
};

export const EMAIL_SUBJECTS = {
  OTP_VERIFICATION: 'Verify Your Haulix Account',
  ORDER_CONFIRMATION: 'Order Confirmation',
  ORDER_STATUS_UPDATE: 'Order Status Update',
  ADMIN_NOTIFICATION: 'New Order Received',
  PASSWORD_RESET: 'Reset Your Haulix Password',
};

export const TRACKING_LOCATIONS = [
  'Kiev, Ukraine - Origin Facility',
  'Kiev, Ukraine - Customs Processing',
  'Warsaw, Poland - Transit Hub',
  'Frankfurt, Germany - International Hub',
  'Processing Center',
  'Local Delivery Facility',
  'Out for Delivery',
  'Delivered',
];

export const ADMIN_ROLES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

export const NOTIFICATION_TYPES = {
  ORDER_CREATED: 'order_created',
  STATUS_UPDATED: 'status_updated',
  PAYMENT_RECEIVED: 'payment_received',
  DELIVERY_COMPLETED: 'delivery_completed',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    VERIFY_OTP: '/api/auth/verify-otp',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  ORDERS: {
    CREATE: '/api/orders/create',
    TRACK: '/api/orders/track',
    USER_ORDERS: '/api/orders/user',
    UPDATE_STATUS: '/api/orders/update-status',
  },
  ADMIN: {
    ORDERS: '/api/admin/orders',
    UPDATE_ORDER: '/api/admin/update-order',
  },
  UPLOAD: '/api/upload',
};

export const THEME_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  accent: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
};

export default {
  SHIPPING_SERVICES,
  SHIPPING_COSTS,
  DELIVERY_ESTIMATES,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PACKAGE_CATEGORIES,
  COUNTRIES,
  VALIDATION_RULES,
  FILE_UPLOAD,
  PAGINATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  EMAIL_SUBJECTS,
  TRACKING_LOCATIONS,
  ADMIN_ROLES,
  NOTIFICATION_TYPES,
  API_ENDPOINTS,
  THEME_COLORS,
};