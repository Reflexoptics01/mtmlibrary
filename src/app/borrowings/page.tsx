'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { getAllBorrowings, getBorrowingById, updateBorrowing, getBookById, updateBook, getStudentById, updateStudent } from '@/lib/firebase/db';

interface Borrowing {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'Borrowed' | 'Returned' | 'Overdue' | 'Lost';
}

interface Book {
  id: string;
  title: string;
  author: string;
  availableCopies: number;
  totalCopies: number;
  // other book properties
}

interface Student {
  id: string;
  name: string;
  borrowedBooks: number;
  finesDue: number;
  // other student properties
}

export default function Borrowings() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [filteredBorrowings, setFilteredBorrowings] = useState<Borrowing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  useEffect(() => {
    // Redirect if user is not logged in
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/borrowings'));
      return;
    }
    
    const loadBorrowings = async () => {
      try {
        setLoading(true);
        
        // Get borrowings from Firestore
        const borrowingsData = await getAllBorrowings();
        
        // Check for overdue items and update their status
        const today = new Date();
        const updatedBorrowings = borrowingsData.map((borrowing) => {
          if (borrowing.status === 'Borrowed') {
            const dueDate = new Date(borrowing.dueDate);
            if (today > dueDate) {
              // Update status in Firestore
              updateBorrowing(borrowing.id, {
                ...borrowing,
                status: 'Overdue'
              });
              
              // Update local copy
              return {
                ...borrowing,
                status: 'Overdue'
              };
            }
          }
          return borrowing;
        });
        
        setBorrowings(updatedBorrowings);
        setFilteredBorrowings(updatedBorrowings);
        setLoading(false);
      } catch (error) {
        console.error('Error loading borrowings:', error);
        setError('Failed to load borrowings');
        setLoading(false);
      }
    };
    
    if (user) {
      loadBorrowings();
    }
  }, [authLoading, user, router]);
  
  // Handle search and filter
  useEffect(() => {
    const filtered = borrowings.filter(borrowing => {
      // Apply text search filter
      const matchesSearch = searchQuery === '' || 
                          borrowing.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          borrowing.studentName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply status filter
      const matchesStatus = statusFilter === 'all' || borrowing.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });
    
    setFilteredBorrowings(filtered);
  }, [searchQuery, statusFilter, borrowings]);
  
  const handleReturnBook = async (id: string) => {
    if (window.confirm('Are you sure you want to return this book?')) {
      try {
        setLoading(true);
        
        // Get borrowing details
        const borrowingToReturn = await getBorrowingById(id);
        
        if (!borrowingToReturn) {
          setError('Borrowing record not found');
          setLoading(false);
          return;
        }
        
        // Update borrowing record
        const updatedBorrowing: Borrowing = {
          ...borrowingToReturn as Borrowing,
          returnDate: new Date().toISOString(),
          status: 'Returned'
        };
        
        await updateBorrowing(id, updatedBorrowing);
        
        // Update book availability
        const book = await getBookById(borrowingToReturn.bookId);
        if (book) {
          await updateBook(borrowingToReturn.bookId, {
            ...book,
            availableCopies: book.availableCopies + 1
          });
        }
        
        // Update student's borrowed books count
        const student = await getStudentById(borrowingToReturn.studentId);
        if (student) {
          await updateStudent(borrowingToReturn.studentId, {
            ...student,
            borrowedBooks: Math.max(0, student.borrowedBooks - 1)
          });
        }
        
        // Update borrowings list
        const updatedBorrowings = borrowings.map(b => {
          if (b.id === id) {
            return updatedBorrowing;
          }
          return b;
        });
        
        setBorrowings(updatedBorrowings);
        setFilteredBorrowings(updatedBorrowings.filter(b => {
          // Apply current filters
          const matchesSearch = b.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               b.studentName.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
          return matchesSearch && matchesStatus;
        }));
        
        setLoading(false);
      } catch (error) {
        console.error('Error returning book:', error);
        setError('Failed to return book');
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Borrowed':
        return 'bg-blue-100 text-blue-800';
      case 'Returned':
        return 'bg-green-100 text-green-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Lost':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Borrowing Management</h1>
        
        {authLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : !user ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p>Please <Link href="/auth/login?redirect=/borrowings" className="underline">log in</Link> to access borrowing management.</p>
          </div>
        ) : (
          <>
        <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4 md:mb-0">
            <input
              type="text"
                  placeholder="Search by book or student..."
                  className="px-4 py-2 border rounded-md w-full sm:w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
            <select
              className="px-4 py-2 border rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
                  <option value="all">All Status</option>
              <option value="Borrowed">Borrowed</option>
              <option value="Returned">Returned</option>
              <option value="Overdue">Overdue</option>
              <option value="Lost">Lost</option>
            </select>
              </div>
              
              <button 
                onClick={() => router.push('/borrowings/add')}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
              >
                Add New Borrowing
            </button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading borrowings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {filteredBorrowings.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No borrowing records found matching your criteria.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrow Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBorrowings.map((borrowing) => (
                    <tr key={borrowing.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{borrowing.bookTitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{borrowing.studentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(borrowing.borrowDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(borrowing.dueDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(borrowing.status)}`}>
                          {borrowing.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                onClick={() => router.push(`/borrowings/${borrowing.id}`)}
                              >
                                View
                              </button>
                              {(borrowing.status === 'Borrowed' || borrowing.status === 'Overdue') && (
                                <button 
                                  className="text-green-600 hover:text-green-900"
                                  onClick={() => handleReturnBook(borrowing.id)}
                                >
                            Return
                          </button>
                              )}
                      </td>
                    </tr>
                        ))}
              </tbody>
            </table>
          </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
