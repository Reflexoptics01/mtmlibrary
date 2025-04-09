// Firebase Storage Configuration
// This file connects the Next.js app to Firebase Storage for file uploads

import { initializeApp } from 'firebase/app';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  UploadMetadata
} from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Upload file to storage
export const uploadFile = async (file: File, path: string, metadata?: UploadMetadata) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      path,
      downloadURL,
      metadata: snapshot.metadata
    };
  } catch (error: any) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

// Get download URL for a file
export const getFileURL = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error: any) {
    throw new Error(`Error getting file URL: ${error.message}`);
  }
};

// Delete file from storage
export const deleteFile = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return true;
  } catch (error: any) {
    throw new Error(`Error deleting file: ${error.message}`);
  }
};

// List all files in a directory
export const listFiles = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    
    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          url
        };
      })
    );
    
    return files;
  } catch (error: any) {
    throw new Error(`Error listing files: ${error.message}`);
  }
};

// Upload Risala files (booklet, audio, thumbnail)
export const uploadRisalaFiles = async (
  bookletFile: File | null, 
  audioFile: File | null, 
  thumbnailFile: File | null,
  year: string,
  month: string
) => {
  const results: {
    bookletUrl?: string;
    audioUrl?: string;
    thumbnailUrl?: string;
  } = {};
  
  try {
    if (bookletFile) {
      const bookletPath = `risala/${year}/${month}/booklet_${Date.now()}_${bookletFile.name}`;
      const bookletResult = await uploadFile(bookletFile, bookletPath);
      results.bookletUrl = bookletResult.downloadURL;
    }
    
    if (audioFile) {
      const audioPath = `risala/${year}/${month}/audio_${Date.now()}_${audioFile.name}`;
      const audioResult = await uploadFile(audioFile, audioPath);
      results.audioUrl = audioResult.downloadURL;
    }
    
    if (thumbnailFile) {
      const thumbnailPath = `risala/thumbnails/${year}/${month}/thumbnail_${Date.now()}_${thumbnailFile.name}`;
      const thumbnailResult = await uploadFile(thumbnailFile, thumbnailPath);
      results.thumbnailUrl = thumbnailResult.downloadURL;
    }
    
    return results;
  } catch (error: any) {
    throw new Error(`Error uploading Risala files: ${error.message}`);
  }
};

export { storage };
