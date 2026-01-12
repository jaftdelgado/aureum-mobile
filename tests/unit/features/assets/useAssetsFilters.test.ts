import { renderHook, act } from '@testing-library/react-native';
import { useAssetsFilters } from '@features/assets/hooks/useAssetsFilters';

describe('useAssetsFilters', () => {
  it('should return default initial state', () => {
    const { result } = renderHook(() => useAssetsFilters());

    expect(result.current.perPage).toBe(10);
    expect(result.current.search).toBe('');
    expect(result.current.sortKey).toBeNull();
    expect(result.current.sortDir).toBeNull();
  });

  it('should update search term', () => {
    const { result } = renderHook(() => useAssetsFilters());

    act(() => {
      result.current.setSearch('Tesla');
    });

    expect(result.current.search).toBe('Tesla');
  });

  it('should update sort configuration', () => {
    const { result } = renderHook(() => useAssetsFilters());

    act(() => {
      result.current.setSort('basePrice', 'asc');
    });

    expect(result.current.sortKey).toBe('basePrice');
    expect(result.current.sortDir).toBe('asc');
  });

  it('should update perPage', () => {
    const { result } = renderHook(() => useAssetsFilters());

    act(() => {
      result.current.setPerPage(50);
    });

    expect(result.current.perPage).toBe(50);
  });
});
