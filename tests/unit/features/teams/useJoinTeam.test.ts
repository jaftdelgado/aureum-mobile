import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useJoinTeam } from '@features/teams/hooks/useJoinTeam';
import { useAuth } from '@app/providers/AuthProvider';
import { joinTeamUseCase } from '@app/di';
import { invalidateTeamsCache } from '@features/teams/hooks/useTeamsList';
import { Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';

jest.mock('@app/providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@app/di', () => ({
  joinTeamUseCase: { execute: jest.fn() },
}));

jest.mock('@features/teams/hooks/useTeamsList', () => ({
  invalidateTeamsCache: jest.fn(),
}));

const mockGoBack = jest.fn();
const mockAddListener = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    addListener: mockAddListener,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def: string) => def || key }),
}));

jest.mock('@core/utils/errorMapper', () => ({
  getUserFriendlyErrorMessage: jest.fn(() => 'Error procesado'),
}));

jest.spyOn(Alert, 'alert');
jest.spyOn(Keyboard, 'dismiss');

describe('useJoinTeam Hook', () => {
  const mockUser = { id: 'user-123' };
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    mockAddListener.mockReturnValue(() => {}); 
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Validation Logic', () => {
    it('should validate empty code', async () => {
      const { result } = renderHook(() => useJoinTeam());

      act(() => { result.current.setCode(''); });
      await act(async () => { await result.current.handleJoin(); });

      expect(Alert.alert).toHaveBeenCalledWith(expect.anything(), 'join.code_required');
      expect(joinTeamUseCase.execute).not.toHaveBeenCalled();
    });

    it('should validate short code (< 8 chars)', async () => {
      const { result } = renderHook(() => useJoinTeam());

      act(() => { result.current.setCode('1234567'); });
      await act(async () => { await result.current.handleJoin(); });

      expect(Alert.alert).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('El código es muy corto')
      );
      expect(joinTeamUseCase.execute).not.toHaveBeenCalled();
    });

    it('should validate invalid characters (non-alphanumeric)', async () => {
      const { result } = renderHook(() => useJoinTeam());

      act(() => { result.current.setCode('ABC-12345'); }); 
      await act(async () => { await result.current.handleJoin(); });

      expect(Alert.alert).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('solo debe contener letras y números')
      );
      expect(joinTeamUseCase.execute).not.toHaveBeenCalled();
    });
  });

  describe('Join Logic', () => {
    it('should execute joinTeamUseCase successfully', async () => {
      const { result } = renderHook(() => useJoinTeam());
      const validCode = 'ABC12345';

      act(() => { result.current.setCode(validCode); });

      await act(async () => { await result.current.handleJoin(); });

      expect(Keyboard.dismiss).toHaveBeenCalled();
      expect(result.current.loading).toBe(false);
      expect(joinTeamUseCase.execute).toHaveBeenCalledWith(mockUser.id, validCode);
      expect(invalidateTeamsCache).toHaveBeenCalledWith(mockUser.id);
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'common.success',
        'join.success_msg',
        expect.any(Array)
      );

      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      buttons[0].onPress();
      expect(mockGoBack).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const { result } = renderHook(() => useJoinTeam());
      const validCode = 'ABC12345';
      
      (joinTeamUseCase.execute as jest.Mock).mockRejectedValue(new Error('Invalid Code'));

      act(() => { result.current.setCode(validCode); });
      await act(async () => { await result.current.handleJoin(); });

      expect(result.current.loading).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Join Team Error:', expect.any(Error));
      expect(Alert.alert).toHaveBeenCalledWith('common.error', 'Error procesado');
    });

    it('should not proceed if user id is missing', async () => {
      (useAuth as jest.Mock).mockReturnValue({ user: null });
      const { result } = renderHook(() => useJoinTeam());

      await act(async () => { await result.current.handleJoin(); });

      expect(joinTeamUseCase.execute).not.toHaveBeenCalled();
    });
  });

  describe('Navigation Protection', () => {
    it('should prevent navigation if loading', async () => {
        let resolveJoin: any;
        (joinTeamUseCase.execute as jest.Mock).mockReturnValue(new Promise(r => { resolveJoin = r; }));

        const { result } = renderHook(() => useJoinTeam());
        
        act(() => { result.current.setCode('ABC12345'); });
        
        let joinPromise: any;
        await act(async () => {
            joinPromise = result.current.handleJoin();
        });

        const lastCall = mockAddListener.mock.lastCall;
        const listenerCallback = lastCall[1];
        const mockEvent = { preventDefault: jest.fn() };

        act(() => { listenerCallback(mockEvent); });

        expect(mockEvent.preventDefault).toHaveBeenCalled();

        await act(async () => {
            resolveJoin();
            await joinPromise;
        });
    });

    it('should allow navigation if not loading', () => {
        renderHook(() => useJoinTeam());

        const lastCall = mockAddListener.mock.lastCall;
        const listenerCallback = lastCall[1];
        const mockEvent = { preventDefault: jest.fn() };

        act(() => { listenerCallback(mockEvent); });

        expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });
  });
});