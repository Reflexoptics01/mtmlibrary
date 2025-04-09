// Firebase initialization and utility functions for Madersatul Madina Library Management App

import { db, storage, auth } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';

// Book Management Functions
export const addBook = async (bookData) => {
  try {
    const bookWithTimestamp = {
      ...bookData,
      addedDate: serverTimestamp(),
      availableCopies: bookData.totalCopies
    };
    const docRef = await addDoc(collection(db, "books"), bookWithTimestamp);
    return { id: docRef.id, ...bookWithTimestamp };
  } catch (error) {
    console.error("Error adding book: ", error);
    throw error;
  }
};

export const getBooks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "books"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting books: ", error);
    throw error;
  }
};

export const getBookById = async (bookId) => {
  try {
    const docRef = doc(db, "books", bookId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Book not found");
    }
  } catch (error) {
    console.error("Error getting book: ", error);
    throw error;
  }
};

export const updateBook = async (bookId, bookData) => {
  try {
    const bookRef = doc(db, "books", bookId);
    await updateDoc(bookRef, bookData);
    return { id: bookId, ...bookData };
  } catch (error) {
    console.error("Error updating book: ", error);
    throw error;
  }
};

export const deleteBook = async (bookId) => {
  try {
    await deleteDoc(doc(db, "books", bookId));
    return bookId;
  } catch (error) {
    console.error("Error deleting book: ", error);
    throw error;
  }
};

// Student Management Functions
export const addStudent = async (studentData) => {
  try {
    const studentWithTimestamp = {
      ...studentData,
      registrationDate: serverTimestamp(),
      borrowedBooks: 0,
      totalBorrowed: 0,
      finesDue: 0,
      finesPaid: 0
    };
    const docRef = await addDoc(collection(db, "students"), studentWithTimestamp);
    return { id: docRef.id, ...studentWithTimestamp };
  } catch (error) {
    console.error("Error adding student: ", error);
    throw error;
  }
};

export const getStudents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "students"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting students: ", error);
    throw error;
  }
};

export const getStudentById = async (studentId) => {
  try {
    const docRef = doc(db, "students", studentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Student not found");
    }
  } catch (error) {
    console.error("Error getting student: ", error);
    throw error;
  }
};

export const updateStudent = async (studentId, studentData) => {
  try {
    const studentRef = doc(db, "students", studentId);
    await updateDoc(studentRef, studentData);
    return { id: studentId, ...studentData };
  } catch (error) {
    console.error("Error updating student: ", error);
    throw error;
  }
};

export const deleteStudent = async (studentId) => {
  try {
    await deleteDoc(doc(db, "students", studentId));
    return studentId;
  } catch (error) {
    console.error("Error deleting student: ", error);
    throw error;
  }
};

// Borrowing Management Functions
export const borrowBook = async (bookId, studentId, dueDate) => {
  try {
    // Get book and student data
    const bookDoc = await getBookById(bookId);
    const studentDoc = await getStudentById(studentId);
    
    // Check if book is available
    if (bookDoc.availableCopies <= 0) {
      throw new Error("Book is not available for borrowing");
    }
    
    // Create borrowing record
    const borrowingData = {
      bookId,
      bookTitle: bookDoc.title,
      studentId,
      studentName: studentDoc.name,
      borrowDate: serverTimestamp(),
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      returnDate: null,
      status: "Borrowed",
      fineAmount: 0,
      finePaid: false,
      finePaymentDate: null,
      renewalCount: 0,
      notes: ""
    };
    
    const docRef = await addDoc(collection(db, "borrowings"), borrowingData);
    
    // Update book available copies
    await updateDoc(doc(db, "books", bookId), {
      availableCopies: bookDoc.availableCopies - 1
    });
    
    // Update student borrowed books count
    await updateDoc(doc(db, "students", studentId), {
      borrowedBooks: studentDoc.borrowedBooks + 1,
      totalBorrowed: studentDoc.totalBorrowed + 1
    });
    
    return { id: docRef.id, ...borrowingData };
  } catch (error) {
    console.error("Error borrowing book: ", error);
    throw error;
  }
};

export const returnBook = async (borrowingId, returnDate = new Date()) => {
  try {
    // Get borrowing record
    const borrowingRef = doc(db, "borrowings", borrowingId);
    const borrowingSnap = await getDoc(borrowingRef);
    
    if (!borrowingSnap.exists()) {
      throw new Error("Borrowing record not found");
    }
    
    const borrowingData = borrowingSnap.data();
    
    // Calculate fine if returned late
    const returnTimestamp = Timestamp.fromDate(new Date(returnDate));
    const dueDate = borrowingData.dueDate.toDate();
    const returnDateObj = returnTimestamp.toDate();
    
    let fineAmount = 0;
    if (returnDateObj > dueDate) {
      // Get fine per day from settings
      const settingsSnap = await getDoc(doc(db, "settings", "singleton"));
      const finePerDay = settingsSnap.exists() ? settingsSnap.data().finePerDay : 1;
      
      // Calculate days late
      const daysLate = Math.ceil((returnDateObj - dueDate) / (1000 * 60 * 60 * 24));
      fineAmount = daysLate * finePerDay;
    }
    
    // Update borrowing record
    await updateDoc(borrowingRef, {
      returnDate: returnTimestamp,
      status: "Returned",
      fineAmount
    });
    
    // Update book available copies
    const bookRef = doc(db, "books", borrowingData.bookId);
    const bookSnap = await getDoc(bookRef);
    if (bookSnap.exists()) {
      await updateDoc(bookRef, {
        availableCopies: bookSnap.data().availableCopies + 1
      });
    }
    
    // Update student borrowed books count and fines due
    const studentRef = doc(db, "students", borrowingData.studentId);
    const studentSnap = await getDoc(studentRef);
    if (studentSnap.exists()) {
      const studentData = studentSnap.data();
      await updateDoc(studentRef, {
        borrowedBooks: Math.max(0, studentData.borrowedBooks - 1),
        finesDue: studentData.finesDue + fineAmount
      });
    }
    
    return {
      id: borrowingId,
      ...borrowingData,
      returnDate: returnTimestamp,
      status: "Returned",
      fineAmount
    };
  } catch (error) {
    console.error("Error returning book: ", error);
    throw error;
  }
};

export const payFine = async (borrowingId) => {
  try {
    // Get borrowing record
    const borrowingRef = doc(db, "borrowings", borrowingId);
    const borrowingSnap = await getDoc(borrowingRef);
    
    if (!borrowingSnap.exists()) {
      throw new Error("Borrowing record not found");
    }
    
    const borrowingData = borrowingSnap.data();
    
    // Update borrowing record
    await updateDoc(borrowingRef, {
      finePaid: true,
      finePaymentDate: serverTimestamp()
    });
    
    // Update student fines
    const studentRef = doc(db, "students", borrowingData.studentId);
    const studentSnap = await getDoc(studentRef);
    if (studentSnap.exists()) {
      const studentData = studentSnap.data();
      await updateDoc(studentRef, {
        finesDue: Math.max(0, studentData.finesDue - borrowingData.fineAmount),
        finesPaid: studentData.finesPaid + borrowingData.fineAmount
      });
    }
    
    return {
      id: borrowingId,
      ...borrowingData,
      finePaid: true,
      finePaymentDate: serverTimestamp()
    };
  } catch (error) {
    console.error("Error paying fine: ", error);
    throw error;
  }
};

export const getBorrowings = async (status = null) => {
  try {
    let q;
    if (status) {
      q = query(collection(db, "borrowings"), where("status", "==", status));
    } else {
      q = collection(db, "borrowings");
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting borrowings: ", error);
    throw error;
  }
};

export const getStudentBorrowings = async (studentId) => {
  try {
    const q = query(
      collection(db, "borrowings"), 
      where("studentId", "==", studentId),
      orderBy("borrowDate", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting student borrowings: ", error);
    throw error;
  }
};

// Risala Management Functions
export const uploadRisala = async (risalaData, bookletFile, audioFile, thumbnailFile) => {
  try {
    // Upload files to storage
    let bookletUrl = "";
    let audioUrl = "";
    let thumbnailUrl = "";
    
    if (bookletFile) {
      const bookletRef = ref(storage, `risala/${risalaData.year}/${risalaData.month}/${bookletFile.name}`);
      await uploadBytes(bookletRef, bookletFile);
      bookletUrl = await getDownloadURL(bookletRef);
    }
    
    if (audioFile) {
      const audioRef = ref(storage, `risala/${risalaData.year}/${risalaData.month}/${audioFile.name}`);
      await uploadBytes(audioRef, audioFile);
      audioUrl = await getDownloadURL(audioRef);
    }
    
    if (thumbnailFile) {
      const thumbnailRef = ref(storage, `risala/thumbnails/${risalaData.year}/${risalaData.month}/${thumbnailFile.name}`);
      await uploadBytes(thumbnailRef, thumbnailFile);
      thumbnailUrl = await getDownloadURL(thumbnailRef);
    }
    
    // Create Risala document
    const risalaWithUrls = {
      ...risalaData,
      bookletUrl,
      audioUrl,
      thumbnailUrl,
      uploadDate: serverTimestamp(),
      downloadCount: 0
    };
    
    const docRef = await addDoc(collection(db, "risala"), risalaWithUrls);
    return { id: docRef.id, ...risalaWithUrls };
  } catch (error) {
    console.error("Error uploading risala: ", error);
    throw error;
  }
};

export const getRisalaList = async (limit = 20) => {
  try {
    const q = query(
      collection(db, "risala"),
      orderBy("uploadDate", "desc"),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting risala list: ", error);
    throw error;
  }
};

export const getRisalaByYearMonth = async (year, month) => {
  try {
    const q = query(
      collection(db, "risala"),
      where("year", "==", year),
      where("month", "==", month)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting risala by year/month: ", error);
    throw error;
  }
};

export const incrementRisalaDownloadCount = async (risalaId) => {
  try {
    const risalaRef = doc(db, "risala", risalaId);
    const risalaSnap = await getDoc(risalaRef);
    
    if (!risalaSnap.exists()) {
      throw new Error("Risala not found");
    }
    
    const currentCount = risalaSnap.data().downloadCount || 0;
    
    await updateDoc(risalaRef, {
      downloadCount: currentCount + 1
    });
    
    return { id: risalaId, downloadCount: currentCount + 1 };
  } catch (error) {
    console.error("Error incrementing download count: ", error);
    throw error;
  }
};

// Settings Management
export const updateSettings = async (settingsData) => {
  try {
    const settingsRef = doc(db, "settings", "singleton");
    await updateDoc(settingsRef, settingsData);
    return { id: "singleton", ...settingsData };
  } catch (error) {
    // If document doesn't exist, create it
    if (error.code === 'not-found') {
      try {
        await setDoc(doc(db, "settings", "singleton"), settingsData);
        return { id: "singleton", ...settingsData };
      } catch (setError) {
        console.error("Error creating settings: ", setError);
        throw setError;
      }
    }
    console.error("Error updating settings: ", error);
    throw error;
  }
};

export const getSettings = async () => {
  try {
    const docRef = doc(db, "settings", "singleton");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // Create default settings if not exists
      const defaultSettings = {
        libraryName: "Madersatul Madina Faizane Gareeb Nawaz Library",
        address: "Gangavathi, Dawate Islami India Branch",
        maxBooksPerStudent: 3,
        maxBorrowDays: 14,
        finePerDay: 5,
        logoUrl: "/assets/dawateislami_logo.png"
      };
      
      await setDoc(docRef, defaultSettings);
      return { id: "singleton", ...defaultSettings };
    }
  } catch (error) {
    console.error("Error getting settings: ", error);
    throw error;
  }
};

// Authentication Functions
export const registerUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      email,
      role: "librarian", // Default role
      createdAt: serverTimestamp()
    });
    
    return user;
  } catch (error) {
    console.error("Error registering user: ", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in: ", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error logging out: ", error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Error resetting password: ", error);
    throw error;
  }
};

// Export all functions for use in the application
