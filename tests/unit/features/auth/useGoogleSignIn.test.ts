import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useGoogleSignIn } from '@features/auth/hooks/useGoogleSignIn';
import { useAuth } from '@app/providers/AuthProvider';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as WebBrowser from 'expo-web-browser';

jest.mock('@app/providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

describe('useGoogleSignIn Hook', () => {
  const mockLoginWithGoogle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      loginWithGoogle: mockLoginWithGoogle,
    });
    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });
    
    jest.spyOn(Alert, 'alert');
  });

  it('should initialize with loading false', () => {
    const { result } = renderHook(() => useGoogleSignIn());
    expect(result.current.loading).toBe(false);
  });

  it('should verify internet connection before login', async () => {
    const { result } = renderHook(() => useGoogleSignIn());

    await act(async () => {
      await result.current.handleGoogleLogin();
    });

    expect(NetInfo.fetch).toHaveBeenCalled();
  });

  it('should call loginWithGoogle if connection is available', async () => {
    const { result } = renderHook(() => useGoogleSignIn());

    await act(async () => {
      await result.current.handleGoogleLogin();
    });

    expect(mockLoginWithGoogle).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('should handle NO internet connection (Throw Error + Alert)', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });

    const { result } = renderHook(() => useGoogleSignIn());

    await act(async () => {
      await result.current.handleGoogleLogin();
    });

    expect(mockLoginWithGoogle).not.toHaveBeenCalled(); 
    expect(Alert.alert).toHaveBeenCalledWith('common.error', 'common.noInternet');
    expect(result.current.loading).toBe(false);

    consoleSpy.mockRestore();
  });

  it('should handle login errors from useAuth', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const loginError = new Error('Google Sign In Cancelled');
    mockLoginWithGoogle.mockRejectedValue(loginError);

    const { result } = renderHook(() => useGoogleSignIn());

    await act(async () => {
      await result.current.handleGoogleLogin();
    });

    expect(mockLoginWithGoogle).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('common.error', 'Google Sign In Cancelled');
    expect(result.current.loading).toBe(false);

    consoleSpy.mockRestore();
  });

  it('should handle generic login errors (no message)', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockLoginWithGoogle.mockRejectedValue({}); 

    const { result } = renderHook(() => useGoogleSignIn());

    await act(async () => {
      await result.current.handleGoogleLogin();
    });

    expect(Alert.alert).toHaveBeenCalledWith('common.error', 'common.genericLoginError');
    
    consoleSpy.mockRestore();
  });
});