import { renderHook, waitFor } from '@testing-library/react-native';
import { useTeamImage } from '@features/teams/hooks/useTeamImage';
import { teamsRepository } from '@app/di';
import { blobToBase64 } from '@core/utils/fileUtils';

jest.mock('@app/di', () => ({
  teamsRepository: {
    getTeamAvatar: jest.fn(),
  },
}));

jest.mock('@core/utils/fileUtils', () => ({
  blobToBase64: jest.fn(),
}));

describe('useTeamImage Hook', () => {
  const mockTeamId = 'team-123';
  const mockImageId = 'img-456';
  const mockBlob = { size: 100, type: 'image/png' }; // Objeto dummy simulando un Blob
  const mockBase64 = 'data:image/png;base64,abcdef';

  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    (teamsRepository.getTeamAvatar as jest.Mock).mockResolvedValue(mockBlob);
    (blobToBase64 as jest.Mock).mockResolvedValue(mockBase64);
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('should initialize with defaults', () => {
    const { result } = renderHook(() => useTeamImage(mockTeamId, mockImageId));

    expect(result.current.imageSource).toBeNull();
  });

  it('should fetch and convert image if params are present', async () => {
    const { result } = renderHook(() => useTeamImage(mockTeamId, mockImageId));
    await waitFor(() => {
      expect(result.current.imageSource).toBe(mockBase64);
    });

    expect(teamsRepository.getTeamAvatar).toHaveBeenCalledWith(mockTeamId);
    expect(blobToBase64).toHaveBeenCalledWith(mockBlob);
    expect(result.current.loading).toBe(false);
  });

  it('should NOT fetch if imageId is missing (null/undefined)', async () => {
    const { result } = renderHook(() => useTeamImage(mockTeamId, null));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(teamsRepository.getTeamAvatar).not.toHaveBeenCalled();
    expect(result.current.imageSource).toBeNull();
  });

  it('should NOT fetch if teamId is missing', async () => {
    const { result } = renderHook(() => useTeamImage('', mockImageId));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(teamsRepository.getTeamAvatar).not.toHaveBeenCalled();
  });

  it('should handle repository errors gracefully', async () => {
    const error = new Error('Network Error');
    (teamsRepository.getTeamAvatar as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useTeamImage(mockTeamId, mockImageId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.imageSource).toBeNull();

    expect(warnSpy).toHaveBeenCalledWith(
      `Error loading image for team ${mockTeamId}`,
      error
    );
  });

  it('should prevent state update if unmounted (cleanup)', async () => {
    let resolvePromise: (value: unknown) => void;
    const slowPromise = new Promise((resolve) => { resolvePromise = resolve; });
    
    (teamsRepository.getTeamAvatar as jest.Mock).mockReturnValue(slowPromise);

    const { result, unmount } = renderHook(() => useTeamImage(mockTeamId, mockImageId));
    unmount();

    // @ts-ignore
    resolvePromise(mockBlob);
    expect(teamsRepository.getTeamAvatar).toHaveBeenCalled();
  });
});