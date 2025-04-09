'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';

interface Borrowing {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  borrowDate: any;
  dueDate: any;
  returnDate: any | null;
  status: 'Borrowed' | 'Returned' | 'Overdue' | 'Lost';
  fineAmount: number;
  finePaid: boolean;
}

export default function Borrowings() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  useEffect(() => {
    // This will be connected to Firebase in the next step
    // For now, use mock data
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const mockBorrowings: Borrowing[] = [
      {
        id: '1',
        bookId: '1',
        bookTitle: 'Faizane Sunnat',
        studentId: '1',
        studentName: 'Ahmed Khan',
        borrowDate: yesterday.toISOString(),
        dueDate: nextWeek.toISOString(),
        returnDate: null,
        status: 'Borrowed',
        fineAmount: 0,
        finePaid: false
      },
      {
        id: '2',
        bookId: '2',
        bookTitle: 'Namaz ke Ahkam',
        studentId: '2',
        studentName: 'Mohammed Ali',
        borrowDate: lastWeek.toISOString(),
        dueDate: yesterday.toISOString(),
        returnDate: null,
        status: 'Overdue',
        fineAmount: 25,
        finePaid: false
      },
      {
        id: '3',
        bookId: '3',
        bookTitle: 'Faizan-e-Quran',
        studentId: '3',
        studentName: 'Fatima Begum',
        borrowDate: lastWeek.toISOString(),
        dueDate: yesterday.toISOString(),
        returnDate: today.toISOString(),
        status: 'Returned',
        fineAmount: 0,
        finePaid: true
      },
    ];
    
    setBorrowings(mockBorrowings);
    setLoading(false);
  }, []);

  const filteredBorrowings = borrowings.filter(borrowing => {
    const matchesSearch = 
      borrowing.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
      borrowing.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || borrowing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              className="px-4 py-2 border rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Borrowed">Borrowed</option>
              <option value="Returned">Returned</option>
              <option value="Overdue">Overdue</option>
              <option value="Lost">Lost</option>
            </select>
            
            <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md">
              New Borrowing
            </button>
          </div>
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
                    Fine
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        {borrowing.fineAmount > 0 ? (
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            borrowing.finePaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            ₹{borrowing.fineAmount} {borrowing.finePaid ? '(Paid)' : ''}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {borrowing.status === 'Borrowed' || borrowing.status === 'Overdue' ? (
                          <button className="text-green-600 hover:text-green-900 mr-3">
                            Return
                          </button>
                        ) : null}
                        
                        {borrowing.fineAmount > 0 && !borrowing.finePaid ? (
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Pay Fine
                          </button>
                        ) : null}
                        
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Details
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
