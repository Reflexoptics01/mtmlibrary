'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import StaffGate from '@/components/StaffGate';
import { useAuth } from '@/context/AuthContext';
import { getSettings, updateSettings } from '@/lib/db';
import type { Settings } from '@/lib/types';

const emptySettings: Settings = {
  libraryName: '',
  maxBooksPerStudent: 3,
  maxBorrowDays: 14,
  finePerDay: 5,
  lostBookFine: 500,
  currencySymbol: '',
};

export default function SettingsPage() {
  const { isAdmin } = useAuth();
  const [form, setForm] = useState<Settings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const load = async () => {
    try {
      setForm(await getSettings());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin]);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateSettings(form);
      const fresh = await getSettings();
      setForm(fresh);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <StaffGate>
        <Layout>
          <p className="text-gray-700">Only an admin can change library settings.</p>
        </Layout>
      </StaffGate>
    );
  }

  const field = 'rounded-md border px-3 py-2 w-full';
  const label = 'mb-1 block text-sm font-semibold text-slate-700';

  return (
    <StaffGate>
      <Layout>
        <h1 className="mb-6 text-3xl font-bold text-green-800">Library Settings</h1>
        <p className="mb-6 text-gray-600">
          These rules apply app-wide: the library name shown in the header and footer, the borrowing limit per
          student, the default loan period, and fine amounts.
        </p>

        {error && <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">{error}</div>}
        {saved && (
          <div className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
            Settings saved.
          </div>
        )}

        {loading ? (
          <p className="py-8 text-center text-gray-600">Loading...</p>
        ) : (
          <form onSubmit={handleSave} className="max-w-2xl rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4">
              <label className={label} htmlFor="libraryName">Library name</label>
              <input
                id="libraryName"
                type="text"
                className={field}
                value={form.libraryName}
                onChange={(e) => set('libraryName', e.target.value)}
                required
              />
            </div>

            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="maxBooks">Max books per student</label>
                <input
                  id="maxBooks"
                  type="number"
                  min="1"
                  className={field}
                  value={form.maxBooksPerStudent}
                  onChange={(e) => set('maxBooksPerStudent', parseInt(e.target.value, 10) || 0)}
                  required
                />
              </div>
              <div>
                <label className={label} htmlFor="maxDays">Max borrow days</label>
                <input
                  id="maxDays"
                  type="number"
                  min="1"
                  className={field}
                  value={form.maxBorrowDays}
                  onChange={(e) => set('maxBorrowDays', parseInt(e.target.value, 10) || 0)}
                  required
                />
              </div>
              <div>
                <label className={label} htmlFor="finePerDay">Fine per day</label>
                <input
                  id="finePerDay"
                  type="number"
                  min="0"
                  step="0.01"
                  className={field}
                  value={form.finePerDay}
                  onChange={(e) => set('finePerDay', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <label className={label} htmlFor="lostFine">Lost book fine</label>
                <input
                  id="lostFine"
                  type="number"
                  min="0"
                  step="0.01"
                  className={field}
                  value={form.lostBookFine}
                  onChange={(e) => set('lostBookFine', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className={label} htmlFor="currency">Currency symbol</label>
              <input
                id="currency"
                type="text"
                maxLength={4}
                className={`${field} w-32`}
                value={form.currencySymbol}
                onChange={(e) => set('currencySymbol', e.target.value)}
                required
              />
              <p className="mt-1 text-sm text-gray-500">Shown next to all fine amounts, e.g. {form.currencySymbol || '₹'}.</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-green-700 px-6 py-2 text-white hover:bg-green-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        )}
      </Layout>
    </StaffGate>
  );
}
