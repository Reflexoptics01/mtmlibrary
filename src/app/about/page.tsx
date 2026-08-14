'use client';

import Layout from '../../components/layout/Layout';
import Link from 'next/link';

export default function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">About Maktaba</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700 mb-4">
            Maktaba (مكتبة) is free, open-source library software for Muslim institutes, schools, and madrasas.
            It is not tied to any one organization — each institute runs its own copy with its own Supabase project.
          </p>
          <p className="text-gray-700 mb-4">
            Use it to catalog books, register students, issue and return loans, calculate late fines, and share
            publications such as magazines, risala, booklets, and audio lessons.
          </p>
          <p className="text-gray-700">
            Licensed under MIT. Contributions are welcome.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Link href="/help" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md">
            Help
          </Link>
          <Link href="/auth/login" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
            Staff login
          </Link>
        </div>
      </div>
    </Layout>
  );
}
