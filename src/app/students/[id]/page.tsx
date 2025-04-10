'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/layout/Layout';

interface Student {
  id: string;
  name: string;
  fatherName: string;
  rollNumber: string;
  grade: string;
  contactNumber: string;
  address: string;
  registrationDate: string;
  borrowedBooks: number;
  finesDue: number;
}

interface Book {
  id: string;
  title: string;
  borrowDate: string;
  dueDate: string;
  isOverdue: boolean;
  fine: number;
}

type Props = {
  params: { id: string }
}

export default function StudentDetail({ params }: Props) {
  const [student, setStudent] = useState<Student | null>(null);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    // This would normally fetch data from Firebase
    // For now, use mock data
    const mockStudent: Student = {
      id,
      name: 'Ahmed Khan',
      fatherName: 'Imran Khan',
      rollNumber: 'STD001',
      grade: 'Class 10',
      contactNumber: '9876543210',
      address: 'Main Street, Gangavathi',
      registrationDate: new Date().toISOString(),
      borrowedBooks: 2,
      finesDue: 0
    };

    const mockBorrowedBooks: Book[] = [
      {
        id: '1',
        title: 'Faizane Sunnat',
        borrowDate: '2023-10-01',
        dueDate: '2023-10-15',
        isOverdue: false,
        fine: 0
      },
      {
        id: '2',
        title: 'Namaz ke Ahkam',
        borrowDate: '2023-09-15',
        dueDate: '2023-09-30',
        isOverdue: true,
        fine: 0
      }
    ];
    
    setStudent(mockStudent);
    setBorrowedBooks(mockBorrowedBooks);
    setLoading(false);
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  const handleReturnBook = (bookId: string) => {
    // This would normally update Firebase
    // For now, just update the local state
    setBorrowedBooks(borrowedBooks.filter(book => book.id !== bookId));
    if (student) {
      setStudent({
        ...student,
        borrowedBooks: student.borrowedBooks - 1
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading student details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !student) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Student not found'}
        </div>
        <button 
          onClick={() => router.push('/students')}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
        >
          Back to Students
        </button>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">Student Details</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => router.push(`/students/edit/${id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Edit Student
            </button>
            <button 
              onClick={() => router.push('/students')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
            >
              Back to Students
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="text-base text-gray-900">{student.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Father's Name</h3>
                <p className="text-base text-gray-900">{student.fatherName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Roll Number</h3>
                <p className="text-base text-gray-900">{student.rollNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Grade/Class</h3>
                <p className="text-base text-gray-900">{student.grade}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                <p className="text-base text-gray-900">{student.contactNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Registration Date</h3>
                <p className="text-base text-gray-900">{formatDate(student.registrationDate)}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="text-base text-gray-900">{student.address}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Borrowed Books</h2>
            
            {borrowedBooks.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No books currently borrowed by this student.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book Title
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
                    {borrowedBooks.map((book) => (
                      <tr key={book.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{book.borrowDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{book.dueDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            book.isOverdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {book.isOverdue ? 'Overdue' : 'On Time'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-green-600 hover:text-green-900"
                            onClick={() => handleReturnBook(book.id)}
                          >
                            Return Book
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-6">
              <button 
                onClick={() => router.push('/borrowings/add?studentId=' + id)}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
              >
                Issue New Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 