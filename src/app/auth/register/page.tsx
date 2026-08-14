'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name);
      setInfo('Account created. If email confirmation is on in your Supabase project, confirm your inbox first. The first account on a new project is admin; later accounts stay pending until an admin promotes them.');
      setTimeout(() => router.push('/auth/login'), 2500);
    } catch {
      setError('Could not create the account. The email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center py-8">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Create staff account</h2>
            <p className="text-sm text-gray-600 mb-4">
              There is no default admin. Use this form on your own Supabase project. Later signups need an admin to approve them.
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
            )}
            {info && (
              <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-4">{info}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Full name</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3" id="password" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm password</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3" id="confirmPassword" type="password" minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <button className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded w-full" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Register'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account? <Link href="/auth/login" className="text-green-700 hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
