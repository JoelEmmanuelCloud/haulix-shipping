// pages/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FaShippingFast, FaSearch, FaGlobeAmericas } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleTrackPackage = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      router.push(`/track?tracking=${trackingNumber}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="International shipping background"
            fill
            style={{ objectFit: 'cover' }}
            priority
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
        
        {/* Lighter Gradient Overlay - Reduced opacity to show background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-blue-800/40 z-10"></div>
        
        {/* Lighter Dark Overlay - Reduced opacity for better image visibility */}
        <div className="absolute inset-0 bg-black/20 z-20"></div>
        
        {/* Content */}
        <div className="relative z-30 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl text-shadow-lg">
            Ship Your Package Worldwide with
            <span className="block text-yellow-400 drop-shadow-2xl text-shadow-lg">Haulix</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-xl text-shadow-md">
            Fast, Reliable, and Secure International Shipping.
          </p>
          
          {/* Quick Track */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-md mx-auto shadow-2xl">
            <h3 className="text-gray-800 font-semibold mb-4">Track Your Package</h3>
            <form onSubmit={handleTrackPackage} className="space-y-4">
              <input
                type="text"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105"
              >
                Track Package
              </button>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/ship')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Ship Now
            </button>
            <button
              onClick={() => router.push('/register')}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg backdrop-blur-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Why Choose Haulix?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FaShippingFast className="text-5xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Fast Delivery</h3>
              <p className="text-gray-600">
                Express shipping options to deliver your packages quickly and safely
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FaSearch className="text-5xl text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Real-time Tracking</h3>
              <p className="text-gray-600">
                Track your package every step of the way with our advanced tracking system
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FaGlobeAmericas className="text-5xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Global Reach</h3>
              <p className="text-gray-600">
                Ship to any country worldwide with our extensive network
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all hover:border-blue-300">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Standard Shipping</h3>
              <p className="text-gray-600 mb-4">
                Affordable shipping for non-urgent packages. Delivery in 5-10 business days.
              </p>
              <div className="text-2xl font-bold text-blue-600">$25+</div>
            </div>
            <div className="p-6 border border-blue-200 rounded-lg hover:shadow-lg transition-all bg-blue-50 hover:bg-blue-100 border-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-blue-600">Express Shipping</h3>
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Popular</span>
              </div>
              <p className="text-gray-600 mb-4">
                Faster delivery for important packages. Delivery in 3-5 business days.
              </p>
              <div className="text-2xl font-bold text-blue-600">$45+</div>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all hover:border-blue-300">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Priority Shipping</h3>
              <p className="text-gray-600 mb-4">
                Fastest delivery for urgent packages. Delivery in 1-3 business days.
              </p>
              <div className="text-2xl font-bold text-blue-600">$85+</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}