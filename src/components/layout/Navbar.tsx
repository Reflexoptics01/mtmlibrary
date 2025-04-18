'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect handled by auth context's useEffect
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Function to check if a path is active (exact match or starts with the path)
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Get the classes for the navigation link based on active state
  const getLinkClasses = (path: string) => {
    return `px-3 py-2 rounded-md ${
      isActive(path) 
        ? 'bg-green-700 text-white' 
        : 'hover:bg-green-700'
    }`;
  };

  // Get the classes for the mobile navigation link based on active state
  const getMobileLinkClasses = (path: string) => {
    return `block px-3 py-2 rounded-md ${
      isActive(path) 
        ? 'bg-green-700 text-white' 
        : 'hover:bg-green-700'
    }`;
  };

  return (
    <nav className="bg-green-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-white p-1 rounded-full flex items-center justify-center">
              <Image
                src="/assets/dawateislami_logo.png"
                alt="Dawate Islami Logo"
                width={40}
                height={40}
                  className="rounded-full"
              />
              </div>
              <span className="font-bold text-lg ml-2">Madersatul Madina Library</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/books" className={getLinkClasses('/books')}>
              Books
            </Link>
            <Link href="/students" className={getLinkClasses('/students')}>
              Students
            </Link>
            <Link href="/borrowings" className={getLinkClasses('/borrowings')}>
              Borrowings
            </Link>
            <Link href="/risala" className={getLinkClasses('/risala')}>
              Farameen-e-Attar
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className={getLinkClasses('/dashboard')}>
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-500 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth/login" className={isActive('/auth/login') ? "px-3 py-2 rounded-md bg-green-500 transition-colors" : "px-3 py-2 rounded-md bg-green-600 hover:bg-green-500 transition-colors"}>
              Login
            </Link>
            )}
            <div className="flex space-x-4">
              <Link href="/help" className="hover:text-green-300">Help</Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/books" className={getMobileLinkClasses('/books')}>
              Books
            </Link>
            <Link href="/students" className={getMobileLinkClasses('/students')}>
              Students
            </Link>
            <Link href="/borrowings" className={getMobileLinkClasses('/borrowings')}>
              Borrowings
            </Link>
            <Link href="/risala" className={getMobileLinkClasses('/risala')}>
              Farameen-e-Attar
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className={getMobileLinkClasses('/dashboard')}>
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md bg-red-600 hover:bg-red-500 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth/login" className={isActive('/auth/login') ? "block px-3 py-2 rounded-md bg-green-500 transition-colors" : "block px-3 py-2 rounded-md bg-green-600 hover:bg-green-500 transition-colors"}>
              Login
            </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
