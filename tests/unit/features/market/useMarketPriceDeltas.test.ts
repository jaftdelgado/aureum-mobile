import { renderHook } from '@testing-library/react-native';
import { useMarketPriceDeltas } from '@features/market/hooks/useMarketPriceDeltas';

describe('useMarketPriceDeltas Hook (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty map when snapshot is null', () => {
    const { result } = renderHook(() => useMarketPriceDeltas(null as any));
    expect(result.current as ReturnType<typeof useMarketPriceDeltas>).toEqual({});
  });

  it('should mark direction as flat for first seen prices', () => {
    const snapshot = {
      timestamp: new Date(1),
      assets: [
        { id: 'a', price: 10 },
        { id: 'b', price: 20 },
      ],
    } as any;

    const { result } = renderHook(() => useMarketPriceDeltas(snapshot));

    const current = result.current as ReturnType<typeof useMarketPriceDeltas>;

    expect(current['a']).toEqual(expect.objectContaining({ direction: 'flat', current: 10 }));
    expect(current['b']).toEqual(expect.objectContaining({ direction: 'flat', current: 20 }));
  });

  it('should mark direction up/down comparing to previous snapshot', () => {
    const s1 = { timestamp: new Date(1), assets: [{ id: 'a', price: 10 }] } as any;
    const s2 = { timestamp: new Date(2), assets: [{ id: 'a', price: 12 }] } as any;
    const s3 = { timestamp: new Date(3), assets: [{ id: 'a', price: 8 }] } as any;

    type Props = { snap: any };

    const { result, rerender } = renderHook<ReturnType<typeof useMarketPriceDeltas>, Props>(
      ({ snap }) => useMarketPriceDeltas(snap),
      {
        initialProps: { snap: s1 },
      }
    );

    expect(result.current['a'].direction).toBe('flat');

    rerender({ snap: s2 });
    expect(result.current['a'].direction).toBe('up');

    rerender({ snap: s3 });
    expect(result.current['a'].direction).toBe('down');
  });
});
