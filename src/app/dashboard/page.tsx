'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Mock user data for display purposes
  const mockUserData = {
    name: 'Admin User',
    role: 'librarian'
  };

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

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Dashboard</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Welcome, {mockUserData.name}
          </h2>
          <p className="text-gray-700 mb-4">
            You are logged in as a {mockUserData.role}.
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
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Quick Stats
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-200">
              <p className="text-gray-500 text-sm">Total Books</p>
              <h3 className="text-3xl font-bold text-blue-700 mt-2">247</h3>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  </svg>
                  12 new this month
                </span>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg shadow border border-purple-200">
              <p className="text-gray-500 text-sm">Registered Students</p>
              <h3 className="text-3xl font-bold text-purple-700 mt-2">153</h3>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  </svg>
                  5 new this month
                </span>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg shadow border border-amber-200">
              <p className="text-gray-500 text-sm">Current Borrowings</p>
              <h3 className="text-3xl font-bold text-amber-700 mt-2">42</h3>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-red-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd"></path>
                  </svg>
                  3 overdue
                </span>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <p className="text-gray-500 text-sm">Risala Distributed</p>
              <h3 className="text-3xl font-bold text-green-700 mt-2">89</h3>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  </svg>
                  14 this month
                </span>
              </div>
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
