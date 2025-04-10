'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Use a state variable for the year that's only set after component mounts
  const [year, setYear] = useState('');
  
  // Update the year only after hydration is complete (client-side only)
  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="bg-green-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-center md:text-left">
                &copy; {year} Madersatul Madina Faizane Gareeb Nawaz Gangavathi
              </p>
              <p className="text-center md:text-left text-sm">
                Dawate Islami India Branch
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/about" className="hover:text-green-300">About</Link>
              <Link href="/help" className="hover:text-green-300">Help</Link>
              <Link href="/contact" className="hover:text-green-300">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
