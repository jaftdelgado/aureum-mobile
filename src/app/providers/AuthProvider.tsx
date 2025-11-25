import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@infra/external/supabase';
import { AUTH_LOGOUT_EVENT } from '@infra/api/http/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setSession(session ?? null);
    setUser(session?.user ?? null);
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  useEffect(() => {
    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const logoutListener = DeviceEventEmitter.addListener(AUTH_LOGOUT_EVENT, () => {
      signOut();
    });

    return () => {
      authListener.subscription.unsubscribe();
      logoutListener.remove();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
