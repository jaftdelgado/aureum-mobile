import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useLoginForm } from '@features/auth/hooks/useLoginForm';
import { useAuth } from '@app/providers/AuthProvider';
import { Alert } from 'react-native';
import { getUserFriendlyErrorMessage } from '@core/utils/errorMapper';

jest.mock('@app/providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@core/utils/errorMapper', () => ({
  getUserFriendlyErrorMessage: jest.fn(),
}));

describe('useLoginForm Hook', () => {
  const mockLogin = jest.fn();
  const mockClearLogoutReason = jest.fn();

  const setupAuthMock = (overrides = {}) => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      logoutReason: null,
      clearLogoutReason: mockClearLogoutReason,
      ...overrides,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthMock(); 
  });

  describe('Form Interaction & Submission', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useLoginForm());

      expect(result.current.formData.email).toBe('');
      expect(result.current.formData.password).toBe('');
      expect(result.current.loading).toBe(false);
      expect(result.current.errorMsg).toBeNull();
    });

    it('should update form values using handleChange', async () => {
      const { result } = renderHook(() => useLoginForm());

      await act(async () => {
        result.current.handleChange('email', 'test@test.com');
        result.current.handleChange('password', '123456');
      });

      expect(result.current.formData.email).toBe('test@test.com');
      expect(result.current.formData.password).toBe('123456');
    });

    it('should call login on successful submission', async () => {
      const { result } = renderHook(() => useLoginForm());

      await act(async () => {
        result.current.handleChange('email', 'valid@email.com');
        result.current.handleChange('password', 'securePass123');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(mockLogin).toHaveBeenCalledWith({
        email: 'valid@email.com',
        password: 'securePass123',
      });
      expect(result.current.loading).toBe(false);
      expect(result.current.errorMsg).toBeNull();
    });

    it('should handle login errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const error = new Error('Bad credentials');
      mockLogin.mockRejectedValue(error);
      (getUserFriendlyErrorMessage as jest.Mock).mockReturnValue('Error amigable');

      const { result } = renderHook(() => useLoginForm());

      await act(async () => {
        result.current.handleChange('email', 'fail@test.com');
        result.current.handleChange('password', 'wrongpass');
        await result.current.handleSubmit();
      });

      expect(mockLogin).toHaveBeenCalled();
      expect(getUserFriendlyErrorMessage).toHaveBeenCalledWith(error, expect.any(Function));
      
      expect(result.current.errorMsg).toBe('Error amigable');
      expect(result.current.loading).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should NOT call login if validation fails (empty fields)', async () => {
      const { result } = renderHook(() => useLoginForm());

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(mockLogin).not.toHaveBeenCalled();
      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    });
  });

  describe('Effects (Logout Alerts)', () => {
    it('should show alert if logoutReason is "network_lost"', () => {
      setupAuthMock({ logoutReason: 'network_lost' });
      const spyAlert = jest.spyOn(Alert, 'alert');

      renderHook(() => useLoginForm());

      expect(spyAlert).toHaveBeenCalledWith(
        'common.attention',
        'signin.errors.networkLost',
        expect.any(Array) 
      );

      const buttons = spyAlert.mock.calls[0][2];
      // @ts-ignore
      buttons[0].onPress(); 

      expect(mockClearLogoutReason).toHaveBeenCalled();
    });

    it('should show alert if logoutReason is "session_expired"', () => {
      setupAuthMock({ logoutReason: 'session_expired' });
      const spyAlert = jest.spyOn(Alert, 'alert');

      renderHook(() => useLoginForm());

      expect(spyAlert).toHaveBeenCalledWith(
        'common.attention',
        'signin.errors.sessionExpired',
        expect.any(Array)
      );
    });

    it('should NOT show alert for other reasons or null', () => {
      setupAuthMock({ logoutReason: null });
      const spyAlert = jest.spyOn(Alert, 'alert');

      renderHook(() => useLoginForm());

      expect(spyAlert).not.toHaveBeenCalled();
    });
  });

  describe('Callbacks', () => {
    it('should pass onShowRegister callback correctly', () => {
      const mockRegisterFn = jest.fn();
      const { result } = renderHook(() => useLoginForm(mockRegisterFn));

      result.current.onShowRegister?.();

      expect(mockRegisterFn).toHaveBeenCalled();
    });
  });
});