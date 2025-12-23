import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppState, DeviceEventEmitter, Alert } from 'react-native';
import { LoggedInUser } from '../../domain/entities/LoggedInUser';
import { RegisterData } from '../../domain/entities/RegisterData';
import { AUTH_EVENTS } from '../events/authEvents';
import { useTranslation } from 'react-i18next';

import { 
  authRepository, 
  loginUseCase, 
  registerUseCase, 
  logoutUseCase, 
  enrichSessionUserUseCase 
} from '../di';

interface AuthContextType {
  user: LoggedInUser | null;
  isLoading: boolean;
  login: (data: { email: string, password: string }) => Promise<void>; // Tipado estricto
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const refreshSession = async () => {
    try {
      const enrichedUser = await enrichSessionUserUseCase.execute();
      setUser(enrichedUser);
    } catch (error) {
      console.log('Session refresh error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();

    const unsubscribe = authRepository.onAuthStateChange(async (authUser) => {
      if (authUser) {
        const enrichedUser = await enrichSessionUserUseCase.execute(authUser);
        setUser(enrichedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    const logoutListener = DeviceEventEmitter.addListener(AUTH_EVENTS.LOGOUT, () => {
      handleLogout(); 
      Alert.alert(
        t('auth.session_expired_title'), 
        t('auth.session_expired_msg')
      );
    });

    const serverListener = DeviceEventEmitter.addListener(AUTH_EVENTS.SERVER_DISCONNECT, () => {
      Alert.alert(
        t('auth.connection_error_title'), 
        t('auth.connection_error_msg')
      );
    });

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refreshSession();
      }
    });

    return () => {
      unsubscribe();
      subscription.remove();
      logoutListener.remove();
      serverListener.remove();
    };
  }, []);

  const login = async (data: { email: string, password: string }) => {
    setIsLoading(true);
    try {
      const loggedUser = await loginUseCase.execute(data.email, data.password);
      const enrichedUser = await enrichSessionUserUseCase.execute(loggedUser);
      setUser(enrichedUser);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await registerUseCase.execute(data);
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutUseCase.execute();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
      try {
          await authRepository.loginWithGoogle();
      } catch (error) {
          console.error("Google login error:", error);
      }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout: handleLogout,
        loginWithGoogle,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);