export type StaffRole = 'admin' | 'librarian' | 'pending';
export type LoanStatus = 'Borrowed' | 'Returned' | 'Overdue' | 'Lost';

export interface Profile {
  id: string;
  fullName: string;
  role: StaffRole;
  createdAt: string;
}

export interface Settings {
  libraryName: string;
  maxBooksPerStudent: number;
  maxBorrowDays: number;
  finePerDay: number;
  lostBookFine: number;
  currencySymbol: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  publicationYear: number | null;
  totalCopies: number;
  availableCopies: number;
  description: string;
  addedDate: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  grade: string;
  fatherName: string;
  contactNumber: string;
  address: string;
  borrowedBooks: number;
  finesDue: number;
  registrationDate: string;
}

export interface Borrowing {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: LoanStatus;
  fineAmount: number;
}

export interface Publication {
  id: string;
  title: string;
  month: string;
  year: number;
  language: string;
  description: string;
  bookletUrl: string;
  audioUrl: string;
  thumbnailUrl: string;
  downloadCount: number;
  uploadDate: string;
}

export const BOOK_CATEGORIES = [
  'Qur’an and Tafsir',
  'Hadith',
  'Fiqh',
  'Seerah',
  'Aqidah',
  'Arabic',
  'Islamic Studies',
  'History',
  'Biography',
  'Literature',
  'Science',
  'Reference',
  'Children',
  'Textbooks',
  'Other',
];

export const PUBLICATION_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const PUBLICATION_LANGUAGES = ['Urdu', 'Arabic', 'English', 'Hindi', 'Bengali', 'Other'];

export function publicationYears(): number[] {
  const current = new Date().getFullYear();
  return Array.from({ length: 8 }, (_, i) => current - i);
}

export function displayLoanStatus(loan: Pick<Borrowing, 'status' | 'dueDate'>): LoanStatus {
  if (loan.status === 'Borrowed' && new Date(loan.dueDate) < new Date(new Date().toDateString())) {
    return 'Overdue';
  }
  return loan.status;
}
