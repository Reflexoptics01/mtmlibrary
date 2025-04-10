'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { getAllBooks, deleteBook } from '@/lib/firebase/db';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  addedDate: string;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // Mock categories for now - will be dynamically loaded later
  const categories = ['Islamic', 'History', 'Biography', 'Literature', 'Science', 'Reference'];

  useEffect(() => {
    // Check authentication first
    if (!authLoading && !user) {
      // If user is trying to add or edit, redirect to login
      if (window.location.pathname.includes('/add') || window.location.pathname.includes('/edit')) {
        router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
        return;
      }
    }
    
    // Load books from Firestore
    const loadBooks = async () => {
      try {
        setLoading(true);
        const booksData = await getAllBooks();
        setBooks(booksData as Book[]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading books:', error);
        setError('Failed to load books. Please try again.');
    setLoading(false);
      }
    };

    loadBooks();
  }, [authLoading, user, router]);

  const filteredBooks = books.filter((book: Book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleAddBook = () => {
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/books/add'));
    } else {
      router.push('/books/add');
    }
  };
  
  const handleEditBook = (id: string) => {
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/books/edit/${id}`));
    } else {
      // Navigate to the edit page with the book ID
      router.push(`/books/edit/${id}`);
    }
  };
  
  const handleDeleteBook = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        setLoading(true);
        await deleteBook(id);
        
        // Update local state
        const updatedBooks = books.filter((book) => book.id !== id);
        setBooks(updatedBooks);
        setLoading(false);
      } catch (error) {
        console.error('Error deleting book:', error);
        setError('Failed to delete book. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleViewBook = (id: string) => {
    router.push(`/books/${id}`);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Book Management</h1>
        
        {user ? (
          <>
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search books by title or author..."
              className="px-4 py-2 border rounded-md w-full md:w-80"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              className="px-4 py-2 border rounded-md"
              value={filterCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
                <button 
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
                  onClick={handleAddBook}
                >
              Add New Book
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading books...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Copies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No books found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book: Book) => (
                    <tr key={book.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{book.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {book.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.totalCopies}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          book.availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {book.availableCopies}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              className="text-blue-600 hover:text-blue-900 mr-3"
                              onClick={() => handleViewBook(book.id)}
                            >
                          View
                        </button>
                            <button 
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                              onClick={() => handleEditBook(book.id)}
                            >
                          Edit
                        </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteBook(book.id)}
                            >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
              </div>
            )}
          </>
        ) : (
          <div className="mt-8">
            <div className="bg-green-50 p-6 rounded-lg shadow border border-green-200 mb-6">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">
                Welcome to Madersatul Madina Library
              </h2>
              <p className="text-gray-700 mb-4">
                Please <Link href="/auth/login" className="text-green-600 hover:underline">log in</Link> to access the full library management system.
              </p>
              <div className="mt-4">
                <Link href="/risala" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md">
                  View Farameen-e-Attar Publications
                </Link>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Featured Books</h3>
              <p className="text-gray-600 mb-6">
                Explore some of our featured Islamic literature. Please log in to view the complete catalog.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-semibold text-green-700">Faizane Sunnat</h4>
                  <p className="text-sm text-gray-600">By: Ameer e Ahle Sunnat</p>
                </div>
                <div className="border rounded-md p-4">
                  <h4 className="font-semibold text-green-700">Namaz ke Ahkam</h4>
                  <p className="text-sm text-gray-600">By: Maulana Ilyas Qadri</p>
                </div>
                <div className="border rounded-md p-4">
                  <h4 className="font-semibold text-green-700">Faizan e Quran</h4>
                  <p className="text-sm text-gray-600">By: Dawat e Islami</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
