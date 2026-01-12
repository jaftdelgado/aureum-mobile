import { UpdateMarketConfigUseCase } from '@domain/use-cases/market-config/UpdateMarketConfigUseCase';
import { MarketConfigRepository } from '@domain/repositories/MarketConfigRepository';
import { MarketConfig } from '@domain/entities/MarketConfig';

describe('UpdateMarketConfigUseCase', () => {
  let updateMarketConfigUseCase: UpdateMarketConfigUseCase;
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

    updateMarketConfigUseCase = new UpdateMarketConfigUseCase(mockMarketConfigRepository);
  });

  it('should call updateMarketConfig on the repository with correct parameters', async () => {
    mockMarketConfigRepository.updateMarketConfig.mockResolvedValue(mockConfig);

    const result = await updateMarketConfigUseCase.execute(mockConfig);

    expect(mockMarketConfigRepository.updateMarketConfig).toHaveBeenCalledWith(mockConfig);
    expect(result).toEqual(mockConfig);
  });

  it('should propagate errors from the repository', async () => {
    const error = new Error('Repository error');
    mockMarketConfigRepository.updateMarketConfig.mockRejectedValue(error);

    await expect(updateMarketConfigUseCase.execute(mockConfig)).rejects.toThrow('Repository error');
  });
});
