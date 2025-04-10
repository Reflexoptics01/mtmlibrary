'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

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

export default function Borrowings() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [filteredBorrowings, setFilteredBorrowings] = useState<Borrowing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Load borrowings from localStorage
    const loadBorrowings = () => {
      try {
        // Check for overdue items first
        const today = new Date();
        
        const storedBorrowings = localStorage.getItem('library_borrowings');
        if (storedBorrowings) {
          const parsedBorrowings = JSON.parse(storedBorrowings);
          
          // Check for overdue items and update status
          const updatedBorrowings = parsedBorrowings.map((borrowing: Borrowing) => {
            if (borrowing.status === 'Borrowed') {
              const dueDate = new Date(borrowing.dueDate);
              if (today > dueDate) {
                return { ...borrowing, status: 'Overdue' };
              }
            }
            return borrowing;
          });
          
          // Save updated status back to localStorage
          if (JSON.stringify(updatedBorrowings) !== JSON.stringify(parsedBorrowings)) {
            localStorage.setItem('library_borrowings', JSON.stringify(updatedBorrowings));
          }
          
          setBorrowings(updatedBorrowings);
          setFilteredBorrowings(updatedBorrowings);
        } else {
          // Initial mock data
          const initialBorrowings: Borrowing[] = [
            {
              id: '1',
              bookId: '1',
              bookTitle: 'Faizane Sunnat',
              studentId: '1',
              studentName: 'Ahmed Khan',
              borrowDate: new Date(2023, 4, 15).toISOString(),
              dueDate: new Date(2023, 4, 29).toISOString(),
              returnDate: null,
              status: 'Borrowed'
            },
            {
              id: '2',
              bookId: '2',
              bookTitle: 'Namaz ke Ahkam',
              studentId: '2',
              studentName: 'Mohammed Ali',
              borrowDate: new Date(2023, 4, 10).toISOString(),
              dueDate: new Date(2023, 4, 24).toISOString(),
              returnDate: null,
              status: 'Overdue'
            },
            {
              id: '3',
              bookId: '3',
              bookTitle: 'Faizan-e-Quran',
              studentId: '1',
              studentName: 'Ahmed Khan',
              borrowDate: new Date(2023, 3, 20).toISOString(),
              dueDate: new Date(2023, 4, 4).toISOString(),
              returnDate: new Date(2023, 4, 2).toISOString(),
              status: 'Returned'
            }
          ];
          
          // Save initial data to localStorage
          localStorage.setItem('library_borrowings', JSON.stringify(initialBorrowings));
          setBorrowings(initialBorrowings);
          setFilteredBorrowings(initialBorrowings);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading borrowings:', error);
        setLoading(false);
      }
    };

    loadBorrowings();
  }, []);

  // Apply filters when search query or status filter changes
  useEffect(() => {
    let filtered = borrowings;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(borrowing => borrowing.status === statusFilter);
    }
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        borrowing => 
          borrowing.bookTitle.toLowerCase().includes(query) ||
          borrowing.studentName.toLowerCase().includes(query)
      );
    }
    
    setFilteredBorrowings(filtered);
  }, [searchQuery, statusFilter, borrowings]);

  const handleReturnBook = (id: string) => {
    if (window.confirm('Confirm book return?')) {
      try {
        // Get current borrowings from localStorage
        const storedBorrowings = localStorage.getItem('library_borrowings');
        if (!storedBorrowings) return;
        
        const allBorrowings = JSON.parse(storedBorrowings);
        
        // Find the borrowing to update
        const borrowingToReturn = allBorrowings.find((b: Borrowing) => b.id === id);
        if (!borrowingToReturn) return;
        
        // Update the borrowing status
        const updatedBorrowings = allBorrowings.map((borrowing: Borrowing) => {
          if (borrowing.id === id) {
            return {
              ...borrowing,
              returnDate: new Date().toISOString(),
              status: 'Returned'
            };
          }
          return borrowing;
        });
        
        // Save updated borrowings
        localStorage.setItem('library_borrowings', JSON.stringify(updatedBorrowings));
        
        // Update book availability
        const storedBooks = localStorage.getItem('library_books');
        if (storedBooks) {
          const books = JSON.parse(storedBooks);
          const updatedBooks = books.map((book: any) => {
            if (book.id === borrowingToReturn.bookId) {
              return {
                ...book,
                availableCopies: book.availableCopies + 1
              };
            }
            return book;
          });
          localStorage.setItem('library_books', JSON.stringify(updatedBooks));
        }
        
        // Update student borrowed books count
        const storedStudents = localStorage.getItem('library_students');
        if (storedStudents) {
          const students = JSON.parse(storedStudents);
          const updatedStudents = students.map((student: any) => {
            if (student.id === borrowingToReturn.studentId) {
              return {
                ...student,
                borrowedBooks: Math.max(0, student.borrowedBooks - 1)
              };
            }
            return student;
          });
          localStorage.setItem('library_students', JSON.stringify(updatedStudents));
        }
        
        // Update state to reflect changes
        setBorrowings(updatedBorrowings);
      } catch (error) {
        console.error('Error returning book:', error);
        alert('Failed to process book return. Please try again.');
      }
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading borrowings...</p>
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
        <h1 className="text-3xl font-bold text-green-800 mb-6">Borrowing Management</h1>
        
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search by book title or student name..."
              className="px-4 py-2 border rounded-md w-full md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
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
            
            <button 
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
              onClick={() => router.push('/borrowings/add')}
            >
              New Borrowing
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
              {filteredBorrowings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No borrowings found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredBorrowings.map((borrowing) => (
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        borrowing.status === 'Borrowed' ? 'bg-blue-100 text-blue-800' :
                        borrowing.status === 'Returned' ? 'bg-green-100 text-green-800' :
                        borrowing.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {borrowing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {borrowing.status === 'Borrowed' || borrowing.status === 'Overdue' ? (
                        <button 
                          onClick={() => handleReturnBook(borrowing.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Return
                        </button>
                      ) : null}
                      
                      <button 
                        onClick={() => router.push(`/borrowings/${borrowing.id}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
