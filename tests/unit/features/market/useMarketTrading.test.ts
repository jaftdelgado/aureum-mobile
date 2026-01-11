import { renderHook, act } from '@testing-library/react-native';
import { useMarketTrading } from '@features/market/hooks/useMarketTrading';

const mockBuyExecute = jest.fn();
const mockSellExecute = jest.fn();

jest.mock('@infra/api/market/MarketApiRepository', () => ({
  MarketApiRepository: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@domain/use-cases/market/BuyAssetUseCase', () => ({
  BuyAssetUseCase: jest.fn().mockImplementation(() => ({
    execute: (...args: any[]) => mockBuyExecute(...args),
  })),
}));

jest.mock('@domain/use-cases/market/SellAssetUseCase', () => ({
  SellAssetUseCase: jest.fn().mockImplementation(() => ({
    execute: (...args: any[]) => mockSellExecute(...args),
  })),
}));

describe('useMarketTrading Hook (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBuyExecute.mockReset();
    mockSellExecute.mockReset();
  });

  it('buy() should set lastTrade on success', async () => {
    mockBuyExecute.mockResolvedValue({ ok: 'buy' });

    const { result } = renderHook(() => useMarketTrading());

    let res: any;
    await act(async () => {
      res = await result.current.buy({
        teamPublicId: 't',
        assetPublicId: 'a',
        userPublicId: 'u',
        quantity: 1,
        price: 10,
      } as any);
    });

    expect(res).toEqual({ ok: 'buy' });
    expect(result.current.lastTrade).toEqual({ ok: 'buy' });
    expect(result.current.loading).toBe(false);
  });

  it('sell() should rethrow on failure and stop loading', async () => {
    mockSellExecute.mockRejectedValue(new Error('sell fail'));

    const { result } = renderHook(() => useMarketTrading());

    let caught: any;
    await act(async () => {
      try {
        await result.current.sell({
          teamPublicId: 't',
          assetPublicId: 'a',
          userPublicId: 'u',
          quantity: 1,
          price: 10,
        } as any);
      } catch (e) {
        caught = e;
      }
    });

    expect(caught).toBeInstanceOf(Error);
    expect(caught?.message).toBe('sell fail');

    expect(result.current.loading).toBe(false);
  });
});
