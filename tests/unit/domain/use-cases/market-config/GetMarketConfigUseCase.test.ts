import { GetMarketConfigUseCase } from '@domain/use-cases/market-config/GetMarketConfigUseCase';
import { MarketConfigRepository } from '@domain/repositories/MarketConfigRepository';
import { MarketConfig } from '@domain/entities/MarketConfig';

describe('GetMarketConfigUseCase', () => {
  let getMarketConfigUseCase: GetMarketConfigUseCase;
  let mockMarketConfigRepository: jest.Mocked<MarketConfigRepository>;

  const mockConfig: MarketConfig = {
    teamId: 'team-123',
    publicId: 'market-123',
    initialCash: 100000,
    currency: 'USD',
    marketVolatility: 'Medium',
    marketLiquidity: 'High',
    thickSpeed: 'Medium',
    transactionFee: 'Low',
    allowShortSelling: true,
    eventFrequency: 'Low',
    dividendImpact: 'Medium',
    crashImpact: 'High',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockMarketConfigRepository = {
      createMarketConfig: jest.fn(),
      getMarketConfig: jest.fn(),
      updateMarketConfig: jest.fn(),
    } as unknown as jest.Mocked<MarketConfigRepository>;

    getMarketConfigUseCase = new GetMarketConfigUseCase(mockMarketConfigRepository);
  });

  it('should call getMarketConfig on the repository with correct parameters', async () => {
    const teamPublicId = 'team-123';
    mockMarketConfigRepository.getMarketConfig.mockResolvedValue(mockConfig);

    const result = await getMarketConfigUseCase.execute(teamPublicId);

    expect(mockMarketConfigRepository.getMarketConfig).toHaveBeenCalledWith(teamPublicId);
    expect(result).toEqual(mockConfig);
  });

  it('should propagate errors from the repository', async () => {
    const error = new Error('Repository error');
    mockMarketConfigRepository.getMarketConfig.mockRejectedValue(error);

    await expect(getMarketConfigUseCase.execute('team-123')).rejects.toThrow('Repository error');
  });
});
