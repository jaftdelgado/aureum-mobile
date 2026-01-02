import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@app/providers/AuthProvider';
import { 
  authRepository, 
  loginUseCase, 
  registerUseCase, 
  logoutUseCase, 
  enrichSessionUserUseCase, 
  checkSessionAliveUseCase 
} from '@app/di';
import { DeviceEventEmitter, AppState, Linking, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_EVENTS } from '@app/events/authEvents';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getAllKeys: jest.fn(() => Promise.resolve(['@aureum_theme', 'random_key'])),
  multiRemove: jest.fn(() => Promise.resolve()),
}));


jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()), 
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@app/di', () => ({
  authRepository: {
    onAuthStateChange: jest.fn(() => jest.fn()),
    setSession: jest.fn(),
    signInWithIdToken: jest.fn(),
    loginWithGoogle: jest.fn(),
  },
  loginUseCase: { execute: jest.fn() },
  registerUseCase: { execute: jest.fn() },
  logoutUseCase: { execute: jest.fn() },
  enrichSessionUserUseCase: { execute: jest.fn() },
  checkSessionAliveUseCase: { execute: jest.fn() },
}));

const TestConsumer = ({ onStateChange }: { onStateChange?: (val: any) => void }) => {
  const auth = useAuth();
  
  React.useEffect(() => {
    if (onStateChange) onStateChange(auth);
  }, [auth, onStateChange]);

  return (
    <>
      <Text testID="user-email">{auth.user?.email || 'no-user'}</Text>
      <Button testID="login-btn" title="Login" onPress={() => auth.login({ email: 'a@a.com', password: '123' })} />
      <Button testID="logout-btn" title="Logout" onPress={() => auth.logout()} />
    </>
  );
};

describe('AuthProvider (Unit)', () => {
  const mockAppStateAddListener = jest.spyOn(AppState, 'addEventListener');
  const mockLinkingAddListener = jest.spyOn(Linking, 'addEventListener');
  const mockLinkingGetInitialURL = jest.spyOn(Linking, 'getInitialURL');

  beforeEach(() => {
    jest.clearAllMocks();
    
    (enrichSessionUserUseCase.execute as jest.Mock).mockResolvedValue(null);
    mockAppStateAddListener.mockReturnValue({ remove: jest.fn() } as any);
    mockLinkingAddListener.mockReturnValue({ remove: jest.fn() } as any);
    mockLinkingGetInitialURL.mockResolvedValue(null);
  });

  it('should check session on mount (refreshSession)', async () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    (enrichSessionUserUseCase.execute as jest.Mock).mockResolvedValue(mockUser);

    let contextValues: any;

    render(
      <AuthProvider>
        <TestConsumer onStateChange={(val) => (contextValues = val)} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(contextValues.user).toEqual(mockUser);
      expect(contextValues.isLoading).toBe(false);
    });

    expect(enrichSessionUserUseCase.execute).toHaveBeenCalled();
  });

  it('login() should call useCase and update user state', async () => {
    const mockUser = { id: '2', email: 'login@test.com' };
    (loginUseCase.execute as jest.Mock).mockResolvedValue(mockUser);
    (enrichSessionUserUseCase.execute as jest.Mock).mockResolvedValue(mockUser);

    let contextValues: any;
    render(
      <AuthProvider>
        <TestConsumer onStateChange={(val) => (contextValues = val)} />
      </AuthProvider>
    );

    await waitFor(() => expect(contextValues.isLoading).toBe(false));

    await act(async () => {
      await contextValues.login({ email: 'a', password: 'b' });
    });

    expect(loginUseCase.execute).toHaveBeenCalledWith('a', 'b');
    expect(enrichSessionUserUseCase.execute).toHaveBeenCalled();
    expect(contextValues.user).toEqual(mockUser);
  });

  it('register() should call useCase and refresh session', async () => {
    const mockUser = { id: '3', email: 'new@test.com' };
    (registerUseCase.execute as jest.Mock).mockResolvedValue(undefined);
    (enrichSessionUserUseCase.execute as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockUser);

    let contextValues: any;
    render(
      <AuthProvider>
        <TestConsumer onStateChange={(val) => (contextValues = val)} />
      </AuthProvider>
    );

    await waitFor(() => expect(contextValues.isLoading).toBe(false));

    const registerData: any = { email: 'new@test.com' };
    await act(async () => {
      await contextValues.register(registerData);
    });

    expect(registerUseCase.execute).toHaveBeenCalledWith(registerData);
    expect(enrichSessionUserUseCase.execute).toHaveBeenCalledTimes(2);
    expect(contextValues.user).toEqual(mockUser);
  });

  it('logout() should clear data, call useCase and reset user', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const mockUser = { id: '1' };
    (enrichSessionUserUseCase.execute as jest.Mock).mockResolvedValue(mockUser);

    let contextValues: any;
    render(
      <AuthProvider>
        <TestConsumer onStateChange={(val) => (contextValues = val)} />
      </AuthProvider>
    );

    await waitFor(() => expect(contextValues.user).not.toBeNull());

    await act(async () => {
      await contextValues.logout();
    });

    expect(AsyncStorage.getAllKeys).toHaveBeenCalled();
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
        expect.not.arrayContaining(['@aureum_theme']) 
    );
    expect(logoutUseCase.execute).toHaveBeenCalled();
    expect(contextValues.user).toBeNull();

    consoleSpy.mockRestore();
  });

  it('should handle AUTH_EVENTS.LOGOUT event', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    (enrichSessionUserUseCase.execute as jest.Mock).mockResolvedValue({ id: '1' });
    
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    
    await waitFor(() => expect(enrichSessionUserUseCase.execute).toHaveBeenCalled());

    await act(async () => {
      DeviceEventEmitter.emit(AUTH_EVENTS.LOGOUT);
    });

    expect(logoutUseCase.execute).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('should handle Deep Links on mount', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const deepLink = 'aureum://auth/callback?access_token=AT&refresh_token=RT';
    mockLinkingGetInitialURL.mockResolvedValue(deepLink);

    render(<AuthProvider><TestConsumer /></AuthProvider>);

    await waitFor(() => {
        expect(authRepository.setSession).toHaveBeenCalledWith('AT', 'RT');
    });

    consoleSpy.mockRestore();
  });
});