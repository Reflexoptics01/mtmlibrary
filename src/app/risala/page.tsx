'use client';

import { Suspense, useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { deletePublication, getAllPublications } from '@/lib/db';
import { publicationYears, type Publication } from '@/lib/types';

function PublicationsInner() {
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<number | ''>('');
  const [languageFilter, setLanguageFilter] = useState('');
  const { isStaff } = useAuth();
  const router = useRouter();

  const load = async () => {
    try {
      setLoading(true);
      setItems(await getAllPublications());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load publications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const languages = Array.from(new Set(items.map((item) => item.language))).sort();
  const filtered = items.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    const matchesYear = yearFilter === '' || item.year === yearFilter;
    const matchesLanguage = languageFilter === '' || item.language === languageFilter;
    return matchesSearch && matchesYear && matchesLanguage;
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this publication?')) return;
    try {
      await deletePublication(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Publications</h1>
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-2">
          <input type="text" placeholder="Search publications..." className="px-4 py-2 border rounded-md w-full md:w-80" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <div className="flex space-x-2">
            <select className="px-4 py-2 border rounded-md" value={yearFilter} onChange={(e) => setYearFilter(e.target.value ? parseInt(e.target.value, 10) : '')}>
              <option value="">All Years</option>
              {publicationYears().map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
            <select className="px-4 py-2 border rounded-md" value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
              <option value="">All Languages</option>
              {languages.map((language) => <option key={language} value={language}>{language}</option>)}
            </select>
            {isStaff && (
              <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md" onClick={() => router.push('/risala/upload')}>
                Upload Publication
              </button>
            )}
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {loading ? (
          <p className="text-center text-gray-600 py-8">Loading publications...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <p className="col-span-full text-center text-gray-600 py-8">No publications yet</p>
            ) : (
              filtered.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-green-800 mb-2">
                      <button className="text-left hover:underline" onClick={() => router.push(`/risala/${item.id}`)}>{item.title}</button>
                    </h2>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{item.language}</span>
                  </div>
                  <p className="text-gray-600 mb-2">{item.month} {item.year}</p>
                  <p className="text-gray-700 mb-4 line-clamp-3">{item.description}</p>
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>{item.downloadCount} downloads</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.bookletUrl && <a href={item.bookletUrl} target="_blank" rel="noreferrer" className="bg-green-700 text-white px-3 py-1 rounded-md text-sm">Download</a>}
                    {item.audioUrl && <a href={item.audioUrl} target="_blank" rel="noreferrer" className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Audio</a>}
                    {isStaff && (
                      <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-3 py-1 rounded-md text-sm">Delete</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function PublicationsPage() {
  return (
    <Suspense fallback={<Layout><p className="text-center py-8">Loading...</p></Layout>}>
      <PublicationsInner />
    </Suspense>
  );
}
