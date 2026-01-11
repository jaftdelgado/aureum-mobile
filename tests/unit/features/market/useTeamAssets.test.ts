import { renderHook } from '@testing-library/react-native';
import { useTeamAssets } from '@features/market/hooks/useTeamAssets';
import { useQuery } from '@tanstack/react-query';

jest.mock('@infra/api/team-assets/TeamAssetApiRepository', () => ({
  TeamAssetApiRepository: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

describe('useTeamAssets Hook (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should configure useQuery with enabled=false when teamId is empty', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: false,
    });

    renderHook(() => useTeamAssets(''));

    const opts = (useQuery as jest.Mock).mock.calls[0][0];
    expect(opts.enabled).toBe(false);
    expect(opts.queryKey).toEqual(['team-assets', '']);
  });

  it('should return assets and query flags', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [{ id: '1' }],
      isLoading: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isRefetching: true,
    });

    const { result } = renderHook(() => useTeamAssets('team-1'));

    expect(result.current.assets).toEqual([{ id: '1' }]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isRefetching).toBe(true);
  });
});
