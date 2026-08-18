'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import StaffGate from '@/components/StaffGate';
import { getAllBooks, getAllStudents, getSettings, issueBook } from '@/lib/db';
import type { Book, Settings, Student } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function AddBorrowingForm() {
  const [books, setBooks] = useState<Book[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [durationDays, setDurationDays] = useState(14);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isStaff } = useAuth();

  useEffect(() => {
    const preset = searchParams.get('studentId');
    if (preset) setSelectedStudentId(preset);
  }, [searchParams]);

  useEffect(() => {
    if (!isStaff) return;
    const load = async () => {
      try {
        const [bookData, studentData, settingData] = await Promise.all([
          getAllBooks(),
          getAllStudents(),
          getSettings(),
        ]);
        setBooks(bookData.filter((book) => book.availableCopies > 0));
        setStudents(studentData);
        setSettings(settingData);
        setDurationDays(settingData.maxBorrowDays);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [isStaff]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !selectedStudentId) {
      setError('Select a book and a student');
      return;
    }
    if (durationDays < 1) {
      setError('Duration must be at least 1 day');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await issueBook(selectedBookId, selectedStudentId, durationDays);
      setSuccess('Book issued');
      setTimeout(() => router.push('/borrowings'), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to issue book');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StaffGate>
      <Layout>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-green-800">New Borrowing</h1>
            <button onClick={() => router.push('/borrowings')} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md">Cancel</button>
          </div>
          {loading ? (
            <p className="text-center text-gray-600 py-8">Loading...</p>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6">
              {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
              {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Book</label>
                  <select className="border rounded w-full py-2 px-3" value={selectedBookId} onChange={(e) => setSelectedBookId(e.target.value)} required>
                    <option value="">-- Select a book --</option>
                    {books.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title} by {book.author} ({book.availableCopies} available)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Student</label>
                  <select className="border rounded w-full py-2 px-3" value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} required>
                    <option value="">-- Select a student --</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.rollNumber}, {student.grade})
                      </option>
                    ))}
                  </select>
                  {selectedStudent && selectedStudent.finesDue > 0 && (
                    <p className="mt-2 text-red-600 text-sm">Unpaid fines: {settings?.currencySymbol}{selectedStudent.finesDue}</p>
                  )}
                  {selectedStudent && settings && selectedStudent.borrowedBooks >= settings.maxBooksPerStudent && (
                    <p className="mt-2 text-amber-600 text-sm">This student is at the borrow limit ({settings.maxBooksPerStudent}).</p>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Duration (days)</label>
                  <input type="number" min="1" max="90" className="border rounded w-full py-2 px-3" value={durationDays} onChange={(e) => setDurationDays(parseInt(e.target.value, 10) || 0)} required />
                </div>
                <div className="bg-gray-50 p-3 rounded border mb-6 text-sm text-gray-700">
                  Late fine: {settings?.currencySymbol}{settings?.finePerDay} per day. Lost book: {settings?.currencySymbol}{settings?.lostBookFine}.
                </div>
                <button type="submit" disabled={submitting} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md">
                  {submitting ? 'Processing...' : 'Confirm Borrowing'}
                </button>
              </form>
            </div>
          )}
        </div>
      </Layout>
    </StaffGate>
  );
}
