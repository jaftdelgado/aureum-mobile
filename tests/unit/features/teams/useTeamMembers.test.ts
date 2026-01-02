import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useTeamMembers } from '@features/teams/hooks/useTeamMembers';
import { useAuth } from '@app/providers/AuthProvider';
import { Alert } from 'react-native';

jest.mock('@app/providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@app/di', () => ({
  teamsRepository: {},
}));

const mockGetExecute = jest.fn();
const mockRemoveExecute = jest.fn();

jest.mock('../../../../src/domain/use-cases/teams/GetTeamMembersUseCase', () => ({
  GetTeamMembersUseCase: jest.fn().mockImplementation(() => ({
    execute: mockGetExecute,
  })),
}));

jest.mock('../../../../src/domain/use-cases/teams/RemoveMemberUseCase', () => ({
  RemoveMemberUseCase: jest.fn().mockImplementation(() => ({
    execute: mockRemoveExecute,
  })),
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useFocusEffect: (effect: any) => {
      React.useEffect(effect, []);
    },
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@core/utils/errorMapper', () => ({
  getUserFriendlyErrorMessage: jest.fn(() => 'Error procesado'),
}));

jest.spyOn(Alert, 'alert');

describe('useTeamMembers Hook', () => {
  const teamId = 'team-123';
  const mockMembers = [
    { id: '1', name: 'Zara', role: 'student' },
    { id: '2', name: 'Adam', role: 'student' },
    { id: '3', name: 'Profe', role: 'professor' },
  ];

  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (useAuth as jest.Mock).mockReturnValue({ user: { role: 'professor' } });
    mockGetExecute.mockResolvedValue(mockMembers);
    mockRemoveExecute.mockResolvedValue(undefined);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Fetching & Sorting', () => {
    it('should fetch members and sort them (Professor first, then alphabetical)', async () => {
      const { result } = renderHook(() => useTeamMembers(teamId));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetExecute).toHaveBeenCalledWith(teamId);
      
      const members = result.current.members;
      expect(members[0].name).toBe('Profe'); 
      expect(members[1].name).toBe('Adam'); 
      expect(members[2].name).toBe('Zara');
    });

    it('should handle fetch errors gracefully', async () => {
      mockGetExecute.mockRejectedValue(new Error('Fetch Fail'));

      const { result } = renderHook(() => useTeamMembers(teamId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.members).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching members:', expect.any(Error));
    });

    it('onRefresh should reload members', async () => {
      const { result } = renderHook(() => useTeamMembers(teamId));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.onRefresh();
      });

      expect(mockGetExecute).toHaveBeenCalledTimes(2); 
      expect(result.current.refreshing).toBe(false);
    });
  });

  describe('Remove Member Logic', () => {
    it('should NOT allow removal if user is not professor', () => {
      (useAuth as jest.Mock).mockReturnValue({ user: { role: 'student' } });
      const { result } = renderHook(() => useTeamMembers(teamId));

      act(() => {
        result.current.handleRemoveMember('1', 'Zara');
      });

      expect(Alert.alert).not.toHaveBeenCalled();
      expect(mockRemoveExecute).not.toHaveBeenCalled();
      expect(result.current.isProfessor).toBe(false);
    });

    it('should show confirmation alert for professor', () => {
      const { result } = renderHook(() => useTeamMembers(teamId));

      act(() => {
        result.current.handleRemoveMember('1', 'Zara');
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'members.remove_confirm_title',
        expect.anything(),
        expect.any(Array)
      );
    });

    it('should execute removal and update state optimistically on confirm', async () => {
      const { result } = renderHook(() => useTeamMembers(teamId));

      await waitFor(() => expect(result.current.members).toHaveLength(3));

      act(() => {
        result.current.handleRemoveMember('1', 'Zara');
      });
      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      const deleteButton = buttons.find((b: any) => b.style === 'destructive');

      await act(async () => {
        await deleteButton.onPress();
      });

      expect(mockRemoveExecute).toHaveBeenCalledWith(teamId, '1');
      expect(result.current.members).toHaveLength(2);
      expect(result.current.members.find(m => m.id === '1')).toBeUndefined();

      expect(Alert.alert).toHaveBeenCalledWith('common.success', 'members.remove_success');
    });

    it('should handle removal errors (show alert + refetch)', async () => {
      const { result } = renderHook(() => useTeamMembers(teamId));
      await waitFor(() => expect(result.current.loading).toBe(false));

      mockRemoveExecute.mockRejectedValue(new Error('Delete Fail'));

      act(() => {
        result.current.handleRemoveMember('1', 'Zara');
      });

      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      const deleteButton = buttons.find((b: any) => b.style === 'destructive');

      await act(async () => {
        await deleteButton.onPress();
      });

      expect(consoleSpy).toHaveBeenCalledWith('Error removing member:', expect.any(Error));
      expect(Alert.alert).toHaveBeenCalledWith('common.error', 'Error procesado');

      expect(mockGetExecute).toHaveBeenCalledTimes(2);
    });
  });
});