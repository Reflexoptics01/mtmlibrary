'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabase, hasSupabaseConfig } from '@/lib/supabase';
import { getProfile } from '@/lib/db';
import type { Profile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  configError: string | null;
  isStaff: boolean;
  isAdmin: boolean;
  isPending: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  configError: null,
  isStaff: false,
  isAdmin: false,
  isPending: false,
  login: async () => {
    throw new Error('Auth not ready');
  },
  signUp: async () => {
    throw new Error('Auth not ready');
  },
  logout: async () => {
    throw new Error('Auth not ready');
  },
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  const loadProfile = async (nextUser: User | null) => {
    if (!nextUser) {
      setProfile(null);
      return;
    }
    try {
      const data = await getProfile(nextUser.id);
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile', err);
      setProfile(null);
    }
  };

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      setConfigError('Supabase is not configured. Copy .env.example to .env.local and add your project URL and anon key.');
      setLoading(false);
      return;
    }

    const supabase = getSupabase();

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      await loadProfile(sessionUser);
      setLoading(false);
    };

    void init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      void loadProfile(sessionUser);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await getSupabase().auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await getSupabase().auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await getSupabase().auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    await loadProfile(user);
  };

  const role = profile?.role;
  const isStaff = role === 'admin' || role === 'librarian';
  const isAdmin = role === 'admin';
  const isPending = Boolean(user && profile && profile.role === 'pending');

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        configError,
        isStaff,
        isAdmin,
        isPending,
        login,
        signUp,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
