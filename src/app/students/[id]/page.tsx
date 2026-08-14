'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import StaffGate from '@/components/StaffGate';
import { getActiveBorrowingsForStudent, getSettings, getStudentById, payStudentFine, returnBook } from '@/lib/db';
import type { Borrowing, Settings, Student } from '@/lib/types';

export default function StudentDetail() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loans, setLoans] = useState<Borrowing[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const load = async () => {
    try {
      setLoading(true);
      const [studentData, loanData, settingData] = await Promise.all([
        getStudentById(id),
        getActiveBorrowingsForStudent(id),
        getSettings(),
      ]);
      if (!studentData) {
        setError('Student not found');
        return;
      }
      setStudent(studentData);
      setLoans(loanData);
      setSettings(settingData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load student');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  const handleReturn = async (loanId: string) => {
    if (!window.confirm('Return this book? Late fines will be added automatically.')) return;
    try {
      const fine = await returnBook(loanId);
      if (fine > 0) {
        alert(`Returned. Fine added: ${settings?.currencySymbol ?? ''}${fine}`);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to return book');
    }
  };

  const handlePay = async () => {
    const amount = Number(payAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter a payment amount greater than 0');
      return;
    }
    try {
      await payStudentFine(id, amount);
      setPayAmount('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record payment');
    }
  };

  return (
    <StaffGate>
      <Layout>
        {loading ? (
          <p className="text-center text-gray-600 py-8">Loading student details...</p>
        ) : error || !student ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error || 'Student not found'}</div>
        ) : (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-green-800">Student Details</h1>
              <div className="flex space-x-2">
                <button onClick={() => router.push(`/students/edit/${id}`)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Edit</button>
                <button onClick={() => router.push('/students')} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md">Back</button>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><h3 className="text-sm text-gray-500">Name</h3><p>{student.name}</p></div>
              <div><h3 className="text-sm text-gray-500">Father name</h3><p>{student.fatherName}</p></div>
              <div><h3 className="text-sm text-gray-500">Roll number</h3><p>{student.rollNumber}</p></div>
              <div><h3 className="text-sm text-gray-500">Class</h3><p>{student.grade}</p></div>
              <div><h3 className="text-sm text-gray-500">Contact</h3><p>{student.contactNumber}</p></div>
              <div><h3 className="text-sm text-gray-500">Fines due</h3><p>{settings?.currencySymbol}{student.finesDue}</p></div>
              <div className="md:col-span-2"><h3 className="text-sm text-gray-500">Address</h3><p>{student.address}</p></div>
            </div>

            {student.finesDue > 0 && (
              <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-green-800 mb-3">Pay fine</h2>
                <div className="flex gap-2">
                  <input type="number" min="1" step="0.01" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} className="border rounded px-3 py-2 w-40" placeholder="Amount" />
                  <button onClick={handlePay} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md">Record payment</button>
                </div>
              </div>
            )}

            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Borrowed books</h2>
              {loans.length === 0 ? (
                <p className="text-gray-500">No books currently borrowed.</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Book', 'Borrowed', 'Due', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan) => (
                      <tr key={loan.id}>
                        <td className="px-6 py-4">{loan.bookTitle}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{loan.borrowDate}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{loan.dueDate}</td>
                        <td className="px-6 py-4">{loan.status}</td>
                        <td className="px-6 py-4">
                          <button className="text-green-700" onClick={() => handleReturn(loan.id)}>Return</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button onClick={() => router.push('/borrowings/add?studentId=' + id)} className="mt-6 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md">
                Issue new book
              </button>
            </div>
          </div>
        )}
      </Layout>
    </StaffGate>
  );
}
