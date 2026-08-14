'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, user, isStaff, isPending, configError } = useAuth();

  useEffect(() => {
    if (user && isStaff) {
      router.push('/dashboard');
    }
  }, [user, isStaff, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      const next = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/dashboard';
      router.push(next);
    } catch {
      setError('Could not log in. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Login to Maktaba</h2>

            {(error || configError) && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error || configError}
              </div>
            )}

            {isPending && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded mb-4">
                Your account is waiting for an admin to approve it.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              First person to register on a new project becomes admin.{' '}
              <Link href="/auth/register" className="text-green-700 hover:underline">Create staff account</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
