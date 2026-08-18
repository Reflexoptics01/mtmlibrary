'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import StaffGate from '@/components/StaffGate';
import { useAuth } from '@/context/AuthContext';
import { getDashboardStats } from '@/lib/db';

export default function Dashboard() {
  const { profile, isStaff } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBooks: 0,
    registeredStudents: 0,
    currentBorrowings: 0,
    overdueItems: 0,
    publications: 0,
  });

  useEffect(() => {
    if (!isStaff) return;
    void getDashboardStats()
      .then(setStats)
      .catch((err) => console.error(err));
  }, [isStaff]);

  return (
    <StaffGate>
      <Layout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">Dashboard</h1>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              Welcome, {profile?.fullName || 'staff'}
            </h2>
            <p className="text-gray-700 mb-4">You are logged in as {profile?.role}.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {[
                { title: 'Books', href: '/books', label: 'View Books' },
                { title: 'Students', href: '/students', label: 'View Students' },
                { title: 'Borrowings', href: '/borrowings', label: 'View Borrowings' },
                { title: 'Publications', href: '/risala', label: 'View Publications' },
              ].map((card) => (
                <div key={card.href} className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">{card.title}</h3>
                  <button
                    onClick={() => router.push(card.href)}
                    className="mt-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm"
                  >
                    {card.label}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Quick Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
                <p className="text-gray-500 text-sm">Total Books</p>
                <h3 className="text-3xl font-bold text-green-700 mt-2">{stats.totalBooks}</h3>
              </div>
              <div className="bg-green-100 p-4 rounded-lg shadow border border-green-300">
                <p className="text-gray-500 text-sm">Registered Students</p>
                <h3 className="text-3xl font-bold text-green-800 mt-2">{stats.registeredStudents}</h3>
              </div>
              <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
                <p className="text-gray-500 text-sm">Current Borrowings</p>
                <h3 className="text-3xl font-bold text-green-700 mt-2">{stats.currentBorrowings}</h3>
                <span className="text-red-500 text-sm">{stats.overdueItems} overdue</span>
              </div>
              <div className="bg-green-100 p-4 rounded-lg shadow border border-green-300">
                <p className="text-gray-500 text-sm">Publications</p>
                <h3 className="text-3xl font-bold text-green-800 mt-2">{stats.publications}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={() => router.push('/books/add')} className="bg-green-700 hover:bg-green-800 text-white px-4 py-3 rounded-md">
                Add New Book
              </button>
              <button onClick={() => router.push('/students/register')} className="bg-green-700 hover:bg-green-800 text-white px-4 py-3 rounded-md">
                Register New Student
              </button>
              <button onClick={() => router.push('/risala/upload')} className="bg-green-700 hover:bg-green-800 text-white px-4 py-3 rounded-md">
                Upload Publication
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </StaffGate>
  );
}
