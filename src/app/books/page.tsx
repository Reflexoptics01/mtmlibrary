'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { deleteBook, getAllBooks } from '@/lib/db';
import type { Book } from '@/lib/types';
import { BOOK_CATEGORIES } from '@/lib/types';
import StaffGate from '@/components/StaffGate';

function BooksStaffView() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const router = useRouter();

  const loadBooks = async () => {
    try {
      setLoading(true);
      setBooks(await getAllBooks());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
    const matchesCategory = filterCategory === '' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteBook = async (id: string) => {
    if (!window.confirm('Delete this book? Active loans will block deletion.')) return;
    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete book');
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <input
          type="text"
          placeholder="Search books by title or author..."
          className="px-4 py-2 border rounded-md w-full md:w-80 mb-4 md:mb-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex space-x-2">
          <select className="px-4 py-2 border rounded-md" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {BOOK_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md" onClick={() => router.push('/books/add')}>
            Add New Book
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 py-8">Loading books...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Title', 'Author', 'Category', 'Copies', 'Available', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No books found</td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{book.author}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">{book.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{book.totalCopies}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${book.availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {book.availableCopies}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => router.push(`/books/${book.id}`)}>View</button>
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={() => router.push(`/books/edit/${book.id}`)}>Edit</button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteBook(book.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function Books() {
  const { isStaff, loading } = useAuth();

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Book Management</h1>
        {loading ? (
          <p className="text-center text-gray-600 py-8">Loading...</p>
        ) : isStaff ? (
          <BooksStaffView />
        ) : (
          <div className="mt-8">
            <div className="bg-green-50 p-6 rounded-lg shadow border border-green-200 mb-6">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Welcome to Maktaba</h2>
              <p className="text-gray-700 mb-4">
                Please <Link href="/auth/login" className="text-green-600 hover:underline">log in</Link> to manage the catalog.
              </p>
              <Link href="/risala" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md">
                View Publications
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Typical collections</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Qur’an and Tafsir', 'Hadith and Seerah', 'Fiqh and Arabic'].map((title) => (
                  <div key={title} className="border rounded-md p-4">
                    <h4 className="font-semibold text-green-700">{title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
