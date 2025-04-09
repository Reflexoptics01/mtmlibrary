'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';

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

export default function Risala() {
  const [risalaItems, setRisalaItems] = useState<RisalaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<number | ''>('');
  const [languageFilter, setLanguageFilter] = useState('');
  
  // Mock years and languages for now - will be dynamically loaded later
  const years = [2025, 2024, 2023, 2022, 2021];
  const languages = ['Urdu', 'Hindi', 'English'];

  useEffect(() => {
    // This will be connected to Firebase in the next step
    // For now, use mock data
    const mockRisala: RisalaItem[] = [
      {
        id: '1',
        title: 'Farameen-e-Attar - Ramadan Special',
        month: 'April',
        year: 2025,
        language: 'Urdu',
        uploadDate: new Date().toISOString(),
        description: 'Special Ramadan edition of monthly Farameen-e-Attar publication',
        bookletUrl: '/assets/sample.pdf',
        audioUrl: '/assets/sample.mp3',
        thumbnailUrl: '/assets/dawateislami_logo.png',
        downloadCount: 45
      },
      {
        id: '2',
        title: 'Farameen-e-Attar - Rajab Edition',
        month: 'March',
        year: 2025,
        language: 'Urdu',
        uploadDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
        description: 'Monthly Farameen-e-Attar publication for Rajab',
        bookletUrl: '/assets/sample.pdf',
        audioUrl: '/assets/sample.mp3',
        thumbnailUrl: '/assets/dawateislami_logo.png',
        downloadCount: 32
      },
      {
        id: '3',
        title: 'Farameen-e-Attar - Jamadi-ul-Akhir Edition',
        month: 'February',
        year: 2025,
        language: 'Hindi',
        uploadDate: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString(),
        description: 'Monthly Farameen-e-Attar publication for Jamadi-ul-Akhir',
        bookletUrl: '/assets/sample.pdf',
        audioUrl: '/assets/sample.mp3',
        thumbnailUrl: '/assets/dawateislami_logo.png',
        downloadCount: 28
      },
    ];
    
    setRisalaItems(mockRisala);
    setLoading(false);
  }, []);

  const filteredRisala = risalaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = yearFilter === '' || item.year === yearFilter;
    const matchesLanguage = languageFilter === '' || item.language === languageFilter;
    return matchesSearch && matchesYear && matchesLanguage;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Farameen-e-Attar Publications</h1>
        
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search publications..."
              className="px-4 py-2 border rounded-md w-full md:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              className="px-4 py-2 border rounded-md"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value ? parseInt(e.target.value) : '')}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <select
              className="px-4 py-2 border rounded-md"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
            >
              <option value="">All Languages</option>
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
            
            <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md">
              Upload New Risala
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading publications...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRisala.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No publications found matching your criteria</p>
              </div>
            ) : (
              filteredRisala.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-green-800 mb-2">{item.title}</h2>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {item.language}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">
                      {item.month} {item.year}
                    </p>
                    
                    <p className="text-gray-700 mb-4">
                      {item.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>Uploaded: {formatDate(item.uploadDate)}</span>
                      <span>{item.downloadCount} downloads</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <a 
                        href={item.bookletUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Download Booklet
                      </a>
                      
                      <a 
                        href={item.audioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Listen Audio
                      </a>
                    </div>
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
