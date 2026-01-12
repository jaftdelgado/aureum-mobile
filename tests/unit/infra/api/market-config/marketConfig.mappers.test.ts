import {
  mapMarketConfigDTOToEntity,
  mapMarketConfigEntityToDTO,
} from '@infra/api/market-config/marketConfig.mappers';
import type { MarketConfigDTO } from '@infra/api/market-config/marketConfig.dto';
import type { MarketConfig } from '@domain/entities/MarketConfig';

describe('MarketConfigMapper', () => {
  const mockDate = new Date('2023-01-01T12:00:00.000Z');
  const mockDateString = mockDate.toISOString();

  const mockDTO: MarketConfigDTO = {
    public_id: 'market-123',
    team_id: 'team-456',
    initial_cash: 50000,
    currency: 'USD',
    market_volatility: 'High',
    market_liquidity: 'Medium',
    thick_speed: 'High',
    transaction_fee: 'Low',
    event_frequency: 'Low',
    dividend_impact: 'Medium',
    crash_impact: 'High',
    allow_short_selling: true,
    created_at: mockDateString,
    updated_at: mockDateString,
  };

  const mockEntity: MarketConfig = {
    publicId: 'market-123',
    teamId: 'team-456',
    initialCash: 50000,
    currency: 'USD',
    marketVolatility: 'High',
    marketLiquidity: 'Medium',
    thickSpeed: 'High',
    transactionFee: 'Low',
    eventFrequency: 'Low',
    dividendImpact: 'Medium',
    crashImpact: 'High',
    allowShortSelling: true,
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  describe('mapMarketConfigDTOToEntity', () => {
    it('should correctly map a complete DTO to an Entity', () => {
      const result = mapMarketConfigDTOToEntity(mockDTO);

      expect(result).toEqual(mockEntity);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt?.toISOString()).toBe(mockDTO.created_at);
    });

    it('should use current date if created_at or updated_at are missing in DTO', () => {
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const dtoWithoutDates = {
        ...mockDTO,
        created_at: undefined,
        updated_at: undefined,
      } as unknown as MarketConfigDTO;

      const result = mapMarketConfigDTOToEntity(dtoWithoutDates);

      expect(result.createdAt).toEqual(mockDate);
      expect(result.updatedAt).toEqual(mockDate);

      jest.useRealTimers();
    });
  });

  describe('mapMarketConfigEntityToDTO', () => {
    it('should correctly map a complete Entity to a DTO', () => {
      const result = mapMarketConfigEntityToDTO(mockEntity);

      expect(result).toEqual(mockDTO);
      expect(typeof result.created_at).toBe('string');
    });

    it('should handle undefined dates in Entity', () => {
      const entityWithoutDates: MarketConfig = {
        ...mockEntity,
        createdAt: undefined,
        updatedAt: undefined,
      };

      const result = mapMarketConfigEntityToDTO(entityWithoutDates);

      expect(result.created_at).toBeUndefined();
      expect(result.updated_at).toBeUndefined();
    });
  });
});
