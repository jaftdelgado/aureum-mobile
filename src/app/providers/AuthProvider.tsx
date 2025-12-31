import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { AppState, DeviceEventEmitter, Alert, Linking } from 'react-native';
import { LoggedInUser } from '../../domain/entities/LoggedInUser';
import { RegisterData } from '../../domain/entities/RegisterData';
import { AUTH_EVENTS } from '../events/authEvents';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import { 
  authRepository, 
  loginUseCase, 
  registerUseCase, 
  logoutUseCase, 
  enrichSessionUserUseCase,
  checkSessionAliveUseCase 
} from '../di';


const KEYS_TO_PRESERVE = [
  '@aureum_theme', 
  '@aureum_language', 
];

const extractParamsFromUrl = (url: string) => {
  const params: Record<string, string> = {};
  const queryString = url.split('#')[1] || url.split('?')[1];
  if (queryString) {
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key && value) params[key] = decodeURIComponent(value);
    });
  }
  return params;
};

interface AuthContextType {
  user: LoggedInUser | null;
  isLoading: boolean;
  login: (data: { email: string, password: string }) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  refreshSession: () => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  logoutReason: string | null;
  clearLogoutReason: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const [isSplashLoading, setIsSplashLoading] = useState(true);
  const [logoutReason, setLogoutReason] = useState<string | null>(null);
  const isLoggingInRef = useRef(false);

  const verifySession = useCallback(async () => {
    if (!user) return;

    const isAlive = await checkSessionAliveUseCase.execute();

    if (!isAlive) {
      console.log("Sesión invalidada remotamente (Token expirado o usado en otro lado).");
      setLogoutReason('session_expired'); 
      handleLogout();
    }
  }, [user]); 

  const refreshSession = useCallback(async () => {
    try {
      const enrichedUser = await enrichSessionUserUseCase.execute();
      setUser(enrichedUser);
    } catch (error) {
      console.log('Session refresh error:', error);
      setUser(null);
    } finally {
      setIsSplashLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log("App en primer plano, verificando sesión...");
        verifySession();
        refreshSession(); 
      }
    });

    return () => {
      subscription.remove();
    };
  }, [verifySession, refreshSession]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      verifySession();
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, verifySession]);

  const clearUserData = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      
      const keysToRemove = allKeys.filter(key => !KEYS_TO_PRESERVE.includes(key));
      
      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
        console.log('Datos de sesión limpiados:', keysToRemove);
      }
    } catch (error) {
      console.error('Error limpiando datos de usuario:', error);
    }
  };

  useEffect(() => {
    const unsubscribeNet = NetInfo.addEventListener(state => {
      if (state.isConnected === false && user) {
        console.log("Internet perdido. Cerrando sesión...");
        setLogoutReason('network_lost'); 
        handleLogout();
      }
    });

    return () => {
      unsubscribeNet();
    };
  }, [user]);

  useEffect(() => {
    const unsubscribe = authRepository.onAuthStateChange(async (authUser) => {
      if (isLoggingInRef.current) {
        return;
      }
      if (authUser) {
        const enrichedUser = await enrichSessionUserUseCase.execute(authUser);
        setUser(enrichedUser);
      }
    });

    const handleDeepLink = async (event: { url: string }) => {
      if (event.url.includes('auth/callback')) {
        console.log("Deep link recibido!");
        setIsLoading(true);

        const params = extractParamsFromUrl(event.url);
        if (params.access_token && params.refresh_token) {
          try {
            console.log("Estableciendo sesión manualmente...");
            await authRepository.setSession(params.access_token, params.refresh_token);
          } catch (e) {
            console.error("Error setting session:", e);
          }
        }

        setTimeout(() => {
            refreshSession();
        }, 500);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url && url.includes('auth/callback')) {
         handleDeepLink({ url });
      } else {
         refreshSession();
      }
    });

    const appStateListener = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshSession();
    });

    const logoutListener = DeviceEventEmitter.addListener(AUTH_EVENTS.LOGOUT, () => {
      handleLogout();
      Alert.alert(t('auth.session_expired_title'), t('auth.session_expired_msg'));
    });

    return () => {
      unsubscribe();
      subscription.remove();
      appStateListener.remove();
      logoutListener.remove();
    };
  }, [refreshSession]);

  const login = async (data: { email: string, password: string }) => {
    isLoggingInRef.current = true;
    try {
      const loggedUser = await loginUseCase.execute(data.email, data.password);
      const enrichedUser = await enrichSessionUserUseCase.execute(loggedUser);
      setUser(enrichedUser);
    } catch (error: any) {
      console.log('Login failed (expected if credentials are wrong):', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await registerUseCase.execute(data);
      await refreshSession();
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
      await clearUserData();
      await logoutUseCase.execute();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (token: string) => {
    setIsLoading(true);
    try {
      await authRepository.signInWithIdToken(token);
      
      await refreshSession();
    } catch (error: any) {
      console.error("Google login error:", error);
      Alert.alert("Error", "No se pudo iniciar sesión con Google");
      throw error;
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

  const clearLogoutReason = () => setLogoutReason(null);

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isLoading: isSplashLoading, 
        login, 
        register, 
        logout: handleLogout, 
        refreshSession, 
        googleLogin,
        loginWithGoogle,
        logoutReason,
        clearLogoutReason
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);