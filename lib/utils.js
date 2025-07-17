// lib/utils.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
}

export function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatTrackingNumber(trackingNumber) {
  if (!trackingNumber) return '';
  // Format as XXX-XXXXXX-XXXX for better readability
  return trackingNumber.replace(/(.{3})(.{6})(.{4})/, '$1-$2-$3');
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone) {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

export function generateRandomId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

export function getInitials(firstName, lastName) {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
}

export function calculateShippingCost(weight, service, baseRates) {
  const rates = baseRates || {
    standard: 25,
    express: 45,
    priority: 85,
  };
  
  const baseRate = rates[service] || rates.standard;
  const weightInKg = weight / 1000;
  const weightMultiplier = Math.max(1, Math.ceil(weightInKg));
  
  return baseRate * weightMultiplier;
}

export function getDeliveryEstimate(service) {
  const estimates = {
    standard: { min: 7, max: 10 },
    express: { min: 3, max: 5 },
    priority: { min: 1, max: 3 },
  };
  
  const estimate = estimates[service] || estimates.standard;
  const days = Math.floor(Math.random() * (estimate.max - estimate.min + 1)) + estimate.min;
  
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);
  
  return deliveryDate;
}

export function isValidZipCode(zipCode, country = 'US') {
  const patterns = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
  };
  
  const pattern = patterns[country.toUpperCase()];
  return pattern ? pattern.test(zipCode) : true; // Default to valid for unknown countries
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}