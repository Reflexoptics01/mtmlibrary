'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
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
    return `px-3 py-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
      isActive(path) 
        ? 'bg-green-700 text-white' 
        : 'hover:bg-green-700'
    }`;
  };

  // Get the classes for the mobile navigation link based on active state
  const getMobileLinkClasses = (path: string) => {
    return `block px-3 py-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
      isActive(path) 
        ? 'bg-green-700 text-white' 
        : 'hover:bg-green-700'
    }`;
  };

  return (
    <nav aria-label="Primary navigation" className="bg-green-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-white p-1.5 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8 text-green-800"
                  aria-hidden="true"
                >
                  <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                </svg>
              </div>
              <span className="font-bold text-lg ml-2">Maktaba</span>
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
              Publications
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className={getLinkClasses('/dashboard')}>
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link href="/staff" className={getLinkClasses('/staff')}>
                    Staff
                  </Link>
                )}
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
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              className="inline-flex items-center justify-center rounded-md p-2 text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
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
        <div id="mobile-navigation" className="border-t border-white/10 md:hidden">
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
              Publications
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className={getMobileLinkClasses('/dashboard')}>
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link href="/staff" className={getMobileLinkClasses('/staff')}>
                    Staff
                  </Link>
                )}
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
            <Link href="/help" className={getMobileLinkClasses('/help')}>
              Help
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
