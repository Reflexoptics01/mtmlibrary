'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';

export default function StaffGate({ children }: { children: React.ReactNode }) {
  const { user, loading, isStaff, isPending, configError } = useAuth();

  if (loading) {
    return (
      <Layout>
        <p className="text-center text-gray-600 py-8">Loading...</p>
      </Layout>
    );
  }

  if (configError) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {configError}
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Staff login required</h2>
          <p className="text-gray-700 mb-4">Log in to manage books, students, and borrowings.</p>
          <Link href="/auth/login" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md">
            Log in
          </Link>
        </div>
      </Layout>
    );
  }

  if (isPending || !isStaff) {
    return (
      <Layout>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-amber-900 mb-2">Waiting for approval</h2>
          <p className="text-gray-700">
            Your account is pending. Ask an existing admin to open Staff and set your role to librarian.
          </p>
        </div>
      </Layout>
    );
  }

  return <>{children}</>;
}
