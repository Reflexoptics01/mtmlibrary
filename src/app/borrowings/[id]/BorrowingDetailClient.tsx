'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/layout/Layout';
import { useAuth } from '../../../context/AuthContext';
import { getBorrowingById, updateBorrowing, getBookById, updateBook, getStudentById, updateStudent } from '@/lib/firebase/db';

interface BorrowingDetail {
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

interface Props {
  params: {
    id: string;
  };
}

export default function BorrowingDetailClient({ params }: Props) {
  const [borrowing, setBorrowing] = useState<BorrowingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  useEffect(() => {
    // Redirect if user is not logged in
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/borrowings/${params.id}`));
      return;
    }
  }, [user, authLoading, router, params.id]);
  
  useEffect(() => {
    const fetchBorrowingDetail = async () => {
      if (!params.id || typeof params.id !== 'string') {
        setError('Invalid borrowing ID');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError('');
        const borrowingData = await getBorrowingById(params.id);
        
        if (borrowingData) {
          setBorrowing(borrowingData as BorrowingDetail);
        } else {
          setError('Borrowing record not found');
        }
      } catch (err) {
        console.error('Error fetching borrowing details:', err);
        setError('Failed to load borrowing details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading && user) {
      fetchBorrowingDetail();
    }
  }, [params.id, authLoading, user]);
  
  const handleReturnBook = async () => {
    if (!borrowing) return;
    
    if (window.confirm('Confirm book return?')) {
      try {
        setProcessing(true);
        
        // Update the borrowing status
        const updatedBorrowing: BorrowingDetail = {
          ...borrowing,
          returnDate: new Date().toISOString(),
          status: 'Returned'
        };
        
        await updateBorrowing(borrowing.id, updatedBorrowing);
        
        // Update book availability
        const book = await getBookById(borrowing.bookId);
        if (book) {
          await updateBook(borrowing.bookId, {
            ...book,
            availableCopies: book.availableCopies + 1
          });
        }
        
        // Update student's borrowed books count
        const student = await getStudentById(borrowing.studentId);
        if (student) {
          await updateStudent(borrowing.studentId, {
            ...student,
            borrowedBooks: Math.max(0, student.borrowedBooks - 1)
          });
        }
        
        // Update local state
        setBorrowing(updatedBorrowing);
        setProcessing(false);
      } catch (err) {
        console.error('Error returning book:', err);
        setError('Failed to process book return');
        setProcessing(false);
      }
    }
  };
  
  const handleMarkAsLost = async () => {
    if (!borrowing) return;
    
    if (window.confirm('Mark this book as lost? This will apply the lost book fine to the student account.')) {
      try {
        setProcessing(true);
        
        // Update the borrowing status
        const updatedBorrowing: BorrowingDetail = {
          ...borrowing,
          returnDate: new Date().toISOString(),
          status: 'Lost'
        };
        
        await updateBorrowing(borrowing.id, updatedBorrowing);
        
        // Get student to apply fine
        const student = await getStudentById(borrowing.studentId);
        if (student) {
          // Apply lost book fine (Full book price plus ₹100 processing fee - assuming ₹500 for now)
          const lostBookFine = 500 + 100;
          await updateStudent(borrowing.studentId, {
            ...student,
            finesDue: student.finesDue + lostBookFine,
            borrowedBooks: Math.max(0, student.borrowedBooks - 1)
          });
        }
        
        // Update local state
        setBorrowing(updatedBorrowing);
        setProcessing(false);
      } catch (err) {
        console.error('Error marking book as lost:', err);
        setError('Failed to mark book as lost');
        setProcessing(false);
      }
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (authLoading || loading) {
    return (
      <Layout>
        <div className="text-center py-8">
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">Borrowing Details</h1>
          <button 
            onClick={() => router.push('/borrowings')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Back to Borrowings
          </button>
        </div>
        
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : !borrowing ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            No borrowing record found with the provided ID.
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-green-700 mb-1">{borrowing.bookTitle}</h2>
                  <p className="text-gray-500">Borrowed by: {borrowing.studentName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  borrowing.status === 'Borrowed' ? 'bg-blue-100 text-blue-800' :
                  borrowing.status === 'Returned' ? 'bg-green-100 text-green-800' :
                  borrowing.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {borrowing.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Borrowing Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Borrow Date:</span>
                      <span className="font-medium">{formatDate(borrowing.borrowDate)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Due Date:</span>
                      <span className={`font-medium ${
                        borrowing.status === 'Overdue' ? 'text-red-600' : ''
                      }`}>{formatDate(borrowing.dueDate)}</span>
                    </div>
                    {borrowing.returnDate && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Return Date:</span>
                        <span className="font-medium">{formatDate(borrowing.returnDate)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {Math.ceil(
                          (new Date(borrowing.dueDate).getTime() - new Date(borrowing.borrowDate).getTime()) / 
                          (1000 * 60 * 60 * 24)
                        )} days
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Fine Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {borrowing.status === 'Overdue' && (
                      <div className="mb-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Days Overdue:</span>
                          <span className="font-medium text-red-600">
                            {Math.ceil(
                              (new Date().getTime() - new Date(borrowing.dueDate).getTime()) / 
                              (1000 * 60 * 60 * 24)
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estimated Fine:</span>
                          <span className="font-medium text-red-600">
                            ₹{Math.ceil(
                              (new Date().getTime() - new Date(borrowing.dueDate).getTime()) / 
                              (1000 * 60 * 60 * 24)
                            ) * 5} 
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 text-xs text-gray-500">
                      <p>Late Return Fine: ₹5 per day after due date</p>
                      <p>Lost Book Fine: Full book price plus ₹100 processing fee</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {(borrowing.status === 'Borrowed' || borrowing.status === 'Overdue') && (
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleReturnBook}
                    disabled={processing}
                    className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md ${
                      processing ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    Return Book
                  </button>
                  <button
                    onClick={handleMarkAsLost}
                    disabled={processing}
                    className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md ${
                      processing ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    Mark as Lost
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 