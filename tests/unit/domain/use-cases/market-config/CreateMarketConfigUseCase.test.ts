import { CreateMarketConfigUseCase } from '@domain/use-cases/market-config/CreateMarketConfigUseCase';
import { MarketConfigRepository } from '@domain/repositories/MarketConfigRepository';
import { MarketConfig } from '@domain/entities/MarketConfig';

describe('CreateMarketConfigUseCase', () => {
  let createMarketConfigUseCase: CreateMarketConfigUseCase;
  let mockMarketConfigRepository: jest.Mocked<MarketConfigRepository>;

  const mockConfig: MarketConfig = {
    teamId: 'team-123',
    publicId: 'market-123',
    initialCash: 100000,
    currency: 'USD',
    marketVolatility: 'Medium',
    marketLiquidity: 'High',
    thickSpeed: 'High',
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

    createMarketConfigUseCase = new CreateMarketConfigUseCase(mockMarketConfigRepository);
  });

  it('should call createMarketConfig on the repository with correct parameters', async () => {
    mockMarketConfigRepository.createMarketConfig.mockResolvedValue(mockConfig);

    const result = await createMarketConfigUseCase.execute(mockConfig);

    expect(mockMarketConfigRepository.createMarketConfig).toHaveBeenCalledWith(mockConfig);
    expect(result).toEqual(mockConfig);
  });

  it('should propagate errors from the repository', async () => {
    const error = new Error('Repository error');
    mockMarketConfigRepository.createMarketConfig.mockRejectedValue(error);

    await expect(createMarketConfigUseCase.execute(mockConfig)).rejects.toThrow('Repository error');
  });
});
