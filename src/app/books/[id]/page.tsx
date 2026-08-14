'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import StaffGate from '@/components/StaffGate';
import { getBookById } from '@/lib/db';
import type { Book } from '@/lib/types';

export default function BookDetail() {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const bookData = await getBookById(id);
        if (bookData) {
          setBook(bookData);
        } else {
          setError('Book not found');
        }
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <StaffGate>
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </Layout>
      </StaffGate>
    );
  }

  if (error) {
    return (
      <StaffGate>
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </Layout>
      </StaffGate>
    );
  }

  if (!book) {
    return (
      <StaffGate>
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Book not found</p>
        </div>
      </Layout>
      </StaffGate>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">Book Details</h1>
          <button 
            onClick={() => router.push('/books')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Back to Books
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{book.title}</h2>
                  <p className="text-gray-600">by {book.author}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700">Category</h3>
                  <p className="text-gray-600">{book.category}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700">ISBN</h3>
                  <p className="text-gray-600">{book.isbn || 'Not available'}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700">Publisher</h3>
                  <p className="text-gray-600">{book.publisher || 'Not available'}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700">Publication Year</h3>
                  <p className="text-gray-600">{book.publicationYear?.toString() || 'Not available'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Availability</h3>
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Copies</p>
                      <p className="text-lg font-semibold">{book.totalCopies}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Available Copies</p>
                      <p className={`text-lg font-semibold ${
                        book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {book.availableCopies}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700">Added Date</h3>
                  <p className="text-gray-600">
                    {new Date(book.addedDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {book.description || 'No description available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 