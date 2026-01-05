import { GetPortfolioUseCase } from '@domain/use-cases/portfolio/GetPortfolioUseCase';
import { PortfolioRepository } from '@domain/repositories/PortfolioRepository';
import { PortfolioItem } from '@domain/entities/PortfolioItem';

describe('GetPortfolioUseCase', () => {
  let useCase: GetPortfolioUseCase;
  let mockRepository: jest.Mocked<PortfolioRepository>;

  const mockPortfolioItem: PortfolioItem = {
    userId: 'user-123',
    portfolioId: 1,
    assetId: 'asset-456',
    quantity: 10,
    avgPrice: 100,
    currentValue: 110,
    assetName: 'Bitcoin',
    assetSymbol: 'BTC',
    totalInvestment: 1000,
    currentTotalValue: 1100,
    profitOrLoss: 100,
    profitOrLossPercentage: 10,
  };

  beforeEach(() => {
    mockRepository = {
      getByCourse: jest.fn(),
      getHistory: jest.fn(),
    } as unknown as jest.Mocked<PortfolioRepository>;

    useCase = new GetPortfolioUseCase(mockRepository);
  });

  it('debe retornar la lista de items del portafolio cuando la ejecución es exitosa', async () => {
    const mockData = [mockPortfolioItem];
    mockRepository.getByCourse.mockResolvedValue(mockData);

    const result = await useCase.execute('course-id', 'user-id');

    expect(result).toEqual(mockData);
    expect(mockRepository.getByCourse).toHaveBeenCalledWith('course-id', 'user-id');
  });

  it('debe propagar el error si el repositorio falla', async () => {
    const error = new Error('Database error');
    mockRepository.getByCourse.mockRejectedValue(error);

    await expect(useCase.execute('course-id', 'user-id')).rejects.toThrow(error);
  });
});