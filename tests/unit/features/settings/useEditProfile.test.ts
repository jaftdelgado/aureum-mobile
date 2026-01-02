import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useEditProfile } from '@features/settings/hooks/useEditProfile';
import { useAuth } from '@app/providers/AuthProvider';
import { updateProfileUseCase } from '@app/di';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform, Linking } from 'react-native';
import { ImageUploadError } from '@domain/use-cases/profile/UpdateProfileUseCase';

jest.mock('@app/providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@app/di', () => ({
  updateProfileUseCase: {
    execute: jest.fn(),
  },
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
}));

const mockGoBack = jest.fn();
const mockDispatch = jest.fn();
const mockAddListener = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    dispatch: mockDispatch,
    addListener: mockAddListener,
  }),
  useRoute: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def: string) => def || key }),
}));

jest.mock('@core/utils/profile', () => ({
  getInitials: jest.fn(() => 'JP'),
}));

jest.mock('@core/utils/errorMapper', () => ({
  getUserFriendlyErrorMessage: jest.fn(() => 'Error procesado'),
}));

jest.spyOn(Alert, 'alert');
jest.spyOn(Linking, 'openSettings');

describe('useEditProfile Hook', () => {
  const mockUser = { id: 'user-1' };
  const mockRefreshSession = jest.fn().mockResolvedValue(undefined);
  
  const initialProfile = {
    id: 'p1',
    firstName: 'Juan',
    lastName: 'Perez',
    fullName: 'Juan Perez',
    bio: 'Old Bio',
    avatarUrl: 'http://old.jpg'
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      refreshSession: mockRefreshSession,
    });

    (useRoute as jest.Mock).mockReturnValue({
      params: { profile: initialProfile }
    });

    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({ canceled: true });
    
    mockAddListener.mockReturnValue(() => {});
  });

  describe('Initialization', () => {
    it('should initialize with profile data', () => {
      const { result } = renderHook(() => useEditProfile());

      expect(result.current.fullName).toBe('Juan Perez');
      expect(result.current.bio).toBe('Old Bio');
      expect(result.current.imageSource).toEqual({ uri: 'http://old.jpg' });
      expect(result.current.hasChanges).toBe(false);
    });

    it('should navigate back if no profile provided', () => {
      (useRoute as jest.Mock).mockReturnValue({ params: { profile: null } });
      renderHook(() => useEditProfile());
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('Interactions & State', () => {
    it('should detect changes in text fields', () => {
      const { result } = renderHook(() => useEditProfile());

      act(() => {
        result.current.setBio('New Bio');
      });

      expect(result.current.hasChanges).toBe(true);
      expect(result.current.bio).toBe('New Bio');
    });

    it('should detect changes in image', async () => {
      const { result } = renderHook(() => useEditProfile());

      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
        canceled: false,
        assets: [{ uri: 'new-img.jpg', fileSize: 1000 }]
      });

      await act(async () => {
        await result.current.pickImage();
      });

      expect(result.current.hasChanges).toBe(true);
      expect(result.current.imageSource).toEqual({ uri: 'new-img.jpg' });
    });
  });

  describe('Image Picker Logic', () => {
    it('should show alert and open settings if permission denied', async () => {
      (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      
      const { result } = renderHook(() => useEditProfile());
      
      await act(async () => {
        await result.current.pickImage();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Permiso denegado',
        expect.anything(),
        expect.any(Array)
      );

      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      buttons[1].onPress();
    });

    it('should warn if image is too large', async () => {
      const { result } = renderHook(() => useEditProfile());

      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
        canceled: false,
        assets: [{ uri: 'huge.jpg', fileSize: 10 * 1024 * 1024 }]
      });

      await act(async () => {
        await result.current.pickImage();
      });

      expect(Alert.alert).toHaveBeenCalledWith(expect.anything(), expect.stringContaining('5MB'));
      expect(result.current.hasChanges).toBe(false);
    });
  });

  describe('Save Logic', () => {
    it('should validate empty name', async () => {
      const { result } = renderHook(() => useEditProfile());

      act(() => { result.current.setFullName('   '); });

      await act(async () => {
        await result.current.handleSave();
      });

      expect(Alert.alert).toHaveBeenCalledWith(expect.anything(), 'El nombre es obligatorio');
      expect(updateProfileUseCase.execute).not.toHaveBeenCalled();
    });

    it('should execute update, refresh session and go back on success', async () => {
      const { result } = renderHook(() => useEditProfile());

      act(() => { 
        result.current.setFullName('Ana Gomez');
        result.current.setBio('New');
      });

      await act(async () => {
        await result.current.handleSave();
      });

      expect(updateProfileUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-1',
        firstName: 'Ana',
        lastName: 'Gomez',
        bio: 'New',
        image: undefined
      });
      expect(mockRefreshSession).toHaveBeenCalled();
      expect(mockGoBack).toHaveBeenCalled();
    });

    it('should handle partial success (ImageUploadError)', async () => {
      const { result } = renderHook(() => useEditProfile());

      (updateProfileUseCase.execute as jest.Mock).mockRejectedValue(new ImageUploadError());

      await act(async () => {
        await result.current.handleSave();
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('hubo un problema subiendo la foto'),
        expect.any(Array)
      );
      
      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      await buttons[0].onPress();

      expect(mockRefreshSession).toHaveBeenCalled();
      expect(mockGoBack).toHaveBeenCalled();
    });

    it('should handle generic errors', async () => {
      const { result } = renderHook(() => useEditProfile());
      (updateProfileUseCase.execute as jest.Mock).mockRejectedValue(new Error('Boom'));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(Alert.alert).toHaveBeenCalledWith(expect.anything(), 'Error procesado');
    });
  });

  describe('Navigation Protection (beforeRemove)', () => {
    it('should prevent navigation and show alert if unsaved changes exist', () => {
      const { result } = renderHook(() => useEditProfile());

      act(() => { result.current.setBio('Changed'); });

      const lastCall = mockAddListener.mock.calls[mockAddListener.mock.calls.length - 1];
      const listenerCallback = lastCall[1];

      const mockEvent = {
        preventDefault: jest.fn(),
        data: { action: { type: 'GO_BACK' } }
      };

      act(() => {
        listenerCallback(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        expect.anything(),
        'Tienes cambios sin guardar. ¿Deseas salir?',
        expect.any(Array)
      );

      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      const discardButton = buttons.find((b: any) => b.style === 'destructive');
      
      discardButton.onPress();
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'GO_BACK' });
    });

    it('should ALLOW navigation if no changes exist', () => {
      renderHook(() => useEditProfile());

      const lastCall = mockAddListener.mock.calls[mockAddListener.mock.calls.length - 1];
      const listenerCallback = lastCall[1];
      const mockEvent = { preventDefault: jest.fn() };

      act(() => { listenerCallback(mockEvent); });

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });
  });
});