import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSignUp } from '@features/auth/hooks/useSignUp';
import { useAuth } from '@app/providers/AuthProvider';
import { getSocialUserUseCase } from '@app/di';
import { Alert } from 'react-native';
import { getUserFriendlyErrorMessage } from '@core/utils/errorMapper';

jest.mock('@app/providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@app/di', () => ({
  getSocialUserUseCase: {
    execute: jest.fn(),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@core/utils/errorMapper', () => ({
  getUserFriendlyErrorMessage: jest.fn((e) => e.message || 'Error'),
}));

jest.mock('@core/utils/pwned', () => ({
  checkPasswordLeaked: jest.fn().mockResolvedValue(false),
}));

jest.spyOn(Alert, 'alert');

describe('useSignUp Hook', () => {
  const mockRegister = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
    });
    
    (getSocialUserUseCase.execute as jest.Mock).mockResolvedValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const fillStep1 = async (result: any) => {
    await act(async () => {
      result.current.setValue('firstName', 'Juan');
      result.current.setValue('lastName', 'Perez');
      result.current.setValue('email', 'juan@test.com');
    });
  };

  const fillStep2 = async (result: any) => {
    await act(async () => {
      result.current.setValue('username', 'juanperez');
      result.current.setValue('accountType', 'student');
    });
  };

  const fillStep3 = async (result: any) => {
    await act(async () => {
      result.current.setValue('password', 'Password123!');
      result.current.setValue('confirmPassword', 'Password123!');
    });
  };

  describe('Normal Flow', () => {
    it('should initialize at step 1', () => {
      const { result } = renderHook(() => useSignUp({ isGoogleFlow: false, onSuccess: mockOnSuccess }));
      expect(result.current.step).toBe(1);
    });

    it('should advance steps if validation passes', async () => {
      const { result } = renderHook(() => useSignUp({ isGoogleFlow: false, onSuccess: mockOnSuccess }));

      await fillStep1(result);
      await act(async () => { await result.current.handleNext(); });
      expect(result.current.step).toBe(2);

      await fillStep2(result);
      await act(async () => { await result.current.handleNext(); });
      expect(result.current.step).toBe(3);
    });

    it('should NOT advance if validation fails (empty fields)', async () => {
      const { result } = renderHook(() => useSignUp({ isGoogleFlow: false, onSuccess: mockOnSuccess }));
      
      await act(async () => { await result.current.handleNext(); });
      expect(result.current.step).toBe(1);
      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    });

    it('should handle back navigation', async () => {
      const { result } = renderHook(() => useSignUp({ 
        isGoogleFlow: false, 
        onSuccess: mockOnSuccess, 
        onBack: mockOnBack 
      }));

      await fillStep1(result);
      await act(async () => { await result.current.handleNext(); });
      expect(result.current.step).toBe(2);

      await act(async () => { result.current.handleBack(); });
      expect(result.current.step).toBe(1);

      await act(async () => { result.current.handleBack(); });
      expect(mockOnBack).toHaveBeenCalled();
    });

    it('should submit on final step', async () => {
      const { result } = renderHook(() => useSignUp({ isGoogleFlow: false, onSuccess: mockOnSuccess }));

      await fillStep1(result);
      await act(async () => { await result.current.handleNext(); });
      await fillStep2(result);
      await act(async () => { await result.current.handleNext(); });
      await fillStep3(result);

      await act(async () => { await result.current.handleNext(); });

      expect(mockRegister).toHaveBeenCalledWith(expect.objectContaining({
        email: 'juan@test.com',
        username: 'juanperez',
        isGoogle: false
      }));
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  describe('Google Flow', () => {
    it('should pre-fill data and skip to step 2 if names are valid', async () => {
      (getSocialUserUseCase.execute as jest.Mock).mockResolvedValue({
        firstName: 'Carlos', 
        lastName: 'User',
        email: 'g@g.com'
      });

      const { result } = renderHook(() => useSignUp({ isGoogleFlow: true, onSuccess: mockOnSuccess }));

      await waitFor(() => expect(result.current.step).toBe(2));

      expect(result.current.shouldHideBackButton).toBe(true);
      
      await fillStep2(result); 
      
      await act(async () => { await result.current.handleNext(); });

      expect(mockRegister).toHaveBeenCalledWith(expect.objectContaining({
        email: 'g@g.com',
        isGoogle: true
      }));
    });

    it('should stay on step 1 if social user names are missing', async () => {
      (getSocialUserUseCase.execute as jest.Mock).mockResolvedValue({
        email: 'g@g.com',
        firstName: '',
        lastName: ''
      });

      const { result } = renderHook(() => useSignUp({ isGoogleFlow: true, onSuccess: mockOnSuccess }));

      await waitFor(() => {
        expect(getSocialUserUseCase.execute).toHaveBeenCalled();
      });
      
      expect(result.current.step).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle "already registered" error (Back to Step 1 + Error on Email)', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const { result } = renderHook(() => useSignUp({ isGoogleFlow: false, onSuccess: mockOnSuccess }));
      
      await fillStep1(result); await act(async () => await result.current.handleNext());
      await fillStep2(result); await act(async () => await result.current.handleNext());
      await fillStep3(result);

      mockRegister.mockRejectedValue(new Error('User already registered'));

      await act(async () => { await result.current.handleNext(); });

      expect(mockRegister).toHaveBeenCalled();
      expect(result.current.step).toBe(1);
      
      act(() => { jest.runAllTimers(); });

      await waitFor(() => {
        expect(result.current.errors.email).toBeDefined();
        expect(result.current.errors.email?.message).toBe('signup.errors.emailAlreadyRegistered');
      });
      
      consoleSpy.mockRestore();
    });

    it('should handle "username reserved" error (Go to Step 2 + Error on Username)', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const { result } = renderHook(() => useSignUp({ isGoogleFlow: false, onSuccess: mockOnSuccess }));
      
      await fillStep1(result); await act(async () => await result.current.handleNext());
      await fillStep2(result); await act(async () => await result.current.handleNext());
      await fillStep3(result);

      mockRegister.mockRejectedValue(new Error('El nombre de usuario ya esta en uso'));

      await act(async () => { await result.current.handleNext(); });

      expect(result.current.step).toBe(2);

      act(() => { jest.runAllTimers(); });

      await waitFor(() => {
        expect(result.current.errors.username).toBeDefined();
        expect(result.current.errors.username?.message).toBe('signup.errors.usernameReserved');
      });

      consoleSpy.mockRestore();
    });

    it('should show generic alert for other errors', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const { result } = renderHook(() => useSignUp({ isGoogleFlow: false, onSuccess: mockOnSuccess }));
      
      await fillStep1(result); await act(async () => await result.current.handleNext());
      await fillStep2(result); await act(async () => await result.current.handleNext());
      await fillStep3(result);

      mockRegister.mockRejectedValue(new Error('Server blew up'));

      await act(async () => { await result.current.handleNext(); });

      expect(Alert.alert).toHaveBeenCalledWith('common.error', expect.anything());
      
      consoleSpy.mockRestore();
    });
  });
});