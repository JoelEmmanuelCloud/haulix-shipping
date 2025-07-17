// components/Layout/Footer.js
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Haulix</h3>
            <p className="text-gray-300 mb-4">
              Your trusted partner for international shipping from Ukraine to anywhere in the world.
            </p>
            <div className="flex space-x-4">
              <FaFacebook className="text-xl hover:text-blue-500 cursor-pointer" />
              <FaTwitter className="text-xl hover:text-blue-400 cursor-pointer" />
              <FaInstagram className="text-xl hover:text-pink-500 cursor-pointer" />
              <FaLinkedin className="text-xl hover:text-blue-600 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link href="/ship" className="text-gray-300 hover:text-white">Ship Package</Link></li>
              <li><Link href="/track" className="text-gray-300 hover:text-white">Track Package</Link></li>
              <li><Link href="/register" className="text-gray-300 hover:text-white">Register</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Standard Shipping</li>
              <li className="text-gray-300">Express Shipping</li>
              <li className="text-gray-300">Priority Shipping</li>
              <li className="text-gray-300">Package Tracking</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <p>Email: info@haulix.delivery</p>
              <p>Phone: +380 XX XXX XXXX</p>
              <p>Address: Kiev, Ukraine</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Haulix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}