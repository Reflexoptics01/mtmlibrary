'use client';

import { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { useRouter } from 'next/navigation';

interface RisalaItem {
  id: string;
  title: string;
  month: string;
  year: number;
  language: string;
  uploadDate: any;
  description: string;
  bookletUrl: string;
  audioUrl: string;
  thumbnailUrl: string;
  downloadCount: number;
}

export default function RisalaDetail({ params }: { params: { id: string } }) {
  const [risala, setRisala] = useState<RisalaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    // This will be connected to Firebase in the next step
    // For now, use mock data
    const mockRisala: RisalaItem = {
      id: id,
      title: 'Farameen-e-Attar - Ramadan Special',
      month: 'April',
      year: 2025,
      language: 'Urdu',
      uploadDate: new Date().toISOString(),
      description: 'Special Ramadan edition of monthly Farameen-e-Attar publication. This edition contains valuable guidance from Ameer e Ahle Sunnat about fasting, prayers, and other important aspects of Ramadan. It includes special supplications, recommended practices, and inspirational stories to enhance your spiritual experience during this blessed month.',
      bookletUrl: '/assets/sample.pdf',
      audioUrl: '/assets/sample.mp3',
      thumbnailUrl: '/assets/dawateislami_logo.png',
      downloadCount: 45
    };
    
    setRisala(mockRisala);
    setLoading(false);
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  const handleDownload = (type: 'booklet' | 'audio') => {
    if (!risala) return;
    
    // In a real implementation, this would track downloads in Firebase
    console.log(`Downloading ${type} for risala ID: ${id}`);
    
    // Simulate download count increment
    setRisala({
      ...risala,
      downloadCount: risala.downloadCount + 1
    });
    
    // Redirect to the file URL
    window.open(type === 'booklet' ? risala.bookletUrl : risala.audioUrl, '_blank');
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading publication details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !risala) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Publication not found'}
        </div>
        <button 
          onClick={() => router.push('/risala')}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
        >
          Back to Publications
        </button>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">{risala.title}</h1>
          <button 
            onClick={() => router.push('/risala')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Back to List
          </button>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center mb-6">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 mr-2">
                    {risala.language}
                  </span>
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                    {risala.month} {risala.year}
                  </span>
                </div>
                
                <p className="text-gray-500 mb-2">
                  Uploaded on: {formatDate(risala.uploadDate)}
                </p>
                
                <p className="text-gray-500">
                  Downloads: {risala.downloadCount}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleDownload('booklet')}
                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Booklet
                  </button>
                  
                  <button 
                    onClick={() => handleDownload('audio')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 017.072 0m-9.9-2.828a9 9 0 0112.728 0" />
                    </svg>
                    Listen Audio
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold text-green-800 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {risala.description}
              </p>
            </div>
            
            <div className="border-t pt-4 mt-6">
              <h2 className="text-xl font-semibold text-green-800 mb-3">Audio Player</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <audio controls className="w-full">
                  <source src={risala.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
