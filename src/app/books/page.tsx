'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  addedDate: any;
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
    
    // This will be connected to Firebase in the next step
    // For now, use mock data and check localStorage for deleted books
    const mockBooks: Book[] = [
      {
        id: '1',
        title: 'Faizane Sunnat',
        author: 'Ameer e Ahle Sunnat',
        category: 'Islamic',
        totalCopies: 5,
        availableCopies: 3,
        addedDate: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Namaz ke Ahkam',
        author: 'Maulana Ilyas Qadri',
        category: 'Islamic',
        totalCopies: 10,
        availableCopies: 8,
        addedDate: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Faizan-e-Quran',
        author: 'Dawat-e-Islami',
        category: 'Islamic',
        totalCopies: 7,
        availableCopies: 4,
        addedDate: new Date().toISOString(),
      },
    ];
    
    // Check localStorage for deleted book IDs
    const deletedBookIds = localStorage.getItem('deletedBookIds');
    let activeBooks = mockBooks;
    
    if (deletedBookIds) {
      const deletedIds = JSON.parse(deletedBookIds) as string[];
      activeBooks = mockBooks.filter(book => !deletedIds.includes(book.id));
    }
    
    setBooks(activeBooks);
    setLoading(false);
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
  
  const handleDeleteBook = (id: string) => {
    // In a real app, this would call Firebase to delete the book
    if (window.confirm('Are you sure you want to delete this book?')) {
      console.log('Deleting book with ID:', id);
      
      // Update local state
      setBooks(books.filter(book => book.id !== id));
      
      // Store deleted IDs in localStorage to persist across refreshes
      const deletedBookIds = localStorage.getItem('deletedBookIds');
      let deletedIds: string[] = [];
      
      if (deletedBookIds) {
        deletedIds = JSON.parse(deletedBookIds);
      }
      
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
      }
      
      localStorage.setItem('deletedBookIds', JSON.stringify(deletedIds));
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Book Management</h1>
        
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
      </div>
    </Layout>
  );
}
