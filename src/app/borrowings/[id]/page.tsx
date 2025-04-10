'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/layout/Layout';
import { useAuth } from '../../../context/AuthContext';

interface Borrowing {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCategory: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  studentContact: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'Borrowed' | 'Returned' | 'Overdue' | 'Lost';
  fineAmount: number;
  finePaid: boolean;
  remarks: string;
}

export default function BorrowingDetail({ params }: { params: { id: string } }) {
  const [borrowing, setBorrowing] = useState<Borrowing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { id } = params;
  
  useEffect(() => {
    // If not logged in, redirect to login page
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/borrowings/${id}`));
      return;
    }
    
    // This would normally fetch data from Firebase
    // For now, use mock data
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    // Different mock data based on ID
    setTimeout(() => {
      if (id === '1') {
        setBorrowing({
          id: '1',
          bookId: '1',
          bookTitle: 'Faizane Sunnat',
          bookAuthor: 'Ameer e Ahle Sunnat',
          bookCategory: 'Islamic',
          studentId: '1',
          studentName: 'Ahmed Khan',
          studentGrade: 'Class 10',
          studentContact: '9876543210',
          borrowDate: yesterday.toISOString(),
          dueDate: nextWeek.toISOString(),
          returnDate: null,
          status: 'Borrowed',
          fineAmount: 0,
          finePaid: false,
          remarks: ''
        });
      } else if (id === '2') {
        setBorrowing({
          id: '2',
          bookId: '2',
          bookTitle: 'Namaz ke Ahkam',
          bookAuthor: 'Maulana Ilyas Qadri',
          bookCategory: 'Islamic',
          studentId: '2',
          studentName: 'Mohammed Ali',
          studentGrade: 'Class 9',
          studentContact: '8765432109',
          borrowDate: lastWeek.toISOString(),
          dueDate: yesterday.toISOString(),
          returnDate: null,
          status: 'Overdue',
          fineAmount: 25,
          finePaid: false,
          remarks: 'Student informed about overdue status via phone'
        });
      } else if (id === '3') {
        setBorrowing({
          id: '3',
          bookId: '3',
          bookTitle: 'Faizan-e-Quran',
          bookAuthor: 'Dawat-e-Islami',
          bookCategory: 'Islamic',
          studentId: '3',
          studentName: 'Fatima Begum',
          studentGrade: 'Class 8',
          studentContact: '7654321098',
          borrowDate: lastWeek.toISOString(),
          dueDate: yesterday.toISOString(),
          returnDate: today.toISOString(),
          status: 'Returned',
          fineAmount: 0,
          finePaid: true,
          remarks: 'Book returned in good condition'
        });
      } else {
        setError('Borrowing record not found');
      }
      setLoading(false);
    }, 800);
  }, [id, router, user, authLoading]);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not yet returned';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN') + ' ' + date.toLocaleTimeString('en-IN');
  };
  
  const calculateDaysLeft = (dueDate: string) => {
    const dueDateObj = new Date(dueDate);
    const today = new Date();
    
    const diffTime = dueDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const handleReturnBook = async () => {
    if (!borrowing) return;
    
    if (window.confirm('Confirm book return?')) {
      setLoading(true);
      
      try {
        // This would be a Firebase call in production
        // For now, simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const today = new Date();
        const isOverdue = today > new Date(borrowing.dueDate);
        const fineAmount = isOverdue ? calculateFine(borrowing.dueDate) : 0;
        
        setBorrowing({
          ...borrowing,
          returnDate: today.toISOString(),
          status: 'Returned',
          fineAmount: fineAmount,
          remarks: borrowing.remarks + (borrowing.remarks ? '\n' : '') + 
                  'Book returned on ' + formatDate(today.toISOString())
        });
        
        setSuccess('Book successfully returned');
      } catch (err) {
        setError('Failed to process return. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handlePayFine = async () => {
    if (!borrowing) return;
    
    if (window.confirm('Confirm fine payment of ₹' + borrowing.fineAmount + '?')) {
      setLoading(true);
      
      try {
        // This would be a Firebase call in production
        // For now, simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setBorrowing({
          ...borrowing,
          finePaid: true,
          remarks: borrowing.remarks + (borrowing.remarks ? '\n' : '') + 
                  'Fine of ₹' + borrowing.fineAmount + ' paid on ' + formatDate(new Date().toISOString())
        });
        
        setSuccess('Fine payment recorded successfully');
      } catch (err) {
        setError('Failed to process payment. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleMarkAsLost = async () => {
    if (!borrowing) return;
    
    if (window.confirm('Mark this book as lost? This will incur a fine of ₹250.')) {
      setLoading(true);
      
      try {
        // This would be a Firebase call in production
        // For now, simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setBorrowing({
          ...borrowing,
          status: 'Lost',
          returnDate: new Date().toISOString(),
          fineAmount: 250,
          finePaid: false,
          remarks: borrowing.remarks + (borrowing.remarks ? '\n' : '') + 
                  'Book marked as lost on ' + formatDate(new Date().toISOString())
        });
        
        setSuccess('Book marked as lost');
      } catch (err) {
        setError('Failed to update status. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const calculateFine = (dueDateString: string): number => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    
    // If not overdue, no fine
    if (today <= dueDate) return 0;
    
    // Calculate days overdue
    const diffTime = Math.abs(today.getTime() - dueDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // ₹5 per day fine
    return diffDays * 5;
  };
  
  if (authLoading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </Layout>
    );
  }
  
  if (!user) {
    // This should not be rendered as the useEffect will redirect
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading borrowing details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !borrowing) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Borrowing record not found'}
        </div>
        <button 
          onClick={() => router.push('/borrowings')}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
        >
          Back to Borrowings
        </button>
      </Layout>
    );
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
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Book Information */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-green-800">Book Information</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Book Title</h3>
                <p className="text-base text-gray-900">{borrowing.bookTitle}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Author</h3>
                <p className="text-base text-gray-900">{borrowing.bookAuthor}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="text-base text-gray-900">{borrowing.bookCategory}</p>
              </div>
              <div>
                <button 
                  onClick={() => router.push(`/books/${borrowing.bookId}`)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Book Details
                </button>
              </div>
            </div>
          </div>
          
          {/* Student Information */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-green-800">Student Information</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Student Name</h3>
                <p className="text-base text-gray-900">{borrowing.studentName}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Grade/Class</h3>
                <p className="text-base text-gray-900">{borrowing.studentGrade}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                <p className="text-base text-gray-900">{borrowing.studentContact}</p>
              </div>
              <div>
                <button 
                  onClick={() => router.push(`/students/${borrowing.studentId}`)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Student Details
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Borrowing Details */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-green-800">Borrowing Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Borrow Date</h3>
                <p className="text-base text-gray-900">{formatDate(borrowing.borrowDate)}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                <p className="text-base text-gray-900">{formatDate(borrowing.dueDate)}</p>
                {borrowing.status === 'Borrowed' && (
                  <p className={`text-sm ${calculateDaysLeft(borrowing.dueDate) < 3 ? 'text-red-600' : 'text-blue-600'}`}>
                    {calculateDaysLeft(borrowing.dueDate) > 0 
                      ? `${calculateDaysLeft(borrowing.dueDate)} days left` 
                      : 'Due today!'}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Return Date</h3>
                <p className="text-base text-gray-900">{formatDate(borrowing.returnDate)}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    borrowing.status === 'Borrowed' ? 'bg-blue-100 text-blue-800' :
                    borrowing.status === 'Returned' ? 'bg-green-100 text-green-800' :
                    borrowing.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {borrowing.status}
                  </span>
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Fine Amount</h3>
                {borrowing.fineAmount > 0 ? (
                  <p className={`text-base ${borrowing.finePaid ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{borrowing.fineAmount} {borrowing.finePaid ? '(Paid)' : '(Unpaid)'}
                  </p>
                ) : (
                  <p className="text-base text-gray-900">No fine</p>
                )}
              </div>
            </div>
            
            {borrowing.remarks && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">Remarks</h3>
                <p className="text-base text-gray-900 whitespace-pre-line">{borrowing.remarks}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-green-800">Actions</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              {(borrowing.status === 'Borrowed' || borrowing.status === 'Overdue') && (
                <>
                  <button 
                    onClick={handleReturnBook}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    disabled={loading}
                  >
                    Return Book
                  </button>
                  
                  <button 
                    onClick={handleMarkAsLost}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
                    disabled={loading}
                  >
                    Mark as Lost
                  </button>
                </>
              )}
              
              {borrowing.fineAmount > 0 && !borrowing.finePaid && (
                <button 
                  onClick={handlePayFine}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  disabled={loading}
                >
                  Pay Fine (₹{borrowing.fineAmount})
                </button>
              )}
              
              <button 
                onClick={() => window.print()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 