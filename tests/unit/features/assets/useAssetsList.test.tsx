import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useAssetsList } from '@features/assets/hooks/useAssetsList';
import { GetAssetsUseCase } from '@domain/use-cases/assets/GetAssetsUseCase';
import { useAssetsFilters } from '@features/assets/hooks/useAssetsFilters';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@infra/external/supabase', () => ({
  supabase: {},
}));

jest.mock('@infra/api/assets/AssetApiRepository');
jest.mock('@features/assets/hooks/useAssetsFilters');

jest.unmock('@domain/use-cases/assets/GetAssetsUseCase');

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
    <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
  );
};

describe('useAssetsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAssetsFilters as unknown as jest.Mock).mockReturnValue({
      perPage: 10,
      search: '',
      sortKey: null,
      sortDir: null,
    });
  });

  it('should fetch assets successfully', async () => {
    const mockResponse = {
      data: [{ id: '1', symbol: 'AAPL' }],
      meta: { currentPage: 1, totalPages: 1, totalItems: 1, itemCount: 1, itemsPerPage: 10 },
    } as any;

    const executeSpy = jest
      .spyOn(GetAssetsUseCase.prototype, 'execute')
      .mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAssetsList(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.pages[0].data).toHaveLength(1);
    expect(executeSpy).toHaveBeenCalled();

    executeSpy.mockRestore();
  });

  it('should pass filters to the use case', async () => {
    (useAssetsFilters as unknown as jest.Mock).mockReturnValue({
      perPage: 20,
      search: 'Tesla',
      sortKey: 'basePrice',
      sortDir: 'desc',
    });

    const mockResponse = {
      data: [],
      meta: { currentPage: 1, totalPages: 1, totalItems: 0, itemCount: 0, itemsPerPage: 20 },
    } as any;

    const executeSpy = jest
      .spyOn(GetAssetsUseCase.prototype, 'execute')
      .mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAssetsList(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(executeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        limit: 20,
        search: 'Tesla',
        orderByBasePrice: 'desc',
      })
    );

    executeSpy.mockRestore();
  });

  it('should pass selectedAssetIds if provided', async () => {
    const mockResponse = {
      data: [],
      meta: { currentPage: 1, totalPages: 1, totalItems: 0, itemCount: 0, itemsPerPage: 10 },
    } as any;

    const executeSpy = jest
      .spyOn(GetAssetsUseCase.prototype, 'execute')
      .mockResolvedValue(mockResponse);

    const selectedIds = ['1', '2'];
    const { result } = renderHook(() => useAssetsList(selectedIds), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(executeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedAssetIds: selectedIds,
      })
    );

    executeSpy.mockRestore();
  });
});
