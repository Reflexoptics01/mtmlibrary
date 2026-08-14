'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import { getDashboardStats, getPublicStats, getSettings } from '@/lib/db';

export default function Home() {
  const { isStaff } = useAuth();
  const [libraryName, setLibraryName] = useState('Maktaba');
  const [stats, setStats] = useState({
    totalBooks: 0,
    registeredStudents: 0,
    currentBorrowings: 0,
    publications: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const settings = await getSettings();
        setLibraryName(settings.libraryName);
        if (isStaff) {
          const full = await getDashboardStats();
          setStats({
            totalBooks: full.totalBooks,
            registeredStudents: full.registeredStudents,
            currentBorrowings: full.currentBorrowings,
            publications: full.publications,
          });
        } else {
          const pub = await getPublicStats();
          setStats((prev) => ({ ...prev, publications: pub.publications }));
        }
      } catch {
        // Config missing or anonymous reads limited
      }
    };
    void load();
  }, [isStaff]);

  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Welcome to Maktaba</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">مكتبة</h2>
          <p className="text-gray-700 mb-4">
            {libraryName} — open-source library management for Muslim institutes, schools, and madrasas
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Library Management</h3>
              <p className="text-gray-600">Manage books, track borrowings, and handle returns</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Student Records</h3>
              <p className="text-gray-600">Register students and manage their information</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Fine Calculation</h3>
              <p className="text-gray-600">Automatically calculate and track fines for late returns</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Publications</h3>
              <p className="text-gray-600">Share monthly magazines, risala, booklets, and audio lessons</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Total Books</h3>
              <p className="text-3xl font-bold text-blue-600">{isStaff ? stats.totalBooks : '—'}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg shadow border border-purple-200">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">Registered Students</h3>
              <p className="text-3xl font-bold text-purple-600">{isStaff ? stats.registeredStudents : '—'}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg shadow border border-amber-200">
              <h3 className="text-xl font-semibold text-amber-800 mb-2">
                {isStaff ? 'Active Borrowings' : 'Publications'}
              </h3>
              <p className="text-3xl font-bold text-amber-600">
                {isStaff ? stats.currentBorrowings : stats.publications}
              </p>
            </div>
          </div>
          {!isStaff && (
            <p className="text-sm text-gray-500 mt-4">
              <Link href="/auth/login" className="text-green-700 hover:underline">Log in</Link> as staff to see catalog counts.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
