'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';

export default function Dashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user is not logged in
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <p className="text-gray-600">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!user || !userData) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Dashboard</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Welcome, {userData.name}
          </h2>
          <p className="text-gray-700 mb-4">
            You are logged in as a {userData.role}.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Books</h3>
              <p className="text-gray-600">Manage library books</p>
              <button 
                onClick={() => router.push('/books')}
                className="mt-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm"
              >
                View Books
              </button>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Students</h3>
              <p className="text-gray-600">Manage student records</p>
              <button 
                onClick={() => router.push('/students')}
                className="mt-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm"
              >
                View Students
              </button>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Borrowings</h3>
              <p className="text-gray-600">Manage book borrowings</p>
              <button 
                onClick={() => router.push('/borrowings')}
                className="mt-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm"
              >
                View Borrowings
              </button>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Farameen-e-Attar</h3>
              <p className="text-gray-600">Manage monthly publications</p>
              <button 
                onClick={() => router.push('/risala')}
                className="mt-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm"
              >
                View Publications
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => router.push('/books/add')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md"
            >
              Add New Book
            </button>
            
            <button 
              onClick={() => router.push('/students/register')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md"
            >
              Register New Student
            </button>
            
            <button 
              onClick={() => router.push('/risala/upload')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-md"
            >
              Upload New Risala
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
