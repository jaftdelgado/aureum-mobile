import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useTeamAssets } from '@features/assets/hooks/useTeamAssets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GetTeamAssetsUseCase } from '@domain/use-cases/team-assets/GetTeamAssetsUseCase';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@infra/external/supabase', () => ({
  supabase: {},
}));

jest.mock('@infra/api/team-assets/TeamAssetApiRepository');

jest.unmock('@domain/use-cases/team-assets/GetTeamAssetsUseCase');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTeamAssets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch team assets and compute public IDs', async () => {
    const mockAssets = [{ asset: { publicId: 'a1' } }, { asset: { publicId: 'a2' } }] as any;

    const executeSpy = jest
      .spyOn(GetTeamAssetsUseCase.prototype, 'execute')
      .mockResolvedValue(mockAssets);

    const { result } = renderHook(() => useTeamAssets('team-1'), { wrapper: createWrapper() });

    await waitFor(() => expect(executeSpy).toHaveBeenCalledWith('team-1'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(false);
    expect(result.current.assets).toEqual(mockAssets);
    expect(result.current.assetPublicIds).toEqual(['a1', 'a2']);

    executeSpy.mockRestore();
  });

  it('should not fetch if teamId is empty', async () => {
    const executeSpy = jest.spyOn(GetTeamAssetsUseCase.prototype, 'execute');

    const { result } = renderHook(() => useTeamAssets(''), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(executeSpy).not.toHaveBeenCalled();

    executeSpy.mockRestore();
  });
});
