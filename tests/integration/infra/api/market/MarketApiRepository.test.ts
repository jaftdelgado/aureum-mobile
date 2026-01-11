/**
 * Este test importa MarketApiRepository -> marketGrpcClient -> supabase.ts
 * supabase.ts ejecuta createClient() y requiere env vars. En Jest no están,
 * así que mockeamos supabase completo para que no ejecute createClient.
 */

// Mock de AsyncStorage (por si algún import indirecto lo toca)
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock del cliente de supabase para evitar el "supabaseUrl is required"
jest.mock('@infra/external/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));

import { MarketApiRepository } from '@infra/api/market/MarketApiRepository';

describe('MarketApiRepository (Integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('subscribeToMarket() should map snapshot DTO to domain and forward handlers', () => {
    const onData = jest.fn();
    const onError = jest.fn();
    const onComplete = jest.fn();

    const mockUnsub = jest.fn();

    const client = {
      streamMarket: jest.fn((_teamPublicId: string, handlers: any) => {
        handlers.onMessage({
          Timestamp: 123,
          Assets: [{ Id: 'a', Symbol: 'BTC', Name: 'Bitcoin', Price: 10, BasePrice: 9, Volatility: 1 }],
        });
        return mockUnsub;
      }),
      buy: jest.fn(),
      sell: jest.fn(),
    } as any;

    const repo = new MarketApiRepository(client);
    const unsub = repo.subscribeToMarket('team-1', { onData, onError, onComplete });

    expect(client.streamMarket).toHaveBeenCalledWith(
      'team-1',
      expect.objectContaining({
        onMessage: expect.any(Function),
        onError,
        onComplete,
      })
    );

    expect(onData).toHaveBeenCalledWith(
      expect.objectContaining({
        timestamp: expect.any(Date),
        assets: [
          expect.objectContaining({
            id: 'a',
            symbol: 'BTC',
            name: 'Bitcoin',
            price: 10,
            basePrice: 9,
            volatility: 1,
          }),
        ],
      })
    );

    expect(unsub).toBe(mockUnsub);
  });

  it('buyAsset() should call client.buy with correct body and map trade result', async () => {
    const client = {
      streamMarket: jest.fn(),
      buy: jest.fn().mockResolvedValue({
        MovementPublicID: 'm-1',
        TransactionPublicID: 't-1',
        TransactionPrice: 100,
        Quantity: 2,
        Notifications: [{ UserPublicId: 'u-1', Message: 'ok' }],
      }),
      sell: jest.fn(),
    } as any;

    const repo = new MarketApiRepository(client);

    const res = await repo.buyAsset({
      teamPublicId: 'team-1',
      assetPublicId: 'asset-1',
      userPublicId: 'user-1',
      quantity: 2,
      price: 100,
    });

    expect(client.buy).toHaveBeenCalledWith({
      teamPublicId: 'team-1',
      assetPublicId: 'asset-1',
      userPublicId: 'user-1',
      quantity: 2,
      price: 100,
    });

    expect(res).toEqual({
      movementPublicId: 'm-1',
      transactionPublicId: 't-1',
      transactionPrice: 100,
      quantity: 2,
      notifications: [{ userPublicId: 'u-1', message: 'ok' }],
    });
  });

  it('sellAsset() should call client.sell with correct body and map trade result', async () => {
    const client = {
      streamMarket: jest.fn(),
      buy: jest.fn(),
      sell: jest.fn().mockResolvedValue({
        movementPublicId: 'm-2',
        transactionPublicId: 't-2',
        transactionPrice: 200,
        quantity: 1,
        notifications: [{ userPublicId: 'u-2', message: 'sold' }],
      }),
    } as any;

    const repo = new MarketApiRepository(client);

    const res = await repo.sellAsset({
      teamPublicId: 'team-9',
      assetPublicId: 'asset-9',
      userPublicId: 'user-9',
      quantity: 1,
      price: 200,
    });

    expect(client.sell).toHaveBeenCalledWith({
      teamPublicId: 'team-9',
      assetPublicId: 'asset-9',
      userPublicId: 'user-9',
      quantity: 1,
      price: 200,
    });

    expect(res).toEqual({
      movementPublicId: 'm-2',
      transactionPublicId: 't-2',
      transactionPrice: 200,
      quantity: 1,
      notifications: [{ userPublicId: 'u-2', message: 'sold' }],
    });
  });
});
