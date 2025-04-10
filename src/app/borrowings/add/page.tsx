'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '../../../components/layout/Layout';
import { useAuth } from '../../../context/AuthContext';

interface Book {
  id: string;
  title: string;
  author: string;
  availableCopies: number;
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  grade: string;
  borrowedBooks: number;
  finesDue: number;
}

export default function AddBorrowing() {
  const [books, setBooks] = useState<Book[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [durationDays, setDurationDays] = useState(14); // Default 14 days
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  // Get studentId from URL if provided
  const studentId = searchParams.get('studentId');
  
  useEffect(() => {
    // If not logged in, redirect to login page
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/borrowings/add'));
      return;
    }
    
    // Load available books and students
    const loadData = async () => {
      try {
        // This would fetch from Firebase in production
        // Mock data for now
        const mockBooks: Book[] = [
          { id: '1', title: 'Faizane Sunnat', author: 'Ameer e Ahle Sunnat', availableCopies: 3 },
          { id: '2', title: 'Namaz ke Ahkam', author: 'Maulana Ilyas Qadri', availableCopies: 8 },
          { id: '3', title: 'Faizan-e-Quran', author: 'Dawat-e-Islami', availableCopies: 4 },
        ];
        
        const mockStudents: Student[] = [
          { id: '1', name: 'Ahmed Khan', rollNumber: 'STD001', grade: 'Class 10', borrowedBooks: 2, finesDue: 0 },
          { id: '2', name: 'Mohammed Ali', rollNumber: 'STD002', grade: 'Class 9', borrowedBooks: 1, finesDue: 25 },
          { id: '3', name: 'Fatima Begum', rollNumber: 'STD003', grade: 'Class 8', borrowedBooks: 0, finesDue: 0 },
        ];
        
        // Filter out books with no available copies
        const availableBooks = mockBooks.filter(book => book.availableCopies > 0);
        
        setBooks(availableBooks);
        setStudents(mockStudents);
        
        // If studentId is provided in URL, select that student
        if (studentId) {
          setSelectedStudentId(studentId);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    
    loadData();
  }, [studentId, router, user, authLoading]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBookId) {
      setError('Please select a book');
      return;
    }
    
    if (!selectedStudentId) {
      setError('Please select a student');
      return;
    }
    
    if (durationDays < 1) {
      setError('Duration must be at least 1 day');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      // This would be a Firebase call in production
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const selectedStudent = students.find(s => s.id === selectedStudentId);
      const selectedBook = books.find(b => b.id === selectedBookId);
      
      if (selectedStudent && selectedBook) {
        // Calculate due date
        const borrowDate = new Date();
        const dueDate = new Date(borrowDate);
        dueDate.setDate(dueDate.getDate() + durationDays);
        
        console.log('Borrowing details:', {
          bookId: selectedBookId,
          bookTitle: selectedBook.title,
          studentId: selectedStudentId,
          studentName: selectedStudent.name,
          borrowDate: borrowDate.toISOString(),
          dueDate: dueDate.toISOString(),
          status: 'Borrowed'
        });
        
        setSuccess('Book successfully borrowed');
        
        // Redirect to borrowings page after a brief delay
        setTimeout(() => {
          router.push('/borrowings');
        }, 1500);
      }
    } catch (err) {
      setError('Failed to process borrowing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const getSelectedStudent = () => {
    return students.find(s => s.id === selectedStudentId);
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
  
  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">New Borrowing</h1>
          <button 
            onClick={() => router.push('/borrowings')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="book">
                      Select Book <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="book"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={selectedBookId}
                      onChange={(e) => setSelectedBookId(e.target.value)}
                      required
                    >
                      <option value="">-- Select a book --</option>
                      {books.map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.title} by {book.author} ({book.availableCopies} available)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="student">
                      Select Student <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="student"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      required
                    >
                      <option value="">-- Select a student --</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.rollNumber}, {student.grade})
                        </option>
                      ))}
                    </select>
                    
                    {(() => {
                      const selectedStudent = getSelectedStudent();
                      return selectedStudent?.finesDue ? (
                        <p className="mt-2 text-red-600 text-sm">
                          Warning: This student has ₹{selectedStudent.finesDue} in unpaid fines
                        </p>
                      ) : null;
                    })()}
                    
                    {(() => {
                      const selectedStudent = getSelectedStudent();
                      return selectedStudent?.borrowedBooks && selectedStudent.borrowedBooks >= 3 ? (
                        <p className="mt-2 text-orange-600 text-sm">
                          Warning: This student already has {selectedStudent.borrowedBooks} books borrowed
                        </p>
                      ) : null;
                    })()}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                      Borrowing Duration (days) <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="duration"
                      type="number"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={durationDays}
                      onChange={(e) => setDurationDays(parseInt(e.target.value) || 0)}
                      min="1"
                      max="30"
                      required
                    />
                    <p className="mt-1 text-gray-600 text-xs">
                      Due date will be {new Date(new Date().setDate(new Date().getDate() + durationDays)).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Fine Policy</h3>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Late Return Fine:</strong> ₹5 per day after the due date
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Lost Book Fine:</strong> Full book price plus ₹100 processing fee
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {submitting ? 'Processing...' : 'Confirm Borrowing'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
} 