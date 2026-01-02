import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useCreateTeam } from '@features/teams/hooks/useCreateTeam';
import { useAuth } from '@app/providers/AuthProvider';
import { createTeamUseCase } from '@app/di';
import { invalidateTeamsCache } from '@features/teams/hooks/useTeamsList';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

jest.mock('@app/providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@app/di', () => ({
  createTeamUseCase: { execute: jest.fn() },
}));

jest.mock('@features/teams/hooks/useTeamsList', () => ({
  invalidateTeamsCache: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
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
jest.spyOn(Linking, 'openSettings');

describe('useCreateTeam Hook', () => {
  const mockUserProfessor = { id: 'prof-1', role: 'professor' };
  const mockUserStudent = { id: 'student-1', role: 'student' };

  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (useAuth as jest.Mock).mockReturnValue({ user: mockUserProfessor });

    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({ canceled: true });

    mockAddListener.mockReturnValue(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Authorization', () => {
    it('should allow access if user is professor', () => {
      renderHook(() => useCreateTeam());
      expect(mockGoBack).not.toHaveBeenCalled();
    });

    it('should alert and goBack if user is NOT professor', () => {
      (useAuth as jest.Mock).mockReturnValue({ user: mockUserStudent });
      
      renderHook(() => useCreateTeam());

      expect(Alert.alert).toHaveBeenCalledWith(
        'common.error',
        expect.stringContaining('Solo los profesores')
      );
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('Image Selection', () => {
    it('should pick image successfully', async () => {
      const { result } = renderHook(() => useCreateTeam());
      const mockAsset = { uri: 'file://img.jpg', fileSize: 1000, fileName: 'img.jpg' };

      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
        canceled: false,
        assets: [mockAsset]
      });

      await act(async () => {
        await result.current.pickImage();
      });

      expect(result.current.selectedImage).toEqual(mockAsset);
    });

    it('should handle permission denied', async () => {
      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      
      const { result } = renderHook(() => useCreateTeam());
      
      await act(async () => {
        await result.current.pickImage();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        expect.stringContaining('Permiso denegado'),
        expect.anything(),
        expect.any(Array)
      );

      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      buttons[1].onPress();
    });

    it('should validate image size', async () => {
      const { result } = renderHook(() => useCreateTeam());
      
      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
        canceled: false,
        assets: [{ uri: 'huge.jpg', fileSize: 10 * 1024 * 1024 }] 
      });

      await act(async () => {
        await result.current.pickImage();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('La imagen es muy pesada')
      );
      expect(result.current.selectedImage).toBeNull();
    });
  });

  describe('Form Validation & Submission', () => {
    const fillForm = async (result: any) => {
      act(() => {
        result.current.setName('Curso React');
        result.current.setDescription('Aprende Hooks');
      });
      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
        canceled: false,
        assets: [{ uri: 'valid.jpg', fileSize: 1000 }]
      });
      await act(async () => { await result.current.pickImage(); });
    };

    it('should validate missing image', async () => {
      const { result } = renderHook(() => useCreateTeam());
      act(() => { result.current.setName('Name'); result.current.setDescription('Desc'); });

      await act(async () => { await result.current.handleCreate(); });

      expect(Alert.alert).toHaveBeenCalledWith(expect.anything(), 'create.req_image');
      expect(createTeamUseCase.execute).not.toHaveBeenCalled();
    });

    it('should validate short name', async () => {
      const { result } = renderHook(() => useCreateTeam());

      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({ canceled: false, assets: [{ uri: 'img.jpg' }] });
      await act(async () => { await result.current.pickImage(); });
      
      act(() => { result.current.setName('AB'); });

      await act(async () => { await result.current.handleCreate(); });

      expect(Alert.alert).toHaveBeenCalledWith(expect.anything(), 'create.req_name');
    });

    it('should create team successfully', async () => {
      const { result } = renderHook(() => useCreateTeam());
      
      await fillForm(result);

      await act(async () => {
        await result.current.handleCreate();
      });

      expect(createTeamUseCase.execute).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Curso React',
        professor_id: 'prof-1',
        image: expect.objectContaining({ uri: 'valid.jpg' })
      }));
      expect(invalidateTeamsCache).toHaveBeenCalledWith('prof-1');
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'create.success_title',
        'create.success_msg',
        expect.any(Array)
      );

      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      buttons[0].onPress();
      expect(mockGoBack).toHaveBeenCalled();
    });

    it('should handle creation errors', async () => {
      const { result } = renderHook(() => useCreateTeam());
      await fillForm(result);

      (createTeamUseCase.execute as jest.Mock).mockRejectedValue(new Error('Server Error'));

      await act(async () => {
        await result.current.handleCreate();
      });

      expect(consoleSpy).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith('common.error', 'Error procesado');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('Navigation Protection', () => {
    it('should prevent navigation if loading', () => {
      renderHook(() => useCreateTeam());
      
      expect(mockAddListener).toHaveBeenCalledWith('beforeRemove', expect.any(Function));

      const listenerCallback = mockAddListener.mock.calls[0][1];
      const mockEvent = { preventDefault: jest.fn() };

      listenerCallback(mockEvent);
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should prevent navigation DURING creation process', async () => {
      let resolveCreation: any;
      (createTeamUseCase.execute as jest.Mock).mockReturnValue(new Promise(r => { resolveCreation = r; }));

      const { result } = renderHook(() => useCreateTeam());

      act(() => { result.current.setName('Test'); result.current.setDescription('D'); });
      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({ canceled: false, assets: [{ uri: 'i' }] });
      await act(async () => { await result.current.pickImage(); });

      let createPromise: any;
      await act(async () => {
         createPromise = result.current.handleCreate();
      });

      const lastCall = mockAddListener.mock.lastCall;
      const listenerCallback = lastCall[1];
      const mockEvent = { preventDefault: jest.fn() };

      act(() => {
        listenerCallback(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();

      await act(async () => {
        resolveCreation();
        await createPromise;
      });
    });
  });
});