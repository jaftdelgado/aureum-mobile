import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppState } from 'react-native';
import { AuthApiRepository } from '../../infra/external/auth/AuthApiRepository';
import { ProfileApiRepository } from '../../infra/api/users/ProfileApiRepository';
import { LoginUseCase } from '../../domain/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '../../domain/use-cases/auth/RegisterUseCase';
import { LogoutUseCase } from '../../domain/use-cases/auth/LogoutUseCase';
import { GetSessionUseCase } from '../../domain/use-cases/auth/GetSessionUseCase';
import { LoggedInUser } from '../../domain/entities/LoggedInUser';
import { RegisterData } from '../../domain/entities/RegisterData';

const authRepository = new AuthApiRepository();
const profileRepository = new ProfileApiRepository();

const loginUseCase = new LoginUseCase(authRepository, profileRepository);
const registerUseCase = new RegisterUseCase(authRepository, profileRepository);
const logoutUseCase = new LogoutUseCase(authRepository);
const getSessionUseCase = new GetSessionUseCase(authRepository, profileRepository);

interface AuthContextType {
  user: LoggedInUser | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>; 
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkCurrentSession = async () => {
    try {
      const currentUser = await getSessionUseCase.execute();
      setUser(currentUser);
    } catch (error) {
      console.log('No session found or error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkCurrentSession();

    const unsubscribe = authRepository.onAuthStateChange(async (changedUser) => {
        if (changedUser) {
           const fullUser = await getSessionUseCase.execute();
           setUser(fullUser);
        } else {
           setUser(null);
        }
        setIsLoading(false);
    });

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        checkCurrentSession();
      }
    });

    return () => {
      unsubscribe();
      subscription.remove();
    };
  }, []);

  const login = async (data: any) => {
    setIsLoading(true);
    try {
      const loggedUser = await loginUseCase.execute(data.email, data.password);
      setUser(loggedUser);
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

  const logout = async () => {
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
        logout,
        loginWithGoogle,
        refreshSession: checkCurrentSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);