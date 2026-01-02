import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useProfile } from '@features/settings/hooks/useProfile';
import { useAuth } from '@app/providers/AuthProvider';
import { profileRepository } from '@app/di';

jest.mock('@app/providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@app/di', () => ({
  profileRepository: {
    getProfile: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useFocusEffect: jest.fn((callback) => callback()),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 10, bottom: 20 }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@core/utils/profile', () => ({
  getInitials: jest.fn(() => 'JP'),
}));

describe('useProfile Hook', () => {
  const mockUser = { id: 'user-123', email: 'test@test.com' };
  const mockProfile = {
    id: 'profile-1',
    userId: 'user-123',
    fullName: 'Juan Perez',
    username: 'juanp',
    avatarUrl: 'http://avatar.com/me.jpg',
    bio: 'Hello',
    role: 'student'
  };

  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (profileRepository.getProfile as jest.Mock).mockResolvedValue(mockProfile);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Data Fetching & State', () => {
    it('should fetch profile on focus/mount', async () => {
      const { result } = renderHook(() => useProfile());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(profileRepository.getProfile).toHaveBeenCalledWith('user-123');
      expect(result.current.profile).toEqual(mockProfile);
      expect(result.current.avatarUrl).toBe('http://avatar.com/me.jpg');
      expect(result.current.initials).toBe('JP');
    });

    it('should handle missing user ID gracefully', async () => {
      (useAuth as jest.Mock).mockReturnValue({ user: null });

      const { result } = renderHook(() => useProfile());

      expect(profileRepository.getProfile).not.toHaveBeenCalled();
      expect(result.current.loading).toBe(true); 
    });

    it('should handle repository error gracefully', async () => {
      (profileRepository.getProfile as jest.Mock).mockRejectedValue(new Error('Network Fail'));

      const { result } = renderHook(() => useProfile());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.profile).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching profile:', expect.any(Error));
    });
  });

  describe('Interactions', () => {
    it('should expose navigation handlers', () => {
      const { result } = renderHook(() => useProfile());

      act(() => {
        result.current.handleGoBack();
      });
      expect(mockGoBack).toHaveBeenCalled();

      act(() => {
        result.current.handleEditProfile(mockProfile as any);
      });
      expect(mockNavigate).toHaveBeenCalledWith('EditProfile', { profile: mockProfile });
    });

    it('should provide animated scrollY', () => {
      const { result } = renderHook(() => useProfile());
      expect(result.current.scrollY).toBeDefined();
      expect(result.current.scrollY).toHaveProperty('addListener');
    });

    it('should provide safe area insets', () => {
        const { result } = renderHook(() => useProfile());
        expect(result.current.insets).toEqual({ top: 10, bottom: 20 });
    });
  });
});