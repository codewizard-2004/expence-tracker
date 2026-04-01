import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type Role = 'Employee' | 'Auditor' | null;

interface AuthProps {
  user: User | null;
  session: Session | null;
  role: Role;
  userProfile: any | null;
  initialized: boolean;
  signIn: (email: string, password: string, expectedRole?: string) => Promise<{ error: Error | null; role: Role }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<Partial<AuthProps>>({});

export function useAuth() {
  return useContext(AuthContext) as AuthProps;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      } else {
        setInitialized(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchRole(session.user.id);
      } else {
        setRole(null);
        setUserProfile(null);
        setInitialized(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('USERS')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setRole(data.type as Role);
        setUserProfile(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setInitialized(true);
    }
  };

  const signIn = async (email: string, password: string, expectedRole?: string): Promise<{ error: Error | null; role: Role }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error, role: null };
    
    try {
      const { data: userData, error: userError } = await supabase
        .from('USERS')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (!userError && userData) {
        const userRole = userData.type as Role;
        
        if (expectedRole && userRole?.toLowerCase() !== expectedRole.toLowerCase()) {
          await supabase.auth.signOut();
          return { error: new Error(`This account is not registered as an ${expectedRole}.`), role: null };
        }
        
        setRole(userRole);
        setUserProfile(userData);
        return { error: null, role: userRole };
      }
    } catch (e) {
      console.error(e);
    }
    return { error: null, role: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    role,
    userProfile,
    initialized,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
