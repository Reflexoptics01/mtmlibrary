import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// Define interfaces for database objects
interface Book {
  id?: string;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  publisher?: string;
  publicationYear?: number | null;
  totalCopies: number;
  availableCopies: number;
  description?: string;
  addedDate: string;
}

interface Student {
  id?: string;
  name: string;
  rollNumber: string;
  grade: string;
  fatherName: string;
  contactNumber: string;
  address?: string;
  borrowedBooks: number;
  finesDue: number;
}

interface Borrowing {
  id?: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'Borrowed' | 'Returned' | 'Overdue' | 'Lost';
}

interface Risala {
  id?: string;
  title: string;
  issueDate: string;
  description?: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
}

// Books collection operations
export const addBook = async (bookData: Omit<Book, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'books'), {
      ...bookData,
      addedDate: new Date().toISOString(),
    });
    return { id: docRef.id, ...bookData };
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

export const getAllBooks = async (): Promise<Book[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'books'));
    const books: Book[] = [];
    querySnapshot.forEach((doc) => {
      books.push({ id: doc.id, ...doc.data() } as Book);
    });
    return books;
  } catch (error) {
    console.error('Error getting books:', error);
    throw error;
  }
};

export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    const docRef = doc(db, 'books', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Book;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting book:', error);
    throw error;
  }
};

export const updateBook = async (id: string, bookData: Partial<Book>) => {
  try {
    const docRef = doc(db, 'books', id);
    await updateDoc(docRef, {
      ...bookData,
    });
    return { id, ...bookData };
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

export const deleteBook = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'books', id));
    return id;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

// Students collection operations
export const addStudent = async (studentData: Omit<Student, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      borrowedBooks: 0,
      finesDue: 0
    });
    return { id: docRef.id, ...studentData };
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'students'));
    const students: Student[] = [];
    querySnapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() } as Student);
    });
    return students;
  } catch (error) {
    console.error('Error getting students:', error);
    throw error;
  }
};

export const getStudentById = async (id: string): Promise<Student | null> => {
  try {
    const docRef = doc(db, 'students', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Student;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting student:', error);
    throw error;
  }
};

export const updateStudent = async (id: string, studentData: Partial<Student>) => {
  try {
    const docRef = doc(db, 'students', id);
    await updateDoc(docRef, {
      ...studentData,
    });
    return { id, ...studentData };
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const deleteStudent = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'students', id));
    return id;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

// Borrowings collection operations
export const addBorrowing = async (borrowingData: Omit<Borrowing, 'id'>) => {
  try {
    // Convert string dates to Firestore Timestamps
    const processedData = {
      ...borrowingData,
      borrowDate: borrowingData.borrowDate,
      dueDate: borrowingData.dueDate,
      returnDate: borrowingData.returnDate,
    };
    
    const docRef = await addDoc(collection(db, 'borrowings'), processedData);
    return { id: docRef.id, ...borrowingData };
  } catch (error) {
    console.error('Error adding borrowing:', error);
    throw error;
  }
};

export const getAllBorrowings = async (): Promise<Borrowing[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'borrowings'));
    const borrowings: Borrowing[] = [];
    querySnapshot.forEach((doc) => {
      // Convert Firestore Timestamps back to strings for frontend
      const data = doc.data();
      borrowings.push({
        id: doc.id,
        ...data,
        borrowDate: data.borrowDate, 
        dueDate: data.dueDate,
        returnDate: data.returnDate,
      } as Borrowing);
    });
    return borrowings;
  } catch (error) {
    console.error('Error getting borrowings:', error);
    throw error;
  }
};

export const getBorrowingById = async (id: string): Promise<Borrowing | null> => {
  try {
    const docRef = doc(db, 'borrowings', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Convert Firestore Timestamps back to strings for frontend
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        borrowDate: data.borrowDate,
        dueDate: data.dueDate,
        returnDate: data.returnDate,
      } as Borrowing;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting borrowing:', error);
    throw error;
  }
};

export const updateBorrowing = async (id: string, borrowingData: Partial<Borrowing>) => {
  try {
    const docRef = doc(db, 'borrowings', id);
    
    // Prepare data for Firestore update
    const updateData = { ...borrowingData };
    
    await updateDoc(docRef, updateData);
    return { id, ...borrowingData };
  } catch (error) {
    console.error('Error updating borrowing:', error);
    throw error;
  }
};

export const deleteBorrowing = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'borrowings', id));
    return id;
  } catch (error) {
    console.error('Error deleting borrowing:', error);
    throw error;
  }
};

// Risala collection operations
export const addRisala = async (risalaData: Omit<Risala, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'risala'), {
      ...risalaData,
      uploadDate: new Date().toISOString(),
    });
    return { id: docRef.id, ...risalaData };
  } catch (error) {
    console.error('Error adding risala:', error);
    throw error;
  }
};

export const getAllRisala = async (): Promise<Risala[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'risala'));
    const risalaList: Risala[] = [];
    querySnapshot.forEach((doc) => {
      risalaList.push({ id: doc.id, ...doc.data() } as Risala);
    });
    return risalaList;
  } catch (error) {
    console.error('Error getting risala:', error);
    throw error;
  }
};

export const getRisalaById = async (id: string): Promise<Risala | null> => {
  try {
    const docRef = doc(db, 'risala', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Risala;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting risala:', error);
    throw error;
  }
};

export const updateRisala = async (id: string, risalaData: Partial<Risala>) => {
  try {
    const docRef = doc(db, 'risala', id);
    
    await updateDoc(docRef, {
      ...risalaData,
    });
    return { id, ...risalaData };
  } catch (error) {
    console.error('Error updating risala:', error);
    throw error;
  }
};

export const deleteRisala = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'risala', id));
    return id;
  } catch (error) {
    console.error('Error deleting risala:', error);
    throw error;
  }
}; 