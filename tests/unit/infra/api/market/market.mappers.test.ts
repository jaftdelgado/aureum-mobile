import { mapSnapshot, mapTradeResult } from '@infra/api/market/market.mappers';

describe('market.mappers (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('mapSnapshot', () => {
    it('should map PascalCase DTO', () => {
      const dto: any = {
        Timestamp: 123,
        Assets: [
          { Id: 'a', Symbol: 'BTC', Name: 'Bitcoin', Price: 10, BasePrice: 9, Volatility: 1 },
        ],
      };

      const res = mapSnapshot(dto);

      expect(res.timestamp).toBeInstanceOf(Date);
      expect(res.assets).toEqual([
        {
          id: 'a',
          symbol: 'BTC',
          name: 'Bitcoin',
          price: 10,
          basePrice: 9,
          volatility: 1,
        },
      ]);
    });

    it('should map camelCase DTO and handle invalid timestamp', () => {
      const dto: any = {
        timestamp: 'invalid-date',
        assets: [{ id: 'x', symbol: 'ETH', name: 'Ethereum', price: 20, basePrice: 18, volatility: 2 }],
      };

      const res = mapSnapshot(dto);

      expect(res.timestamp).toBeInstanceOf(Date);
      expect(res.assets[0].symbol).toBe('ETH');
    });
  });

  describe('mapTradeResult', () => {
    it('should map PascalCase trade result', () => {
      const dto: any = {
        MovementPublicID: 'm-1',
        TransactionPublicID: 't-1',
        TransactionPrice: 100,
        Quantity: 2,
        Notifications: [{ UserPublicId: 'u-1', Message: 'ok' }],
      };

      const res = mapTradeResult(dto);

      expect(res).toEqual({
        movementPublicId: 'm-1',
        transactionPublicId: 't-1',
        transactionPrice: 100,
        quantity: 2,
        notifications: [{ userPublicId: 'u-1', message: 'ok' }],
      });
    });

    it('should map camelCase trade result', () => {
      const dto: any = {
        movementPublicId: 'm-2',
        transactionPublicId: 't-2',
        transactionPrice: 200,
        quantity: 1,
        notifications: [{ userPublicId: 'u-2', message: 'sold' }],
      };

      const res = mapTradeResult(dto);

      expect(res.notifications[0].message).toBe('sold');
      expect(res.transactionPrice).toBe(200);
    });
  });
});
