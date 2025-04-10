'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../../components/layout/Layout';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  publicationYear: string;
  totalCopies: number;
  availableCopies: number;
  description: string;
}

// Using a simpler approach to avoid type conflicts
export default function EditBook({ params }: any) {
  const [book, setBook] = useState<Book>({
    id: '',
    title: '',
    author: '',
    isbn: '',
    category: '',
    publisher: '',
    publicationYear: '',
    totalCopies: 0,
    availableCopies: 0,
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    // This would normally fetch book data from Firebase
    // For now, use mock data
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockBook: Book = {
        id,
        title: 'Faizane Sunnat',
        author: 'Ameer e Ahle Sunnat',
        isbn: '9781234567897',
        category: 'Islamic',
        publisher: 'Dawat-e-Islami',
        publicationYear: '2018',
        totalCopies: 5,
        availableCopies: 3,
        description: 'A comprehensive guide to Sunnah practices.'
      };
      
      setBook(mockBook);
      setLoading(false);
    }, 500);
  }, [id]);

  const categories = [
    'Fiction',
    'Non-fiction',
    'Science',
    'History',
    'Biography',
    'Religion',
    'Philosophy',
    'Self-help',
    'Reference',
    'Islamic Studies',
    'Islamic',
    'Arabic Literature',
    "Children's Books",
    'Textbooks',
    'Other'
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!book.title.trim()) {
      newErrors.title = 'Book title is required';
    }
    
    if (!book.author.trim()) {
      newErrors.author = 'Author name is required';
    }
    
    if (!book.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (book.totalCopies < 0) {
      newErrors.totalCopies = 'Total copies cannot be negative';
    }
    
    if (book.availableCopies < 0) {
      newErrors.availableCopies = 'Available copies cannot be negative';
    }
    
    if (book.availableCopies > book.totalCopies) {
      newErrors.availableCopies = 'Available copies cannot exceed total copies';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // This would normally update the book data in Firebase
      // For now, just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSuccess('Book updated successfully');
      
      // Redirect to book details page after a brief delay
      setTimeout(() => {
        router.push(`/books`);
      }, 1500);
    } catch (err) {
      setError('Failed to update book. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (name === 'totalCopies' || name === 'availableCopies') {
      setBook(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setBook(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear the error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">Edit Book</h1>
          <button 
            onClick={() => router.push(`/books`)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Book Title<span className="text-red-600">*</span>
                  </label>
                  <input
                    className={`shadow appearance-none border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Book Title"
                    value={book.title}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
                    Author<span className="text-red-600">*</span>
                  </label>
                  <input
                    className={`shadow appearance-none border ${errors.author ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    id="author"
                    name="author"
                    type="text"
                    placeholder="Author"
                    value={book.author}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.author && <p className="text-red-500 text-xs italic mt-1">{errors.author}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isbn">
                    ISBN
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="isbn"
                    name="isbn"
                    type="text"
                    placeholder="ISBN"
                    value={book.isbn}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                    Category<span className="text-red-600">*</span>
                  </label>
                  <select
                    className={`shadow appearance-none border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    id="category"
                    name="category"
                    value={book.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs italic mt-1">{errors.category}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publisher">
                    Publisher
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="publisher"
                    name="publisher"
                    type="text"
                    placeholder="Publisher"
                    value={book.publisher}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publicationYear">
                    Publication Year
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="publicationYear"
                    name="publicationYear"
                    type="number"
                    placeholder="Publication Year"
                    value={book.publicationYear}
                    onChange={handleInputChange}
                    min="1900"
                    max={new Date().getFullYear().toString()}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalCopies">
                    Total Copies<span className="text-red-600">*</span>
                  </label>
                  <input
                    className={`shadow appearance-none border ${errors.totalCopies ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    id="totalCopies"
                    name="totalCopies"
                    type="number"
                    placeholder="Total Copies"
                    value={book.totalCopies}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                  {errors.totalCopies && <p className="text-red-500 text-xs italic mt-1">{errors.totalCopies}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="availableCopies">
                    Available Copies<span className="text-red-600">*</span>
                  </label>
                  <input
                    className={`shadow appearance-none border ${errors.availableCopies ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    id="availableCopies"
                    name="availableCopies"
                    type="number"
                    placeholder="Available Copies"
                    value={book.availableCopies}
                    onChange={handleInputChange}
                    min="0"
                    max={book.totalCopies.toString()}
                    required
                  />
                  {errors.availableCopies && <p className="text-red-500 text-xs italic mt-1">{errors.availableCopies}</p>}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  name="description"
                  placeholder="Book Description"
                  value={book.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              
              <div className="flex items-center justify-end">
                <button
                  className={`bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Updating Book...' : 'Update Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
} 