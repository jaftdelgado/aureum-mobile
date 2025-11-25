import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../infra/external/supabase'; 
import { AUTH_LOGOUT_EVENT } from '../../infra/api/http/client'; 

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const logoutListener = DeviceEventEmitter.addListener(AUTH_LOGOUT_EVENT, async () => {
      console.log("🔒 Logout forzoso por 401");
      await supabase.auth.signOut();
    });

    return () => {
      authListener.subscription.unsubscribe();
      logoutListener.remove();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};