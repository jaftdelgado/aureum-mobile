import { getUserFriendlyErrorMessage } from '@core/utils/errorMapper';
import { HttpError } from '@infra/api/http/client';

jest.mock('@infra/external/supabase', () => ({
  supabase: {},
}));

jest.mock('@infra/api/http/client', () => {
  const actual = jest.requireActual('@infra/api/http/client');
  return {
    ...actual,
  };
});

describe('Core Utils: errorMapper', () => {
  const t = (key: string) => key;

  describe('HttpError Handling', () => {
    it('should return timeout error for status 408', () => {
      const error = new HttpError(408, 'Timeout error');
      expect(getUserFriendlyErrorMessage(error, t)).toBe('common.errors.timeout');
    });

    it('should return timeout error for status 504', () => {
      const error = new HttpError(504, 'Gateway Timeout');
      expect(getUserFriendlyErrorMessage(error, t)).toBe('common.errors.timeout');
    });

    it('should return server error for status >= 500', () => {
      const error = new HttpError(500, 'Internal Server Error');
      expect(getUserFriendlyErrorMessage(error, t)).toBe('common.errors.server');
    });

    it('should return not found error for status 404', () => {
      const error = new HttpError(404, 'Not Found');
      expect(getUserFriendlyErrorMessage(error, t)).toBe('common.errors.notFound');
    });

    it('should return username reserved error for specific messages', () => {
      const error1 = new HttpError(400, 'El nombre de usuario ya está en uso');
      expect(getUserFriendlyErrorMessage(error1, t)).toBe('signup.errors.usernameReserved');

      const error2 = new HttpError(400, 'Error key: username_key');
      expect(getUserFriendlyErrorMessage(error2, t)).toBe('signup.errors.usernameReserved');
    });

    it('should return raw message for unhandled HttpErrors', () => {
      const error = new HttpError(418, 'I am a teapot');
      expect(getUserFriendlyErrorMessage(error, t)).toBe('I am a teapot');
    });
  });

  describe('Generic Error Handling', () => {
    it('should map invalid credentials error', () => {
      const error = { message: 'Invalid login credentials' };
      expect(getUserFriendlyErrorMessage(error, t)).toBe('signin.errors.invalidCredentials');
    });

    it('should map network failure', () => {
      const error = { message: 'Network request failed' };
      expect(getUserFriendlyErrorMessage(error, t)).toBe('common.noInternet');
    });

    it('should map email already registered', () => {
      const error = { message: 'User already registered' };
      expect(getUserFriendlyErrorMessage(error, t)).toBe('signup.errors.emailAlreadyRegistered');
    });

    it('should map username reserved (generic)', () => {
      const error = { message: 'unique_username constraint violation' };
      expect(getUserFriendlyErrorMessage(error, t)).toBe('signup.errors.usernameReserved');
    });

    it('should map team specific errors', () => {
      expect(getUserFriendlyErrorMessage({ message: 'TEAM_NOT_FOUND' }, t))
        .toBe('join.error_not_found');
      expect(getUserFriendlyErrorMessage({ message: 'TEAM_ALREADY_MEMBER' }, t))
        .toBe('join.error_already_member');
    });

    it('should return default generic error for unknown errors', () => {
      const error = { message: 'Something weird happened' };
      expect(getUserFriendlyErrorMessage(error, t)).toBe('common.genericLoginError');
    });

    it('should handle null/undefined error gracefully', () => {
      expect(getUserFriendlyErrorMessage(null, t)).toBe('common.genericLoginError');
      expect(getUserFriendlyErrorMessage(undefined, t)).toBe('common.genericLoginError');
    });
  });
});