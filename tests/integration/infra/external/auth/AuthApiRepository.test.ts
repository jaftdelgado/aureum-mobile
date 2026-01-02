import { AuthApiRepository } from '@infra/external/auth/AuthApiRepository';
import { supabase } from '@infra/external/supabase'; 
import * as Linking from 'expo-linking';
import { mapSessionToUser } from '@infra/external/auth/auth.mappers';

jest.mock('@infra/external/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      signUp: jest.fn(),
      getUser: jest.fn(),
      setSession: jest.fn(),
      signInWithIdToken: jest.fn(),
      onAuthStateChange: jest.fn(() => ({ 
        data: { subscription: { unsubscribe: jest.fn() } } 
      })),
    },
    rpc: jest.fn(),
  },
}));

jest.mock('expo-linking', () => ({
  createURL: jest.fn(),
  openURL: jest.fn(),
}));

jest.mock('@infra/external/auth/auth.mappers', () => ({
  mapSessionToUser: jest.fn(),
}));

describe('AuthApiRepository (Integration)', () => {
  let repository: AuthApiRepository;

  const mockAuth = supabase.auth as any; 
  const mockRpc = supabase.rpc as jest.Mock;
  const mockMapSessionToUser = mapSessionToUser as jest.Mock;

  const mockSessionUser = { id: 'user-123', email: 'test@test.com' };
  const mockLoggedInUser = { id: 'user-123', email: 'test@test.com', role: 'student' };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new AuthApiRepository();

    mockMapSessionToUser.mockReturnValue(mockLoggedInUser);
  });

  describe('login', () => {
    it('should call signInWithPassword and return mapped user on success', async () => {
      mockAuth.signInWithPassword.mockResolvedValue({ data: { user: mockSessionUser }, error: null });

      const result = await repository.login('test@test.com', '123456');

      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({ email: 'test@test.com', password: '123456' });
      expect(mockMapSessionToUser).toHaveBeenCalledWith(mockSessionUser);
      expect(result).toEqual(mockLoggedInUser);
    });

    it('should throw error if Supabase returns error', async () => {
      mockAuth.signInWithPassword.mockResolvedValue({ data: {}, error: { message: 'Invalid login' } });
      await expect(repository.login('a', 'b')).rejects.toThrow('Invalid login');
    });

    it('should throw error if data.user is missing', async () => {
      mockAuth.signInWithPassword.mockResolvedValue({ data: { user: null }, error: null });
      await expect(repository.login('a', 'b')).rejects.toThrow('No se pudo iniciar sesión');
    });
  });

  describe('loginWithGoogle', () => {
    it('should configure OAuth correctly for Expo Go and open the returned URL', async () => {
      const fakeRedirectUrl = 'exp://127.0.0.1:19000/--/auth/callback';
      const fakeOAuthUrl = 'https://accounts.google.com/o/oauth2/...';
      
      (Linking.createURL as jest.Mock).mockReturnValue(fakeRedirectUrl);
      mockAuth.signInWithOAuth.mockResolvedValue({ data: { url: fakeOAuthUrl }, error: null });

      await repository.loginWithGoogle();

      expect(Linking.createURL).toHaveBeenCalledWith('auth/callback');

      expect(mockAuth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: fakeRedirectUrl,
          skipBrowserRedirect: true, 
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          },
        },
      });

      expect(Linking.openURL).toHaveBeenCalledWith(fakeOAuthUrl);
    });

    it('should throw error if signInWithOAuth fails', async () => {
      (Linking.createURL as jest.Mock).mockReturnValue('url');
      mockAuth.signInWithOAuth.mockResolvedValue({ data: null, error: { message: 'OAuth Failed' } });

      await expect(repository.loginWithGoogle()).rejects.toThrow('OAuth Failed');
    });
  });

  describe('logout', () => {
    it('should call signOut', async () => {
      mockAuth.signOut.mockResolvedValue({ error: null });
      await repository.logout();
      expect(mockAuth.signOut).toHaveBeenCalled();
    });

    it('should catch and warn errors but NOT throw (Graceful Logout)', async () => {
      mockAuth.signOut.mockResolvedValue({ error: { message: 'Network error' } });
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await repository.logout();

      expect(consoleSpy).toHaveBeenCalledWith('Error al cerrar sesión', expect.any(Object));
      consoleSpy.mockRestore();
    });
  });

  describe('getSession', () => {
    it('should return mapped user if session exists', async () => {
      mockAuth.getSession.mockResolvedValue({ data: { session: { user: mockSessionUser } } });
      
      const result = await repository.getSession();
      
      expect(mockAuth.getSession).toHaveBeenCalled();
      expect(result).toEqual(mockLoggedInUser);
    });

    it('should return null if no session user exists', async () => {
      mockAuth.getSession.mockResolvedValue({ data: { session: null } });
      
      const result = await repository.getSession();
      
      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should sign up with email/password if isGoogle is false', async () => {
      const registerData: any = { isGoogle: false, email: 'new@test.com', password: '123' };
      mockAuth.signUp.mockResolvedValue({ data: { user: { id: 'new-id' } }, error: null });

      const id = await repository.register(registerData);

      expect(mockAuth.signUp).toHaveBeenCalledWith({ email: 'new@test.com', password: '123' });
      expect(id).toBe('new-id');
    });

    it('should return current user ID if isGoogle is true', async () => {
      const registerData: any = { isGoogle: true };
      mockAuth.getUser.mockResolvedValue({ data: { user: { id: 'google-id' } } });

      const id = await repository.register(registerData);

      expect(mockAuth.signUp).not.toHaveBeenCalled();
      expect(mockAuth.getUser).toHaveBeenCalled();
      expect(id).toBe('google-id');
    });
  });

  describe('checkSessionAlive', () => {
    it('should return true if getUser returns a user', async () => {
      mockAuth.getUser.mockResolvedValue({ data: { user: {} }, error: null });
      const result = await repository.checkSessionAlive();
      expect(result).toBe(true);
    });

    it('should return false if getUser fails', async () => {
      mockAuth.getUser.mockResolvedValue({ data: { user: null }, error: { message: 'No session' } });
      const result = await repository.checkSessionAlive();
      expect(result).toBe(false);
    });

    it('should return false on exception', async () => {
      mockAuth.getUser.mockRejectedValue(new Error('Network crash'));
      const result = await repository.checkSessionAlive();
      expect(result).toBe(false);
    });
  });

  describe('getPendingSocialUser', () => {
    it('should parse metadata correctly splitting names', async () => {
      mockAuth.getUser.mockResolvedValue({
        data: {
          user: {
            email: 'social@test.com',
            user_metadata: { full_name: 'Juan Pablo Perez' }
          }
        }
      });

      const result = await repository.getPendingSocialUser();

      expect(result).toEqual({
        email: 'social@test.com',
        firstName: 'Juan',
        lastName: 'Pablo Perez'
      });
    });

    it('should handle single name correctly', async () => {
        mockAuth.getUser.mockResolvedValue({
          data: {
            user: {
              email: 'cher@test.com',
              user_metadata: { full_name: 'Cher' }
            }
          }
        });
  
        const result = await repository.getPendingSocialUser();
  
        expect(result).toEqual({
          email: 'cher@test.com',
          firstName: 'Cher',
          lastName: ''
        });
      });

    it('should return null if no user found', async () => {
      mockAuth.getUser.mockResolvedValue({ data: { user: null } });
      const result = await repository.getPendingSocialUser();
      expect(result).toBeNull();
    });
  });

  describe('deleteAuthUser', () => {
    it('should call RPC delete_own_user and then logout', async () => {
      mockRpc.mockResolvedValue({ error: null });
      mockAuth.signOut.mockResolvedValue({ error: null });

      await repository.deleteAuthUser();

      expect(mockRpc).toHaveBeenCalledWith('delete_own_user');
      expect(mockAuth.signOut).toHaveBeenCalled();
    });

    it('should throw error if RPC fails', async () => {
      mockRpc.mockResolvedValue({ error: { message: 'RPC Error' } });
      await expect(repository.deleteAuthUser()).rejects.toThrow('No se pudo eliminar el usuario');
      expect(mockAuth.signOut).not.toHaveBeenCalled();
    });
  });
});