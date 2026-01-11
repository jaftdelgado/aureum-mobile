import { renderHook, act } from '@testing-library/react-native';
import { useSaveMarketConfig } from '@features/market/hooks/useMarketConfigMutations';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Evita imports a infra real (client.ts -> supabase.ts -> AsyncStorage)
jest.mock('@infra/api/market-config/MarketConfigApiRepository', () => ({
  MarketConfigApiRepository: jest.fn().mockImplementation(() => ({
    // Si tu hook llama algo del repo, esto evita "is not a function"
    saveMarketConfig: jest.fn().mockResolvedValue({ ok: true }),
    updateMarketConfig: jest.fn().mockResolvedValue({ ok: true }),
  })),
}));

const mockInvalidateQueries = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

describe('useSaveMarketConfig Hook (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });

    (useMutation as jest.Mock).mockImplementation((opts: any) => {
      return {
        mutateAsync: async (variables: any) => {
          const res = await opts.mutationFn(variables);
          opts.onSuccess?.(res, variables);
          return res;
        },
      };
    });
  });

  it('should call invalidateQueries onSuccess using variables.teamId', async () => {
    const { result } = renderHook(() => useSaveMarketConfig());

    await act(async () => {
      await result.current.mutateAsync({ teamId: 'team-1', publicId: 'cfg-1' } as any);
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['market-config', 'team-1'],
    });
  });
});
