import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useTeamsList, invalidateTeamsCache } from '@features/teams/hooks/useTeamsList';
import { useAuth } from '@app/providers/AuthProvider';
import { getStudentTeamsUseCase, getProfessorTeamsUseCase } from '@app/di';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@app/providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@app/di', () => ({
  getStudentTeamsUseCase: { execute: jest.fn() },
  getProfessorTeamsUseCase: { execute: jest.fn() },
}));

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useNavigation: () => ({ navigate: mockNavigate }),
    useFocusEffect: (effect: any) => {
      React.useEffect(effect, [effect]);
    },
  };
});

const mockSaveLastTeam = jest.fn();
jest.mock('@features/teams/hooks/useLastVisitedTeam', () => ({
  useLastVisitedTeam: () => ({ saveLastTeam: mockSaveLastTeam }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('useTeamsList & Caching', () => {
  const mockUserStudent = { id: 'user-1', role: 'student' };
  const mockUserProf = { id: 'prof-1', role: 'professor' };
  
  const mockTeams = [
    { id: 'team-1', name: 'Equipo Alpha', code: '123' },
    { id: 'team-2', name: 'Equipo Beta', code: '456' }
  ];

  let consoleSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    (useAuth as jest.Mock).mockReturnValue({ user: mockUserStudent });
    (getStudentTeamsUseCase.execute as jest.Mock).mockResolvedValue(mockTeams);
    (getProfessorTeamsUseCase.execute as jest.Mock).mockResolvedValue(mockTeams);
    
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    warnSpy.mockRestore();
  });

  describe('invalidateTeamsCache', () => {
    it('should remove item from AsyncStorage', async () => {
      await invalidateTeamsCache('user-1');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@teams_cache_user-1');
    });

    it('should handle errors gracefully', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error('Fail'));
      await invalidateTeamsCache('user-1');
      expect(consoleSpy).toHaveBeenCalledWith('Error invalidating cache', expect.any(Error));
    });
  });

  describe('useTeamsList Hook', () => {
    
    describe('Fetching Logic (No Cache)', () => {
      it('should fetch student teams if role is student', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUserStudent });

        const { result } = renderHook(() => useTeamsList());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        expect(getStudentTeamsUseCase.execute).toHaveBeenCalledWith('user-1');
        expect(getProfessorTeamsUseCase.execute).not.toHaveBeenCalled();
        expect(result.current.teams).toEqual(mockTeams);
        
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@teams_cache_user-1',
          expect.stringContaining('"teams":')
        );
      });

      it('should fetch professor teams if role is professor', async () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUserProf });

        const { result } = renderHook(() => useTeamsList());

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        expect(getProfessorTeamsUseCase.execute).toHaveBeenCalledWith('prof-1');
        expect(getStudentTeamsUseCase.execute).not.toHaveBeenCalled();
        expect(result.current.teams).toEqual(mockTeams);
      });

      it('should handle fetch errors gracefully', async () => {
        (getStudentTeamsUseCase.execute as jest.Mock).mockRejectedValue(new Error('API Error'));

        const { result } = renderHook(() => useTeamsList());

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        expect(result.current.teams).toEqual([]); 
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching teams:', expect.any(Error));
      });
    });

    describe('Caching Logic', () => {
      it('should return cached data if valid and not expired', async () => {
        const now = Date.now();
        const validCache = JSON.stringify({
          teams: [{ id: 'cached-team', name: 'Cached' }],
          timestamp: now - 1000 
        });

        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(validCache);

        const { result } = renderHook(() => useTeamsList());

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        expect(result.current.teams[0].name).toBe('Cached');
        expect(getStudentTeamsUseCase.execute).not.toHaveBeenCalled();
      });

      it('should fetch fresh data if cache is expired', async () => {
        const now = Date.now();
        const expiredCache = JSON.stringify({
          teams: [{ id: 'old', name: 'Old' }],
          timestamp: now - (11 * 60 * 1000) 
        });

        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(expiredCache);

        const { result } = renderHook(() => useTeamsList());

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        expect(getStudentTeamsUseCase.execute).toHaveBeenCalled();
        expect(result.current.teams).toEqual(mockTeams); 
      });

      it('should fetch fresh data if cache is corrupt', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue("invalid-json{");

        const { result } = renderHook(() => useTeamsList());

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        expect(warnSpy).toHaveBeenCalledWith('Cache corrupto, limpiando...', expect.any(Error));
        expect(AsyncStorage.removeItem).toHaveBeenCalled(); 
        expect(getStudentTeamsUseCase.execute).toHaveBeenCalled(); 
      });
    });

    describe('User Interactions', () => {
      it('onRefresh should force fetch (bypass cache)', async () => {
        const validCache = JSON.stringify({ teams: [], timestamp: Date.now() });
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(validCache);

        const { result } = renderHook(() => useTeamsList());

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
          await result.current.onRefresh();
        });

        expect(result.current.refreshing).toBe(false);
        expect(getStudentTeamsUseCase.execute).toHaveBeenCalled();
      });

      it('handleSelectTeam should save last team and navigate', () => {
        const { result } = renderHook(() => useTeamsList());
        const teamToSelect = mockTeams[0];

        act(() => {
          result.current.handleSelectTeam(teamToSelect as any);
        });

        expect(mockSaveLastTeam).toHaveBeenCalledWith(teamToSelect);
        expect(mockNavigate).toHaveBeenCalledWith('SelectedTeamRoot', { team: teamToSelect });
      });

      it('should navigate on Create and Join actions', () => {
        const { result } = renderHook(() => useTeamsList());

        act(() => { result.current.handleCreateTeam(); });
        expect(mockNavigate).toHaveBeenCalledWith('CreateTeam');

        act(() => { result.current.handleJoinTeam(); });
        expect(mockNavigate).toHaveBeenCalledWith('JoinTeam');
      });
    });

    it('should not do anything if no user', async () => {
      (useAuth as jest.Mock).mockReturnValue({ user: null });
      const { result } = renderHook(() => useTeamsList());
      
      expect(AsyncStorage.getItem).not.toHaveBeenCalled();
      expect(getStudentTeamsUseCase.execute).not.toHaveBeenCalled();
    });
  });
});