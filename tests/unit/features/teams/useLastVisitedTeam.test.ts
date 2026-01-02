import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useLastVisitedTeam } from '@features/teams/hooks/useLastVisitedTeam';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useFocusEffect: (effect: any) => {
      React.useEffect(effect, []);
    },
  };
});

describe('useLastVisitedTeam Hook', () => {
  const mockTeam = { id: 'team-1', name: 'Alpha Team', code: '123' };
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Loading Logic', () => {
    it('should load team from storage on mount', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockTeam));

      const { result } = renderHook(() => useLastVisitedTeam());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@aureum_last_visited_team');
      expect(result.current.lastTeam).toEqual(mockTeam);
    });

    it('should handle empty storage (null)', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useLastVisitedTeam());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.lastTeam).toBeNull();
    });

    it('should handle storage errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage Fail'));

      const { result } = renderHook(() => useLastVisitedTeam());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.lastTeam).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Error loading last team', expect.any(Error));
    });
  });

  describe('Saving Logic', () => {
    it('should save team to storage and update state', async () => {
      const { result } = renderHook(() => useLastVisitedTeam());

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.saveLastTeam(mockTeam as any);
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@aureum_last_visited_team',
        JSON.stringify(mockTeam)
      );
      expect(result.current.lastTeam).toEqual(mockTeam);
    });

    it('should handle save errors gracefully', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Write Fail'));

      const { result } = renderHook(() => useLastVisitedTeam());
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.saveLastTeam(mockTeam as any);
      });

      expect(result.current.lastTeam).toBeNull(); 
      expect(consoleSpy).toHaveBeenCalledWith('Error saving last team', expect.any(Error));
    });
  });
});