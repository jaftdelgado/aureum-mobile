import { MarketConfigApiRepository } from '@infra/api/market-config/MarketConfigApiRepository';
import { httpClient } from '@infra/api/http/client';
import {
    mapMarketConfigDTOToEntity,
    mapMarketConfigEntityToDTO,
} from '@infra/api/market-config/marketConfig.mappers';
import type { MarketConfig } from '@domain/entities/MarketConfig';
import type { MarketConfigDTO } from '@infra/api/market-config/marketConfig.dto';

jest.mock('@infra/api/http/client', () => ({
    httpClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
    },
}));

jest.mock('@infra/api/market-config/marketConfig.mappers', () => ({
    mapMarketConfigDTOToEntity: jest.fn(),
    mapMarketConfigEntityToDTO: jest.fn(),
}));

describe('MarketConfigApiRepository', () => {
    let repository: MarketConfigApiRepository;
    const mockHttpClient = httpClient as jest.Mocked<typeof httpClient>;

    const mockEntity: MarketConfig = {
        publicId: 'market-1',
        teamId: 'team-1',
        initialCash: 1000,
        currency: 'USD',
        marketVolatility: 'Medium',
        marketLiquidity: 'High',
        thickSpeed: 'Medium',
        transactionFee: 'Low',
        eventFrequency: 'Low',
        dividendImpact: 'Medium',
        crashImpact: 'High',
        allowShortSelling: true,
    };

    const mockDTO: MarketConfigDTO = {
        public_id: 'market-1',
        team_id: 'team-1',
        initial_cash: 1000,
        currency: 'USD',
        market_volatility: 'Medium',
        market_liquidity: 'High',
        thick_speed: 'Medium',
        transaction_fee: 'Low',
        event_frequency: 'Low',
        dividend_impact: 'Medium',
        crash_impact: 'High',
        allow_short_selling: true,
    };

    beforeEach(() => {
        repository = new MarketConfigApiRepository();
        jest.clearAllMocks();

        (mapMarketConfigDTOToEntity as jest.Mock).mockReturnValue(mockEntity);
        (mapMarketConfigEntityToDTO as jest.Mock).mockReturnValue(mockDTO);
    });

    describe('getMarketConfig', () => {
        it('should fetch config via HTTP GET and return mapped entity', async () => {
            mockHttpClient.get.mockResolvedValue(mockDTO);

            const result = await repository.getMarketConfig('team-1');

            expect(mockHttpClient.get).toHaveBeenCalledWith('/api/market-config/team-1');
            expect(mapMarketConfigDTOToEntity).toHaveBeenCalledWith(mockDTO);
            expect(result).toEqual(mockEntity);
        });

        it('should propagate errors from httpClient', async () => {
            const error = new Error('Network error');
            mockHttpClient.get.mockRejectedValue(error);

            await expect(repository.getMarketConfig('team-1')).rejects.toThrow(error);
        });
    });

    describe('createMarketConfig', () => {
        it('should convert entity to DTO, POST it, and return mapped response', async () => {
            mockHttpClient.post.mockResolvedValue(mockDTO);

            const result = await repository.createMarketConfig(mockEntity);

            expect(mapMarketConfigEntityToDTO).toHaveBeenCalledWith(mockEntity);
            expect(mockHttpClient.post).toHaveBeenCalledWith('/api/market-config', mockDTO);
            expect(mapMarketConfigDTOToEntity).toHaveBeenCalledWith(mockDTO);
            expect(result).toEqual(mockEntity);
        });
    });

    describe('updateMarketConfig', () => {
        it('should convert entity to DTO, PUT it, and return mapped response', async () => {
            mockHttpClient.put.mockResolvedValue(mockDTO);

            const result = await repository.updateMarketConfig(mockEntity);

            expect(mapMarketConfigEntityToDTO).toHaveBeenCalledWith(mockEntity);
            expect(mockHttpClient.put).toHaveBeenCalledWith(
                `/api/market-config/${mockEntity.teamId}`,
                mockDTO
            );
            expect(mapMarketConfigDTOToEntity).toHaveBeenCalledWith(mockDTO);
            expect(result).toEqual(mockEntity);
        });
    });
});