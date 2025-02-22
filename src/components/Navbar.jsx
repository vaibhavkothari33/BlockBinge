import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import WalletConnect from './WalletConnect';

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  // Don't show navbar on landing page
  if (location.pathname === '/') return null;

  // Optional: Show loading state
  if (isLoading) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-dark/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </nav>
    );
  }

  // Add this to your existing navigation items
  const navigationItems = [
    { name: 'Browse', path: '/browse' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv-shows' },
    { name: 'My List', path: '/my-list' },
    { name: 'Marketplace', path: '/marketplace' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Link
                  to="/browse"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/movies"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Movies
                </Link>
                <Link
                  to="/my-list"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  My-List
                </Link>
                <Link
                  to="/marketplace"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  NFTs
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/search" className="text-gray-300 hover:text-white">
              <FaSearch className="h-5 w-5" />
            </Link>
            {isAuthenticated && <WalletConnect />}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  {user?.photoURL ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = ''; // Fallback to icon if image fails
                          e.target.onerror = null;
                          e.target.className = 'hidden';
                          e.target.nextSibling.className = 'block';
                        }}
                      />
                      <FaUserCircle className="hidden absolute inset-0 w-full h-full text-gray-400" />
                    </div>
                  ) : (
                    <FaUserCircle className="h-8 w-8 text-gray-400" />
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-dark-lighter rounded-md shadow-lg py-1 hidden group-hover:block">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-light"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-light"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-primary px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 