import { renderHook } from '@testing-library/react-native';
import { useMarketConfig } from '@features/market/hooks/useMarketConfig';
import { useQuery } from '@tanstack/react-query';
import { defaultMarketConfig } from '@features/market/constants/defaultMarketConfig';

jest.mock('@infra/api/market-config/MarketConfigApiRepository', () => ({
  MarketConfigApiRepository: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

describe('useMarketConfig Hook (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return defaultMarketConfig when teamPublicId is empty (no query)', () => {
    const { result } = renderHook(() => useMarketConfig(''));

    expect(result.current.data).toEqual(defaultMarketConfig);
    expect(result.current.isSuccess).toBe(true);
    expect(useQuery).not.toHaveBeenCalled();
  });

  it('should call useQuery when teamPublicId is provided', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: { any: 'config' },
      isLoading: false,
      isError: false,
      isFetching: false,
      isSuccess: true,
    });

    const { result } = renderHook(() => useMarketConfig('team-1'));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['market-config', 'team-1'],
        enabled: true,
      })
    );

    expect(result.current.data).toEqual({ any: 'config' });
  });
});
