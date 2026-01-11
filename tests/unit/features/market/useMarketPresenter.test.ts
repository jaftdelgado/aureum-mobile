import { renderHook, act } from '@testing-library/react-native';
import { useMarketPresenter } from '@features/market/hooks/useMarketPresenter';
import { Alert } from 'react-native';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockUseAuth = jest.fn();
jest.mock('@app/providers/AuthProvider', () => ({
  useAuth: () => mockUseAuth(),
}));

const mockUseTeamAssets = jest.fn();
jest.mock('@features/market/hooks/useTeamAssets', () => ({
  useTeamAssets: (...args: any[]) => mockUseTeamAssets(...args),
}));

const mockUseMarketStream = jest.fn();
jest.mock('@features/market/hooks/useMarketStream', () => ({
  useMarketStream: (...args: any[]) => mockUseMarketStream(...args),
}));

const mockBuy = jest.fn();
const mockSell = jest.fn();
const mockUseMarketTrading = jest.fn();
jest.mock('@features/market/hooks/useMarketTrading', () => ({
  useMarketTrading: () => mockUseMarketTrading(),
}));

describe('useMarketPresenter Hook (Unit)', () => {
  const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({ user: { public_id: 'user-1' } });

    mockUseTeamAssets.mockReturnValue({
      assets: [
        {
          publicId: 'team-asset-1',
          asset: {
            publicId: 'asset-1',
            assetName: 'Bitcoin',
            assetSymbol: 'BTC',
            currentPrice: 100,
          },
          currentPrice: 100,
        },
      ],
      refetch: jest.fn(),
    });

    mockUseMarketStream.mockReturnValue({
      snapshot: {
        timestamp: new Date(123),
        assets: [{ id: 'a', symbol: 'BTC', name: 'Bitcoin', price: 120, basePrice: 100, volatility: 1 }],
      },
      error: null,
    });

    mockUseMarketTrading.mockReturnValue({
      buy: mockBuy,
      sell: mockSell,
      loading: false,
      error: null,
      lastTrade: null,
    });

    mockBuy.mockResolvedValue({ ok: true });
    mockSell.mockResolvedValue({ ok: true });
  });

  afterAll(() => {
    alertSpy.mockRestore();
  });

  it('should merge assets with live price and expose selectedAsset', async () => {
    const { result } = renderHook(() => useMarketPresenter('team-1'));

    expect(result.current.mergedAssets.length).toBe(1);
    expect(result.current.mergedAssets[0]).toEqual(
      expect.objectContaining({
        symbol: 'BTC',
        currentPrice: 120,
      })
    );

    await act(async () => {
      result.current.onPressAsset('asset-1');
    });

    expect(result.current.selectedIds).toEqual(['asset-1']);
    expect(result.current.selectedAsset).toEqual(expect.objectContaining({ symbol: 'BTC' }));
  });

  it('onBuyPress should require single selection', async () => {
    const { result } = renderHook(() => useMarketPresenter('team-1'));

    await act(async () => {
      await result.current.onBuyPress();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'validation.selectOneAssetTitle',
      'validation.selectOneAssetDesc'
    );
    expect(mockBuy).not.toHaveBeenCalled();
  });

  it('onBuyPress should require auth', async () => {
    mockUseAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useMarketPresenter('team-1'));

    await act(async () => {
      result.current.onPressAsset('asset-1');
    });

    await act(async () => {
      await result.current.onBuyPress();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'validation.authRequiredTitle',
      'validation.authRequiredDesc'
    );
    expect(mockBuy).not.toHaveBeenCalled();
  });

  it('onBuyPress should call buy() and show success alert', async () => {
    const refetch = jest.fn();

    mockUseTeamAssets.mockReturnValue({
      assets: [
        {
          publicId: 'team-asset-1',
          asset: { publicId: 'asset-1', assetName: 'Bitcoin', assetSymbol: 'BTC', currentPrice: 100 },
          currentPrice: 100,
        },
      ],
      refetch,
    });

    const { result } = renderHook(() => useMarketPresenter('team-1'));

    await act(async () => {
      result.current.onPressAsset('asset-1');
    });

    await act(async () => {
      await result.current.onBuyPress();
    });

    expect(mockBuy).toHaveBeenCalledWith(
      expect.objectContaining({
        teamPublicId: 'team-1',
        assetPublicId: 'asset-1',
        userPublicId: 'user-1',
        quantity: 1,
        price: expect.any(Number),
      })
    );

    expect(refetch).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('alerts.buySuccessTitle', 'alerts.buySuccessDesc');
  });

  it('onSellPress should call sell() and show success alert', async () => {
    const refetch = jest.fn();

    mockUseTeamAssets.mockReturnValue({
      assets: [
        {
          publicId: 'team-asset-1',
          asset: { publicId: 'asset-1', assetName: 'Bitcoin', assetSymbol: 'BTC', currentPrice: 100 },
          currentPrice: 100,
        },
      ],
      refetch,
    });

    const { result } = renderHook(() => useMarketPresenter('team-1'));

    await act(async () => {
      result.current.onPressAsset('asset-1');
    });

    await act(async () => {
      await result.current.onSellPress();
    });

    expect(mockSell).toHaveBeenCalledWith(
      expect.objectContaining({
        teamPublicId: 'team-1',
        assetPublicId: 'asset-1',
        userPublicId: 'user-1',
        quantity: 1,
        price: expect.any(Number),
      })
    );

    expect(refetch).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('alerts.sellSuccessTitle', 'alerts.sellSuccessDesc');
  });
});
