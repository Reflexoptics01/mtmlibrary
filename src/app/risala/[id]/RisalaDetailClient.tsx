'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';
import { getPublicationById, incrementDownload } from '@/lib/db';
import type { Publication } from '@/lib/types';

export default function PublicationDetailClient({ id }: { id: string }) {
  const [item, setItem] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPublicationById(id);
        if (!data) setError('Publication not found');
        else setItem(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load publication');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const handleDownload = async (type: 'booklet' | 'audio') => {
    if (!item) return;
    try {
      await incrementDownload(id);
      setItem({ ...item, downloadCount: item.downloadCount + 1 });
    } catch {
      // still open the file
    }
    const url = type === 'booklet' ? item.bookletUrl : item.audioUrl;
    if (url) window.open(url, '_blank');
  };

  if (loading) {
    return <Layout><p className="text-center py-8 text-gray-600">Loading publication...</p></Layout>;
  }

  if (error || !item) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error || 'Not found'}</div>
        <button onClick={() => router.push('/risala')} className="bg-green-700 text-white px-4 py-2 rounded-md">Back</button>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">{item.title}</h1>
          <button onClick={() => router.push('/risala')} className="bg-gray-200 px-4 py-2 rounded-md">Back to List</button>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-500 mb-2">{item.language} · {item.month} {item.year}</p>
          <p className="text-gray-500 mb-4">Downloads: {item.downloadCount}</p>
          <p className="text-gray-700 whitespace-pre-line mb-6">{item.description}</p>
          <div className="flex space-x-3 mb-6">
            {item.bookletUrl && (
              <button onClick={() => handleDownload('booklet')} className="bg-green-700 text-white px-4 py-2 rounded-md">Download Booklet</button>
            )}
            {item.audioUrl && (
              <button onClick={() => handleDownload('audio')} className="bg-green-700 text-white px-4 py-2 rounded-md">Listen Audio</button>
            )}
          </div>
          {item.audioUrl && (
            <audio controls className="w-full">
              <source src={item.audioUrl} />
            </audio>
          )}
        </div>
      </div>
    </Layout>
  );
}
