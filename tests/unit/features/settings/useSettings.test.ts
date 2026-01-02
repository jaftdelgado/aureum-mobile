import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSettings } from '@features/settings/hooks/usesettings'; // Asegúrate que el import coincida con tu archivo real (mayúsculas/minúsculas)
import { useAuth } from '@app/providers/AuthProvider';
import { useTheme } from '@app/providers/ThemeProvider';
import { deleteAccountUseCase } from '@app/di';
import { Alert } from 'react-native';

jest.mock('@app/providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@app/providers/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@app/di', () => ({
  deleteAccountUseCase: {
    execute: jest.fn(),
  },
}));

const mockChangeLanguage = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: mockChangeLanguage,
      language: 'en',
    },
  }),
}));

jest.mock('@core/utils/profile', () => ({
  getInitials: jest.fn(() => 'JP'),
}));

jest.spyOn(Alert, 'alert');

describe('useSettings Hook', () => {
  const mockLogout = jest.fn();
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockLogout.mockResolvedValue(undefined); 
    (deleteAccountUseCase.execute as jest.Mock).mockResolvedValue(undefined);

    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user-1', fullName: 'Juan Perez', avatarUrl: 'http://img.com' },
      logout: mockLogout,
    });

    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      isDark: false,
    });
  });

  describe('Initialization', () => {
    it('should return user data and initials correctly', () => {
      const { result } = renderHook(() => useSettings());

      expect(result.current.user).toBeDefined();
      expect(result.current.initials).toBe('JP'); 
      expect(result.current.avatarUrl).toBe('http://img.com');
      expect(result.current.loading).toBe(false);
    });

    it('should handle missing user name gracefully', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: { id: 'u2', fullName: null },
        logout: mockLogout,
      });
      
      const { result } = renderHook(() => useSettings());
      expect(result.current.initials).toBe('?');
    });
  });

  describe('Change Language', () => {
    it('should show alert with language options', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.handleChangeLanguage();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'changeLanguage',
        'selectLanguage',
        expect.any(Array)
      );
    });

    it('should change language to Spanish when option selected', () => {
      const { result } = renderHook(() => useSettings());
      act(() => { result.current.handleChangeLanguage(); });

      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      const spanishButton = buttons.find((b: any) => b.text === 'spanish');
      
      act(() => { spanishButton.onPress(); });

      expect(mockChangeLanguage).toHaveBeenCalledWith('es');
    });

    it('should change language to English when option selected', () => {
      const { result } = renderHook(() => useSettings());
      act(() => { result.current.handleChangeLanguage(); });

      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      const englishButton = buttons.find((b: any) => b.text === 'english');
      
      act(() => { englishButton.onPress(); });

      expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    });
  });

  describe('Logout', () => {
    it('should show confirmation alert', () => {
      const { result } = renderHook(() => useSettings());
      act(() => { result.current.handleLogout(); });

      expect(Alert.alert).toHaveBeenCalledWith(
        'logoutTitle',
        'logoutMsg',
        expect.any(Array)
      );
    });

    it('should call logout on confirmation', async () => {
      const { result } = renderHook(() => useSettings());
      act(() => { result.current.handleLogout(); });

      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      const confirmButton = buttons.find((b: any) => b.style === 'destructive');

      await act(async () => {
        await confirmButton.onPress();
      });

      expect(mockLogout).toHaveBeenCalled();
    });

    it('should handle logout error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      mockLogout.mockRejectedValue(new Error('Logout Failed'));

      const { result } = renderHook(() => useSettings());
      act(() => { result.current.handleLogout(); });

      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      const confirmButton = buttons.find((b: any) => b.style === 'destructive');

      await act(async () => {
        await confirmButton.onPress();
      });

      expect(mockLogout).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Delete Account', () => {
    it('should show confirmation alert', () => {
      const { result } = renderHook(() => useSettings());
      act(() => { result.current.handleDeleteAccount(); });

      expect(Alert.alert).toHaveBeenCalledWith(
        'deleteTitle',
        'deleteMsg',
        expect.any(Array)
      );
    });

    it('should execute delete use case and then logout on confirmation', async () => {

      const { result } = renderHook(() => useSettings());
      act(() => { result.current.handleDeleteAccount(); });

      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      const deleteButton = buttons.find((b: any) => b.style === 'destructive');

      await act(async () => {
        await deleteButton.onPress();
      });

      expect(result.current.loading).toBe(false); 
      expect(deleteAccountUseCase.execute).toHaveBeenCalledWith('user-1');
      expect(mockLogout).toHaveBeenCalled();
    });

    it('should handle delete error (Alert + Log)', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (deleteAccountUseCase.execute as jest.Mock).mockRejectedValue(new Error('Delete Failed'));

      const { result } = renderHook(() => useSettings());
      act(() => { result.current.handleDeleteAccount(); });

      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      const deleteButton = buttons.find((b: any) => b.style === 'destructive');

      await act(async () => {
        await deleteButton.onPress();
      });

      expect(deleteAccountUseCase.execute).toHaveBeenCalled();
      expect(mockLogout).not.toHaveBeenCalled(); 
      expect(result.current.loading).toBe(false);
      
      expect(Alert.alert).toHaveBeenCalledWith('common.error', expect.stringContaining('No se pudo'));

      consoleSpy.mockRestore();
    });

    it('should not proceed if user id is missing', async () => {
      (useAuth as jest.Mock).mockReturnValue({ user: null, logout: mockLogout });
      
      const { result } = renderHook(() => useSettings());
      
      act(() => { result.current.handleDeleteAccount(); });

      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];

      if (buttons) {
          const deleteButton = buttons.find((b: any) => b.style === 'destructive');
          await act(async () => {
            await deleteButton?.onPress();
          });
      }

      expect(deleteAccountUseCase.execute).not.toHaveBeenCalled();
    });
  });
});