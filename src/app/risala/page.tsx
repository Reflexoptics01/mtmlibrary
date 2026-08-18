'use client';

import { Suspense, useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { deletePublication, getAllPublications } from '@/lib/db';
import { publicationYears, type Publication } from '@/lib/types';
import Link from 'next/link';

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
      <div className="space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">Community reading</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Publications</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Browse risala, magazines, booklets, and audio lessons shared by your institute.</p>
          </div>
          {isStaff && <button className="btn-primary self-start sm:self-auto" onClick={() => router.push('/risala/upload')}>Upload publication</button>}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_10rem_12rem]">
            <label className="sr-only" htmlFor="publication-search">Search publications</label>
            <input id="publication-search" type="search" placeholder="Search by title or description" aria-label="Search publications" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <label className="sr-only" htmlFor="publication-year">Filter by year</label>
            <select id="publication-year" aria-label="Filter by year" className="rounded-lg border border-slate-300 px-3 py-2.5 shadow-sm" value={yearFilter} onChange={(e) => setYearFilter(e.target.value ? parseInt(e.target.value, 10) : '')}>
              <option value="">All Years</option>
              {publicationYears().map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
            <label className="sr-only" htmlFor="publication-language">Filter by language</label>
            <select id="publication-language" aria-label="Filter by language" className="rounded-lg border border-slate-300 px-3 py-2.5 shadow-sm" value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
              <option value="">All Languages</option>
              {languages.map((language) => <option key={language} value={language}>{language}</option>)}
            </select>
          </div>
        </div>

        {error && <div role="alert" className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 sm:flex-row sm:items-center sm:justify-between"><span>{error}</span><button className="self-start rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium hover:bg-red-100" onClick={() => void load()}>Try again</button></div>}
        {loading ? (
          <p role="status" className="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center text-slate-600">Loading publications…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <p className="font-semibold text-slate-800">{items.length === 0 ? 'No publications yet' : 'No matching publications'}</p>
                <p className="mt-2 text-sm text-slate-500">{items.length === 0 ? 'Published material will appear here when your institute shares it.' : 'Try clearing a filter or searching with a different phrase.'}</p>
              </div>
            ) : (
              filtered.map((item) => (
                <article key={item.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-green-800 mb-2">
                      <Link className="text-left hover:underline" href={`/risala/${item.id}`}>{item.title}</Link>
                    </h2>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{item.language}</span>
                  </div>
                  <p className="mb-2 text-sm text-slate-500">{item.month} {item.year}</p>
                  <p className="mb-5 line-clamp-3 text-slate-700">{item.description}</p>
                  <div className="mb-5 flex justify-between text-sm text-slate-500">
                    <span>{item.downloadCount} downloads</span>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {item.bookletUrl && <a href={item.bookletUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm">Download</a>}
                    {item.audioUrl && <a href={item.audioUrl} target="_blank" rel="noreferrer" className="rounded-md bg-green-700 px-3 py-2 text-sm text-white hover:bg-green-800">Listen</a>}
                    {isStaff && (
                      <button onClick={() => handleDelete(item.id)} className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700">Delete</button>
                    )}
                  </div>
                </article>
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
