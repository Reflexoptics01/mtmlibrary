'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import StaffGate from '@/components/StaffGate';
import { addPublication, uploadPublicationFile } from '@/lib/db';
import { PUBLICATION_LANGUAGES, PUBLICATION_MONTHS, publicationYears } from '@/lib/types';

export default function UploadPublication() {
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [language, setLanguage] = useState('');
  const [description, setDescription] = useState('');
  const [bookletFile, setBookletFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!bookletFile) {
      setError('A PDF booklet is required');
      return;
    }
    setLoading(true);
    try {
      const stamp = Date.now();
      const bookletUrl = await uploadPublicationFile(`${year}/${month}/booklet_${stamp}_${bookletFile.name}`, bookletFile);
      const audioUrl = audioFile ? await uploadPublicationFile(`${year}/${month}/audio_${stamp}_${audioFile.name}`, audioFile) : '';
      const thumbnailUrl = thumbnailFile ? await uploadPublicationFile(`${year}/${month}/thumb_${stamp}_${thumbnailFile.name}`, thumbnailFile) : '';
      await addPublication({
        title,
        month,
        year: parseInt(year, 10),
        language,
        description,
        bookletUrl,
        audioUrl,
        thumbnailUrl,
      });
      setSuccess(true);
      setTimeout(() => router.push('/risala'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload publication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaffGate>
      <Layout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">Upload Publication</h1>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">Publication uploaded.</div>}
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Title</label>
              <input className="border rounded w-full py-2 px-3" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Language</label>
              <select className="border rounded w-full py-2 px-3" value={language} onChange={(e) => setLanguage(e.target.value)} required>
                <option value="">Select</option>
                {PUBLICATION_LANGUAGES.map((lang) => <option key={lang}>{lang}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Month</label>
              <select className="border rounded w-full py-2 px-3" value={month} onChange={(e) => setMonth(e.target.value)} required>
                <option value="">Select</option>
                {PUBLICATION_MONTHS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Year</label>
              <select className="border rounded w-full py-2 px-3" value={year} onChange={(e) => setYear(e.target.value)} required>
                {publicationYears().map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea className="border rounded w-full py-2 px-3" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Booklet PDF</label>
              <input type="file" accept=".pdf" onChange={(e) => setBookletFile(e.target.files?.[0] || null)} required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Audio (optional)</label>
              <input type="file" accept=".mp3,.wav" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Thumbnail (optional)</label>
              <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                {loading ? 'Uploading...' : 'Upload Publication'}
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </StaffGate>
  );
}
