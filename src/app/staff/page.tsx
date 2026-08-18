'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import StaffGate from '@/components/StaffGate';
import { useAuth } from '@/context/AuthContext';
import { getAllProfiles, updateProfileRole } from '@/lib/db';
import type { Profile, StaffRole } from '@/lib/types';

export default function StaffPage() {
  const { isAdmin } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setProfiles(await getAllProfiles());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load staff');
    }
  };

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin]);

  const handleRole = async (id: string, role: StaffRole) => {
    try {
      await updateProfileRole(id, role);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  if (!isAdmin) {
    return (
      <StaffGate>
        <Layout>
          <p className="text-gray-700">Only an admin can manage staff roles.</p>
        </Layout>
      </StaffGate>
    );
  }

  return (
    <StaffGate>
      <Layout>
        <h1 className="text-3xl font-bold text-green-800 mb-6">Staff</h1>
        <p className="text-gray-600 mb-4">Promote pending accounts to librarian. There is no default admin user in this project.</p>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Role', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id}>
                  <td className="px-6 py-4">{profile.fullName || profile.id}</td>
                  <td className="px-6 py-4">{profile.role}</td>
                  <td className="px-6 py-4 space-x-2">
                    {profile.role !== 'librarian' && (
                      <button className="text-green-700" onClick={() => handleRole(profile.id, 'librarian')}>Make librarian</button>
                    )}
                    {profile.role !== 'admin' && (
                      <button className="text-green-800" onClick={() => handleRole(profile.id, 'admin')}>Make admin</button>
                    )}
                    {profile.role !== 'pending' && (
                      <button className="text-amber-700" onClick={() => handleRole(profile.id, 'pending')}>Set pending</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </StaffGate>
  );
}
