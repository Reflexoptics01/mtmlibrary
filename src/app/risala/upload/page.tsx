'use client';

import { useState } from 'react';
import Layout from '../../../components/layout/Layout';

export default function UploadRisala() {
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [language, setLanguage] = useState('');
  const [description, setDescription] = useState('');
  const [bookletFile, setBookletFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Mock data for dropdowns
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = [2025, 2024, 2023, 2022, 2021];
  const languages = ['Urdu', 'Hindi', 'English'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // This will be connected to Firebase in the next step
      // For now, just simulate upload
      console.log('Uploading Risala:', {
        title,
        month,
        year,
        language,
        description,
        bookletFile: bookletFile?.name,
        audioFile: audioFile?.name,
        thumbnailFile: thumbnailFile?.name
      });
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        
        // Reset form after successful upload
        setTitle('');
        setMonth('');
        setYear('');
        setLanguage('');
        setDescription('');
        setBookletFile(null);
        setAudioFile(null);
        setThumbnailFile(null);
      }, 2000);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to upload Risala');
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Upload Farameen-e-Attar</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Farameen-e-Attar uploaded successfully!
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">
                  Language
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                >
                  <option value="">Select Language</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="month">
                  Month
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                >
                  <option value="">Select Month</option>
                  {months.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
                  Year
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                >
                  <option value="">Select Year</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  placeholder="Enter description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bookletFile">
                  Booklet PDF
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="bookletFile"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setBookletFile(e.target.files?.[0] || null)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Upload PDF file of the Farameen-e-Attar booklet</p>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="audioFile">
                  Audio File
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="audioFile"
                  type="file"
                  accept=".mp3,.wav"
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Upload MP3 or WAV audio file of the Farameen-e-Attar</p>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="thumbnailFile">
                  Thumbnail Image
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="thumbnailFile"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-gray-500 mt-1">Upload JPG or PNG thumbnail image (optional)</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Farameen-e-Attar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
