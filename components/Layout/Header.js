// components/Layout/Header.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FaBars, FaTimes } from 'react-icons/fa';
import Cookies from 'js-cookie';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check auth status on mount and route changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = Cookies.get('token');
      setIsLoggedIn(!!token);
    };

    // Check initially
    checkAuthStatus();

    // Listen for route changes
    router.events.on('routeChangeComplete', checkAuthStatus);

    // Listen for custom auth events
    const handleAuthChange = (event) => {
      setIsLoggedIn(event.detail.authenticated);
    };

    window.addEventListener('authStateChange', handleAuthChange);

    // Cleanup
    return () => {
      router.events.off('routeChangeComplete', checkAuthStatus);
      window.removeEventListener('authStateChange', handleAuthChange);
    };
  }, [router.events]);

  // Also check on window focus (in case user logs in from another tab)
  useEffect(() => {
    const handleFocus = () => {
      const token = Cookies.get('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('authStateChange', { 
      detail: { authenticated: false } 
    }));
    
    router.push('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Updated with better alignment */}
          <Link href="/" className="flex items-center space-x-1 text-2xl font-bold text-blue-600">
            <Image
              src="/images/logo3.png"
              alt="Haulix Logo"
              width={150}
              height={150}
              className="object-contain"
            />
            {/* <span>Haulix</span> */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link href="/ship" className="text-gray-700 hover:text-blue-600">
              Ship
            </Link>
            <Link href="/track" className="text-gray-700 hover:text-blue-600">
              Track
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block py-2 text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link href="/ship" className="block py-2 text-gray-700 hover:text-blue-600">
              Ship
            </Link>
            <Link href="/track" className="block py-2 text-gray-700 hover:text-blue-600">
              Track
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block py-2 text-gray-700 hover:text-blue-600 w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link href="/register" className="block py-2 bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}