import { renderHook, act } from '@testing-library/react-native';
import { useSelectedTeam } from '@features/teams/hooks/useSelectedTeam';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useRoute: jest.fn(),
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def: string) => def || key }),
}));

jest.spyOn(Alert, 'alert');

describe('useSelectedTeam Hook', () => {
  const mockTeam = {
    public_id: 'team-123',
    name: 'Team Alpha',
    description: 'Best Team',
    access_code: 'CODE123',
  };

  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    consoleLogSpy.mockRestore();
  });

  describe('Initialization', () => {
    it('should initialize with team data correctly', () => {
      (useRoute as jest.Mock).mockReturnValue({ params: { team: mockTeam } });

      const { result } = renderHook(() => useSelectedTeam());

      expect(result.current.team).toEqual(mockTeam);
      expect(result.current.teamName).toBe('Team Alpha');
      expect(result.current.teamDescription).toBe('Best Team');
      expect(result.current.accessCode).toBe('CODE123');
      expect(result.current.isCopied).toBe(false);
      expect(result.current.scrollY).toBeDefined();
    });

    it('should handle missing team name (untitled)', () => {
      const teamNoName = { ...mockTeam, name: undefined };
      (useRoute as jest.Mock).mockReturnValue({ params: { team: teamNoName } });

      const { result } = renderHook(() => useSelectedTeam());

      expect(result.current.teamName).toBe('team.untitled');
    });

    it('should alert and go back if team is missing in params', () => {
      (useRoute as jest.Mock).mockReturnValue({ params: {} });

      renderHook(() => useSelectedTeam());

      expect(Alert.alert).toHaveBeenCalledWith(
        'common.error',
        expect.anything(), 
        expect.any(Array)
      );

      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      buttons[0].onPress();

      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    beforeEach(() => {
      (useRoute as jest.Mock).mockReturnValue({ params: { team: mockTeam } });
    });

    it('handleCopyCode should copy to clipboard and toggle state', async () => {
      const { result } = renderHook(() => useSelectedTeam());

      await act(async () => {
        await result.current.handleCopyCode();
      });

      expect(Clipboard.setStringAsync).toHaveBeenCalledWith('CODE123');
      expect(result.current.isCopied).toBe(true);

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.isCopied).toBe(false);
    });

    it('handleCopyCode should do nothing if code is N/A', async () => {
      const teamNA = { ...mockTeam, access_code: 'N/A' };
      (useRoute as jest.Mock).mockReturnValue({ params: { team: teamNA } });

      const { result } = renderHook(() => useSelectedTeam());

      await act(async () => {
        await result.current.handleCopyCode();
      });

      expect(Clipboard.setStringAsync).not.toHaveBeenCalled();
      expect(result.current.isCopied).toBe(false);
    });

    it('handleBack should call navigation.goBack', () => {
      const { result } = renderHook(() => useSelectedTeam());
      
      act(() => { result.current.handleBack(); });
      
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('Navigation Handlers', () => {
    beforeEach(() => {
      (useRoute as jest.Mock).mockReturnValue({ params: { team: mockTeam } });
    });

    it('should navigate to Assets', () => {
      const { result } = renderHook(() => useSelectedTeam());
      act(() => { result.current.handleAssets(); });
      
      expect(mockNavigate).toHaveBeenCalledWith('AssetsRoot', {
        screen: 'Assets',
        params: { teamId: 'team-123' }
      });
    });

    it('should navigate to Members', () => {
      const { result } = renderHook(() => useSelectedTeam());
      act(() => { result.current.handleMembers(); });

      expect(mockNavigate).toHaveBeenCalledWith('MembersRoot', {
        screen: 'Members',
        params: { teamId: 'team-123', teamName: 'Team Alpha' }
      });
    });

    it('should navigate to Market', () => {
      const { result } = renderHook(() => useSelectedTeam());
      act(() => { result.current.handleMarket(); });
      expect(mockNavigate).toHaveBeenCalledWith('MarketRoot');
    });

    it('should navigate to Transactions', () => {
      const { result } = renderHook(() => useSelectedTeam());
      act(() => { result.current.handleTransactions(); });
      expect(mockNavigate).toHaveBeenCalledWith('TransactionsRoot');
    });
  });

  describe('Placeholder Handlers (Logs)', () => {
    beforeEach(() => {
      (useRoute as jest.Mock).mockReturnValue({ params: { team: mockTeam } });
    });

    it('handleOverview should log to console', () => {
      const { result } = renderHook(() => useSelectedTeam());
      act(() => { result.current.handleOverview(); });
      expect(consoleLogSpy).toHaveBeenCalledWith('Overview for:', 'team-123');
    });

    it('handleSettings should log to console', () => {
      const { result } = renderHook(() => useSelectedTeam());
      act(() => { result.current.handleSettings(); });
      expect(consoleLogSpy).toHaveBeenCalledWith('Settings for:', 'team-123');
    });
  });
});