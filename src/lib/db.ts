import { getSupabase } from './supabase';
import {
  displayLoanStatus,
  type Book,
  type Borrowing,
  type Profile,
  type Publication,
  type Settings,
  type StaffRole,
  type Student,
} from './types';

function throwIfError(error: { message: string } | null) {
  if (error) {
    throw new Error(error.message);
  }
}

function mapBook(row: Record<string, unknown>): Book {
  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    author: String(row.author ?? ''),
    isbn: String(row.isbn ?? ''),
    category: String(row.category ?? ''),
    publisher: String(row.publisher ?? ''),
    publicationYear: (row.publication_year as number | null) ?? null,
    totalCopies: Number(row.total_copies ?? 0),
    availableCopies: Number(row.available_copies ?? 0),
    description: String(row.description ?? ''),
    addedDate: String(row.created_at ?? ''),
  };
}

function mapStudent(row: Record<string, unknown>): Student {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    rollNumber: String(row.roll_number ?? ''),
    grade: String(row.grade ?? ''),
    fatherName: String(row.father_name ?? ''),
    contactNumber: String(row.contact_number ?? ''),
    address: String(row.address ?? ''),
    borrowedBooks: Number(row.borrowed_books ?? 0),
    finesDue: Number(row.fines_due ?? 0),
    registrationDate: String(row.created_at ?? ''),
  };
}

function mapBorrowing(row: Record<string, unknown>): Borrowing {
  const mapped: Borrowing = {
    id: String(row.id),
    bookId: String(row.book_id),
    bookTitle: String(row.book_title ?? ''),
    studentId: String(row.student_id),
    studentName: String(row.student_name ?? ''),
    borrowDate: String(row.borrow_date ?? ''),
    dueDate: String(row.due_date ?? ''),
    returnDate: row.return_date ? String(row.return_date) : null,
    status: (row.status as Borrowing['status']) ?? 'Borrowed',
    fineAmount: Number(row.fine_amount ?? 0),
  };
  return { ...mapped, status: displayLoanStatus(mapped) };
}

function mapPublication(row: Record<string, unknown>): Publication {
  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    month: String(row.month ?? ''),
    year: Number(row.year ?? 0),
    language: String(row.language ?? ''),
    description: String(row.description ?? ''),
    bookletUrl: String(row.booklet_url ?? ''),
    audioUrl: String(row.audio_url ?? ''),
    thumbnailUrl: String(row.thumbnail_url ?? ''),
    downloadCount: Number(row.download_count ?? 0),
    uploadDate: String(row.created_at ?? ''),
  };
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await getSupabase()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  throwIfError(error);
  if (!data) return null;
  return {
    id: data.id,
    fullName: data.full_name ?? '',
    role: data.role as StaffRole,
    createdAt: data.created_at,
  };
}

export async function getSettings(): Promise<Settings> {
  const { data, error } = await getSupabase().from('settings').select('*').eq('id', 1).maybeSingle();
  throwIfError(error);
  return {
    libraryName: data?.library_name ?? 'Maktaba',
    maxBooksPerStudent: Number(data?.max_books_per_student ?? 3),
    maxBorrowDays: Number(data?.max_borrow_days ?? 14),
    finePerDay: Number(data?.fine_per_day ?? 5),
    lostBookFine: Number(data?.lost_book_fine ?? 500),
    currencySymbol: data?.currency_symbol ?? '₹',
  };
}

export async function getAllBooks(): Promise<Book[]> {
  const { data, error } = await getSupabase().from('books').select('*').order('title');
  throwIfError(error);
  return (data ?? []).map(mapBook);
}

export async function getBookById(id: string): Promise<Book | null> {
  const { data, error } = await getSupabase().from('books').select('*').eq('id', id).maybeSingle();
  throwIfError(error);
  return data ? mapBook(data) : null;
}

export async function addBook(book: Omit<Book, 'id' | 'addedDate' | 'availableCopies'> & { availableCopies?: number }) {
  const total = Number(book.totalCopies);
  if (!Number.isFinite(total) || total < 1) {
    throw new Error('Quantity must be at least 1');
  }
  const { error } = await getSupabase().from('books').insert({
    title: book.title.trim(),
    author: book.author.trim(),
    isbn: book.isbn || null,
    category: book.category,
    publisher: book.publisher || null,
    publication_year: book.publicationYear,
    total_copies: total,
    available_copies: total,
    description: book.description || null,
  });
  throwIfError(error);
}

export async function updateBook(id: string, book: Partial<Book>) {
  const payload: Record<string, unknown> = {};
  if (book.title !== undefined) payload.title = book.title.trim();
  if (book.author !== undefined) payload.author = book.author.trim();
  if (book.isbn !== undefined) payload.isbn = book.isbn || null;
  if (book.category !== undefined) payload.category = book.category;
  if (book.publisher !== undefined) payload.publisher = book.publisher || null;
  if (book.publicationYear !== undefined) payload.publication_year = book.publicationYear;
  if (book.totalCopies !== undefined) payload.total_copies = book.totalCopies;
  if (book.availableCopies !== undefined) payload.available_copies = book.availableCopies;
  if (book.description !== undefined) payload.description = book.description || null;

  if (
    book.totalCopies !== undefined &&
    book.availableCopies !== undefined &&
    book.availableCopies > book.totalCopies
  ) {
    throw new Error('Available copies cannot exceed total copies');
  }

  const { error } = await getSupabase().from('books').update(payload).eq('id', id);
  throwIfError(error);
}

export async function deleteBook(id: string) {
  const { count, error: countError } = await getSupabase()
    .from('borrowings')
    .select('id', { count: 'exact', head: true })
    .eq('book_id', id);
  throwIfError(countError);
  if ((count ?? 0) > 0) {
    throw new Error('Cannot delete a book that has borrowing history');
  }
  const { error } = await getSupabase().from('books').delete().eq('id', id);
  throwIfError(error);
}

export async function getAllStudents(): Promise<Student[]> {
  const { data, error } = await getSupabase().from('students').select('*').order('name');
  throwIfError(error);
  return (data ?? []).map(mapStudent);
}

export async function getStudentById(id: string): Promise<Student | null> {
  const { data, error } = await getSupabase().from('students').select('*').eq('id', id).maybeSingle();
  throwIfError(error);
  return data ? mapStudent(data) : null;
}

export async function addStudent(student: Omit<Student, 'id' | 'borrowedBooks' | 'finesDue' | 'registrationDate'>) {
  const { error } = await getSupabase().from('students').insert({
    name: student.name.trim(),
    roll_number: student.rollNumber.trim(),
    grade: student.grade.trim(),
    father_name: student.fatherName.trim(),
    contact_number: student.contactNumber.trim(),
    address: student.address?.trim() || null,
  });
  throwIfError(error);
}

export async function updateStudent(id: string, student: Partial<Student>) {
  const payload: Record<string, unknown> = {};
  if (student.name !== undefined) payload.name = student.name.trim();
  if (student.rollNumber !== undefined) payload.roll_number = student.rollNumber.trim();
  if (student.grade !== undefined) payload.grade = student.grade.trim();
  if (student.fatherName !== undefined) payload.father_name = student.fatherName.trim();
  if (student.contactNumber !== undefined) payload.contact_number = student.contactNumber.trim();
  if (student.address !== undefined) payload.address = student.address.trim();
  const { error } = await getSupabase().from('students').update(payload).eq('id', id);
  throwIfError(error);
}

export async function deleteStudent(id: string) {
  const student = await getStudentById(id);
  if (student && student.finesDue > 0) {
    throw new Error('Cannot delete a student with unpaid fines');
  }
  const { count, error: countError } = await getSupabase()
    .from('borrowings')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', id)
    .eq('status', 'Borrowed');
  throwIfError(countError);
  if ((count ?? 0) > 0) {
    throw new Error('Cannot delete a student who still has books on loan');
  }
  const { error } = await getSupabase().from('students').delete().eq('id', id);
  throwIfError(error);
}

export async function getAllBorrowings(): Promise<Borrowing[]> {
  const { data, error } = await getSupabase()
    .from('borrowings')
    .select('*')
    .order('borrow_date', { ascending: false });
  throwIfError(error);
  return (data ?? []).map(mapBorrowing);
}

export async function getBorrowingById(id: string): Promise<Borrowing | null> {
  const { data, error } = await getSupabase().from('borrowings').select('*').eq('id', id).maybeSingle();
  throwIfError(error);
  return data ? mapBorrowing(data) : null;
}

export async function getActiveBorrowingsForStudent(studentId: string): Promise<Borrowing[]> {
  const { data, error } = await getSupabase()
    .from('borrowings')
    .select('*')
    .eq('student_id', studentId)
    .eq('status', 'Borrowed')
    .order('due_date');
  throwIfError(error);
  return (data ?? []).map(mapBorrowing);
}

export async function issueBook(bookId: string, studentId: string, durationDays: number): Promise<string> {
  const { data, error } = await getSupabase().rpc('issue_book', {
    p_book_id: bookId,
    p_student_id: studentId,
    p_duration_days: durationDays,
  });
  throwIfError(error);
  return String(data);
}

export async function returnBook(borrowingId: string): Promise<number> {
  const { data, error } = await getSupabase().rpc('return_book', { p_borrowing_id: borrowingId });
  throwIfError(error);
  return Number(data ?? 0);
}

export async function markBookLost(borrowingId: string): Promise<number> {
  const { data, error } = await getSupabase().rpc('mark_book_lost', { p_borrowing_id: borrowingId });
  throwIfError(error);
  return Number(data ?? 0);
}

export async function payStudentFine(studentId: string, amount: number): Promise<number> {
  const { data, error } = await getSupabase().rpc('pay_student_fine', {
    p_student_id: studentId,
    p_amount: amount,
  });
  throwIfError(error);
  return Number(data ?? 0);
}

export async function getAllPublications(): Promise<Publication[]> {
  const { data, error } = await getSupabase()
    .from('publications')
    .select('*')
    .order('year', { ascending: false });
  throwIfError(error);
  return (data ?? []).map(mapPublication);
}

export async function getPublicationById(id: string): Promise<Publication | null> {
  const { data, error } = await getSupabase().from('publications').select('*').eq('id', id).maybeSingle();
  throwIfError(error);
  return data ? mapPublication(data) : null;
}

export async function addPublication(pub: Omit<Publication, 'id' | 'downloadCount' | 'uploadDate'>) {
  const { error } = await getSupabase().from('publications').insert({
    title: pub.title.trim(),
    month: pub.month,
    year: pub.year,
    language: pub.language,
    description: pub.description.trim(),
    booklet_url: pub.bookletUrl || null,
    audio_url: pub.audioUrl || null,
    thumbnail_url: pub.thumbnailUrl || null,
  });
  throwIfError(error);
}

export async function deletePublication(id: string) {
  const { error } = await getSupabase().from('publications').delete().eq('id', id);
  throwIfError(error);
}

export async function incrementDownload(id: string) {
  const { error } = await getSupabase().rpc('increment_download', { p_publication_id: id });
  throwIfError(error);
}

export async function uploadPublicationFile(path: string, file: File): Promise<string> {
  const supabase = getSupabase();
  const { error } = await supabase.storage.from('publications').upload(path, file, { upsert: false });
  throwIfError(error);
  const { data } = supabase.storage.from('publications').getPublicUrl(path);
  return data.publicUrl;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await getSupabase().from('profiles').select('*').order('created_at');
  throwIfError(error);
  return (data ?? []).map((row) => ({
    id: row.id,
    fullName: row.full_name ?? '',
    role: row.role as StaffRole,
    createdAt: row.created_at,
  }));
}

export async function updateProfileRole(id: string, role: StaffRole) {
  const { error } = await getSupabase().from('profiles').update({ role }).eq('id', id);
  throwIfError(error);
}

export async function getDashboardStats() {
  const [books, students, borrowings, publications] = await Promise.all([
    getAllBooks(),
    getAllStudents(),
    getAllBorrowings(),
    getAllPublications(),
  ]);
  const current = borrowings.filter((b) => b.status === 'Borrowed' || b.status === 'Overdue');
  const overdue = borrowings.filter((b) => b.status === 'Overdue');
  return {
    totalBooks: books.length,
    registeredStudents: students.length,
    currentBorrowings: current.length,
    overdueItems: overdue.length,
    publications: publications.length,
  };
}

export async function getPublicStats() {
  const { count, error } = await getSupabase()
    .from('publications')
    .select('id', { count: 'exact', head: true });
  throwIfError(error);
  return { publications: count ?? 0 };
}
