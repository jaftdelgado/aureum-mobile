import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@infra/external/supabase';
import { AUTH_LOGOUT_EVENT } from '@infra/api/http/client';
import { getProfileByAuthId } from '@features/auth/api/authApi';
import { UserProfile } from '@domain/entities/UserProfile'; // <--- Importar Entidad

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null; 
  loading: boolean;
  signOut: () => Promise<void>;
  refetchProfile: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null); // Estado del perfil
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfileData = useCallback(async (userId: string) => {
    try {
      const data = await getProfileByAuthId(userId);
      console.log("AuthProvider: Perfil cargado:", data.username);
      setProfile(data);
    } catch (error) {
      console.warn(" AuthProvider: Usuario sin perfil (o error de red)");
      setProfile(null);
    }
  }, []);

  const loadSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        await fetchProfileData(data.session.user.id);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refetchProfile = async () => {
    if (user?.id) {
      await fetchProfileData(user.id);
    }
  };

  useEffect(() => {
    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfileData(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    const logoutListener = DeviceEventEmitter.addListener(AUTH_LOGOUT_EVENT, () => {
      signOut();
    });

    return () => {
      authListener.subscription.unsubscribe();
      logoutListener.remove();
    };
  }, [fetchProfileData]);

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, refetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};