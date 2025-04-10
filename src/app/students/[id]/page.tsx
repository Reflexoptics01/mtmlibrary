'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/layout/Layout';
import { getDoc, doc, getDocs, collection, where, query, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getStudentById } from '@/lib/firebase/db';

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

// Using a simpler approach to avoid type conflicts
export default function StudentDetail({ params }: any) {
  const [student, setStudent] = useState<Student | null>(null);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        // Fetch student data using our utility function
        const studentData = await getStudentById(id);
        
        if (!studentData) {
          setError('Student not found');
          setLoading(false);
          return;
        }

        // Fetch borrowed books for this student
        const borrowedBooksQuery = query(
          collection(db, 'borrowings'),
          where('studentId', '==', id),
          where('status', '==', 'Borrowed')
        );
        
        const borrowedBooksSnapshot = await getDocs(borrowedBooksQuery);
        const books: Book[] = [];
        
        for (const borrowingDoc of borrowedBooksSnapshot.docs) {
          const borrowingData = borrowingDoc.data() as { bookId: string; borrowDate: string; dueDate: string; fine: number };
          const bookDoc = await getDoc(doc(db, 'books', borrowingData.bookId));
          
          if (bookDoc.exists()) {
            const bookData = bookDoc.data() as { title: string };
            
            books.push({
              id: borrowingDoc.id,
              title: bookData.title,
              borrowDate: borrowingData.borrowDate,
              dueDate: borrowingData.dueDate,
              isOverdue: new Date(borrowingData.dueDate) < new Date(),
              fine: borrowingData.fine || 0
            });
          }
        }

        setStudent(studentData as Student);
        setBorrowedBooks(books);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError('Failed to load student data');
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  const handleReturnBook = async (bookId: string) => {
    try {
      // Update the borrowing record
      await updateDoc(doc(db, 'borrowings', bookId), {
        status: 'Returned',
        returnDate: new Date().toISOString()
      });

      // Update the book's availability
      const borrowingDoc = await getDoc(doc(db, 'borrowings', bookId));
      if (borrowingDoc.exists()) {
        const bookId = borrowingDoc.data().bookId;
        const bookDoc = await getDoc(doc(db, 'books', bookId));
        if (bookDoc.exists()) {
          const currentAvailable = bookDoc.data().availableCopies || 0;
          await updateDoc(doc(db, 'books', bookId), {
            availableCopies: currentAvailable + 1
          });
        }
      }

      // Update local state
      setBorrowedBooks(borrowedBooks.filter(book => book.id !== bookId));
      if (student) {
        setStudent({
          ...student,
          borrowedBooks: student.borrowedBooks - 1
        });
      }
    } catch (error) {
      console.error('Error returning book:', error);
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
                          <div className="text-sm text-gray-500">{formatDate(book.borrowDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(book.dueDate)}</div>
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