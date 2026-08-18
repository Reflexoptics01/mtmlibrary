'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';
import { extendBorrowing, getAllBorrowings, getSettings, returnBook } from '@/lib/db';
import type { Borrowing, Settings } from '@/lib/types';
import StaffGate from '@/components/StaffGate';
import { useAuth } from '@/context/AuthContext';
import LoanStatusBadge from '@/components/LoanStatusBadge';

export default function Borrowings() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<Settings | null>(null);
  const router = useRouter();
  const { isStaff } = useAuth();

  const load = async () => {
    try {
      setLoading(true);
      const [list, settingData] = await Promise.all([getAllBorrowings(), getSettings()]);
      setBorrowings(list);
      setSettings(settingData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load borrowings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isStaff) return;
    void load();
  }, [isStaff]);

  const filtered = borrowings.filter((borrowing) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      (borrowing.bookTitle || '').toLowerCase().includes(q) ||
      (borrowing.studentName || '').toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || borrowing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReturnBook = async (id: string) => {
    if (!window.confirm('Return this book? Late fines are calculated automatically.')) return;
    try {
      const fine = await returnBook(id);
      if (fine > 0) alert(`Returned. Fine added: ${fine}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to return book');
    }
  };

  const handleExtend = async (id: string) => {
    const maxDays = settings?.maxBorrowDays ?? 14;
    const raw = window.prompt(`Extend due date by how many days? (default ${maxDays})`, String(maxDays));
    if (raw === null) return;
    const days = parseInt(raw, 10);
    if (!Number.isFinite(days) || days < 1 || days > 60) {
      setError('Enter a number of days between 1 and 60');
      return;
    }
    try {
      const newDue = await extendBorrowing(id, days);
      alert(`Due date extended to ${newDue}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extend borrowing');
    }
  };

  return (
    <StaffGate>
      <Layout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">Borrowing Management</h1>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by book or student..."
                className="px-4 py-2 border rounded-md w-full sm:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select className="px-4 py-2 border rounded-md" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Returned">Returned</option>
                <option value="Overdue">Overdue</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <button onClick={() => router.push('/borrowings/add')} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md">
              Add New Borrowing
            </button>
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {loading ? (
            <p className="text-center text-gray-600 py-8">Loading borrowings...</p>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No borrowing records found.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Book', 'Student', 'Borrowed', 'Due', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((borrowing) => (
                      <tr key={borrowing.id}>
                        <td className="px-6 py-4">{borrowing.bookTitle}</td>
                        <td className="px-6 py-4 text-gray-500">{borrowing.studentName}</td>
                        <td className="px-6 py-4 text-sm">{borrowing.borrowDate}</td>
                        <td className="px-6 py-4 text-sm">{borrowing.dueDate}</td>
                        <td className="px-6 py-4"><LoanStatusBadge status={borrowing.status} /></td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-green-600 mr-3" onClick={() => router.push(`/borrowings/${borrowing.id}`)}>View</button>
                          {(borrowing.status === 'Borrowed' || borrowing.status === 'Overdue') && (
                            <>
                              <button className="text-green-600 mr-3" onClick={() => handleExtend(borrowing.id)}>Renew</button>
                              <button className="text-green-600" onClick={() => handleReturnBook(borrowing.id)}>Return</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </Layout>
    </StaffGate>
  );
}
