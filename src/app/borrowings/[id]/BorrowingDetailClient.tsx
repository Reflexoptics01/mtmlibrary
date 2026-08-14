'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import StaffGate from '@/components/StaffGate';
import { getBorrowingById, getSettings, markBookLost, returnBook } from '@/lib/db';
import type { Borrowing, Settings } from '@/lib/types';

export default function BorrowingDetailClient({ id }: { id: string }) {
  const [borrowing, setBorrowing] = useState<Borrowing | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const load = async () => {
    try {
      const [loan, settingData] = await Promise.all([getBorrowingById(id), getSettings()]);
      setBorrowing(loan);
      setSettings(settingData);
      if (!loan) setError('Borrowing record not found');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load borrowing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  const handleReturn = async () => {
    if (!window.confirm('Confirm book return?')) return;
    setProcessing(true);
    try {
      const fine = await returnBook(id);
      if (fine > 0) alert(`Returned. Fine added: ${settings?.currencySymbol}${fine}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to return book');
    } finally {
      setProcessing(false);
    }
  };

  const handleLost = async () => {
    if (!window.confirm('Mark this book as lost? The lost-book fine will be added to the student.')) return;
    setProcessing(true);
    try {
      await markBookLost(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as lost');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <StaffGate>
      <Layout>
        {loading ? (
          <p className="text-center text-gray-600 py-8">Loading...</p>
        ) : (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-green-800">Borrowing Details</h1>
              <button onClick={() => router.push('/borrowings')} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md">Back</button>
            </div>
            {error || !borrowing ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error || 'Not found'}</div>
            ) : (
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-green-700">{borrowing.bookTitle}</h2>
                    <p className="text-gray-500">Borrowed by: {borrowing.studentName}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100">{borrowing.status}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between"><span>Borrow date</span><span>{borrowing.borrowDate}</span></div>
                    <div className="flex justify-between"><span>Due date</span><span>{borrowing.dueDate}</span></div>
                    {borrowing.returnDate && <div className="flex justify-between"><span>Return date</span><span>{borrowing.returnDate}</span></div>}
                    <div className="flex justify-between"><span>Fine on this loan</span><span>{settings?.currencySymbol}{borrowing.fineAmount}</span></div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                    Late return: {settings?.currencySymbol}{settings?.finePerDay} per day. Lost book: {settings?.currencySymbol}{settings?.lostBookFine}.
                  </div>
                </div>
                {(borrowing.status === 'Borrowed' || borrowing.status === 'Overdue') && (
                  <div className="flex justify-end space-x-3 mt-6">
                    <button onClick={handleReturn} disabled={processing} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">Return Book</button>
                    <button onClick={handleLost} disabled={processing} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">Mark as Lost</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Layout>
    </StaffGate>
  );
}
