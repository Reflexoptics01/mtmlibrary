'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  UserCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Define the shape of the auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {
    throw new Error('Auth context not initialized');
  },
  login: async () => {
    throw new Error('Auth context not initialized');
  },
  logout: async () => {
    throw new Error('Auth context not initialized');
  },
  resetPassword: async () => {
    throw new Error('Auth context not initialized');
  },
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available
export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state with consistent values for both server and client
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // This effect only runs on the client after the component mounts
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Sign up function
  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign in function
  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign out function
  const logout = () => {
    return signOut(auth);
  };

  // Reset password function
  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Context values to be provided
  const value = {
    user,
    loading,
    signUp,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
