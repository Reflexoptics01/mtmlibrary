'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  grade: string;
  fatherName: string;
  contactNumber: string;
  borrowedBooks: number;
  finesDue: number;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Redirect if user is not logged in
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/students'));
      return;
    }
    
    // Load students from localStorage or use default data if not available
    const loadStudents = () => {
      try {
        const storedStudents = localStorage.getItem('library_students');
        if (storedStudents) {
          const parsedStudents = JSON.parse(storedStudents);
          setStudents(parsedStudents);
          setFilteredStudents(parsedStudents);
        } else {
          // Initial mock data - removed as requested
          const initialStudents: Student[] = [];
          
          // Save initial data to localStorage
          localStorage.setItem('library_students', JSON.stringify(initialStudents));
          setStudents(initialStudents);
          setFilteredStudents(initialStudents);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading students:', error);
        setLoading(false);
      }
    };

    loadStudents();
  }, [user, authLoading, router]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = students.filter(
        student => 
          student.name.toLowerCase().includes(query) ||
          student.rollNumber.toLowerCase().includes(query) ||
          student.grade.toLowerCase().includes(query)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      const updatedStudents = students.filter((student) => student.id !== id);
      // Update localStorage
      localStorage.setItem('library_students', JSON.stringify(updatedStudents));
      setStudents(updatedStudents);
    }
  };

  const handleRegisterStudent = () => {
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/students/register'));
    } else {
      router.push('/students/register');
    }
  };
  
  const handleViewStudent = (id: string) => {
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/students/${id}`));
    } else {
      router.push(`/students/${id}`);
    }
  };
  
  const handleEditStudent = (id: string) => {
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/students/edit/${id}`));
    } else {
      router.push(`/students/edit/${id}`);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Student Management</h1>
        
        {authLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : !user ? (
          <div className="text-center py-8">
            <div className="bg-green-50 p-6 rounded-lg shadow border border-green-200 mb-6">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">
                Please Log In
              </h2>
              <p className="text-gray-700 mb-4">
                You need to be logged in to access student management.
              </p>
              <div className="mt-4">
                <Link href="/auth/login?redirect=/students" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md">
                  Log In
                </Link>
                <Link href="/risala" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md ml-4">
                  View Farameen-e-Attar
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <input
                  type="text"
                  placeholder="Search students by name, roll number, or grade..."
                  className="px-4 py-2 border rounded-md w-full md:w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <button 
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
                  onClick={handleRegisterStudent}
                >
                  Register New Student
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading students...</p>
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Father's Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Books Borrowed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fines Due
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                          No students found matching your criteria
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{student.rollNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{student.grade}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{student.fatherName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{student.contactNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.borrowedBooks}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              student.finesDue > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              ₹{student.finesDue}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                              onClick={() => handleViewStudent(student.id)}
                            >
                              View
                            </button>
                            <button 
                              className="text-blue-600 hover:text-blue-900 mr-3"
                              onClick={() => handleEditStudent(student.id)}
                            >
                              Edit
                            </button>
                            {/* Delete button removed as requested */}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
