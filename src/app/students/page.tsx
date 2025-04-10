'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface Student {
  id: string;
  name: string;
  fatherName: string;
  contactNumber: string;
  address: string;
  registrationDate: any;
  borrowedBooks: number;
  finesDue: number;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  useEffect(() => {
    // Check authentication first
    if (!authLoading && !user) {
      // If user is trying to add, edit, or view details, redirect to login
      if (window.location.pathname.includes('/register') || 
          window.location.pathname.includes('/edit') || 
          /\/students\/[^\/]+$/.test(window.location.pathname)) {
        router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
        return;
      }
    }
    
    // This will be connected to Firebase in the next step
    // For now, use mock data and check localStorage for deleted students
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'Ahmed Khan',
        fatherName: 'Imran Khan',
        contactNumber: '9876543210',
        address: 'Gangavathi',
        registrationDate: new Date().toISOString(),
        borrowedBooks: 2,
        finesDue: 0
      },
      {
        id: '2',
        name: 'Mohammed Ali',
        fatherName: 'Yusuf Ali',
        contactNumber: '8765432109',
        address: 'Gangavathi',
        registrationDate: new Date().toISOString(),
        borrowedBooks: 1,
        finesDue: 25
      },
      {
        id: '3',
        name: 'Fatima Begum',
        fatherName: 'Abdul Rahman',
        contactNumber: '7654321098',
        address: 'Gangavathi',
        registrationDate: new Date().toISOString(),
        borrowedBooks: 0,
        finesDue: 0
      },
    ];
    
    // Check localStorage for deleted student IDs
    const deletedStudentIds = localStorage.getItem('deletedStudentIds');
    let activeStudents = mockStudents;
    
    if (deletedStudentIds) {
      const deletedIds = JSON.parse(deletedStudentIds) as string[];
      activeStudents = mockStudents.filter(student => !deletedIds.includes(student.id));
    }
    
    setStudents(activeStudents);
    setLoading(false);
  }, [authLoading, user, router]);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.contactNumber.includes(searchTerm)
  );
  
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
  
  const handleDeleteStudent = (id: string) => {
    // In a real app, this would call Firebase to delete the student
    if (window.confirm('Are you sure you want to delete this student?')) {
      console.log('Deleting student with ID:', id);
      
      // Update local state
      setStudents(students.filter(student => student.id !== id));
      
      // Store deleted IDs in localStorage to persist across refreshes
      const deletedStudentIds = localStorage.getItem('deletedStudentIds');
      let deletedIds: string[] = [];
      
      if (deletedStudentIds) {
        deletedIds = JSON.parse(deletedStudentIds);
      }
      
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
      }
      
      localStorage.setItem('deletedStudentIds', JSON.stringify(deletedIds));
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Student Management</h1>
        
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search students by name or contact..."
              className="px-4 py-2 border rounded-md w-full md:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                    Name
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
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
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
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteStudent(student.id)}
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
