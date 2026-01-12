import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useSyncTeamAssets } from '@features/assets/hooks/useSyncTeamAssets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockSyncTeamAssets = jest.fn();

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@infra/external/supabase', () => ({
  supabase: {},
}));

jest.mock('@infra/api/team-assets/TeamAssetApiRepository', () => {
  return {
    TeamAssetApiRepository: jest.fn().mockImplementation(() => {
      return {
        syncTeamAssets: mockSyncTeamAssets,
      };
    }),
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useSyncTeamAssets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSyncTeamAssets.mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should sync team assets successfully', async () => {
    mockSyncTeamAssets.mockResolvedValue(true);

    const { result } = renderHook(() => useSyncTeamAssets(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.mutateAsync({
        teamId: 'team-1',
        selectedAssetIds: ['asset-A', 'asset-B'],
      });
    });

    expect(mockSyncTeamAssets).toHaveBeenCalledWith('team-1', ['asset-A', 'asset-B']);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('should handle errors', async () => {
    const error = new Error('Sync failed');
    mockSyncTeamAssets.mockRejectedValue(error);

    const { result } = renderHook(() => useSyncTeamAssets(), { wrapper: createWrapper() });

    await act(async () => {
      try {
        await result.current.mutateAsync({ teamId: 'team-1', selectedAssetIds: [] });
      } catch (e) {}
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(console.error).toHaveBeenCalledWith('Error syncing team assets:', error);
  });
});
