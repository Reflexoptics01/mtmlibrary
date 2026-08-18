'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { deleteStudent, getAllStudents, getSettings } from '@/lib/db';
import type { Student } from '@/lib/types';
import StaffGate from '@/components/StaffGate';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currency, setCurrency] = useState('₹');
  const router = useRouter();
  const { isStaff } = useAuth();

  useEffect(() => {
    if (!isStaff) return;
    const load = async () => {
      try {
        setLoading(true);
        const [list, settings] = await Promise.all([getAllStudents(), getSettings()]);
        setStudents(list);
        setCurrency(settings.currencySymbol);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [isStaff]);

  const query = searchQuery.toLowerCase();
  const filteredStudents = students.filter((student) =>
    (student.name || '').toLowerCase().includes(query) ||
    (student.rollNumber || '').toLowerCase().includes(query) ||
    (student.grade || '').toLowerCase().includes(query)
  );

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('Delete this student? Active loans will block deletion.')) return;
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student');
    }
  };

  return (
    <StaffGate>
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Student Management</h1>
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <input
                type="text"
                placeholder="Search students by name, roll number, or class..."
                className="px-4 py-2 border rounded-md w-full md:w-80 mb-4 md:mb-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md" onClick={() => router.push('/students/register')}>
                Register New Student
              </button>
            </div>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            {loading ? (
              <p className="text-center text-gray-600 py-8">Loading students...</p>
            ) : (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Name', 'Roll', 'Class', 'Borrowed', 'Fines', 'Actions'].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No students found</td></tr>
                    ) : (
                      filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 text-sm font-medium">{student.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{student.rollNumber}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{student.grade}</td>
                          <td className="px-6 py-4 text-sm">{student.borrowedBooks}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 text-xs font-semibold rounded-full ${student.finesDue > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {currency}{student.finesDue}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button className="text-green-600 mr-3" onClick={() => router.push(`/students/${student.id}`)}>View</button>
                            <button className="text-green-700 mr-3" onClick={() => router.push(`/students/edit/${student.id}`)}>Edit</button>
                            <button className="text-red-600" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
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
    </StaffGate>
  );
}
