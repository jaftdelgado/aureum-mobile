import { PortfolioApiRepository } from '@infra/api/portfolio/PortfolioApiRepository';
import { httpClient } from '@infra/api/http/client';

jest.mock('@infra/api/http/client', () => ({
  httpClient: {
    get: jest.fn(),
  },
}));

describe('PortfolioApiRepository', () => {
  let repository: PortfolioApiRepository;

  beforeEach(() => {
    repository = new PortfolioApiRepository();
    jest.clearAllMocks();
  });

  it('getByCourse debe llamar al endpoint correcto con userId en los params', async () => {
    const mockPortfolio = [{ portfolioId: '1', assetId: 'btc', quantity: 1 }];
    (httpClient.get as jest.Mock).mockResolvedValue(mockPortfolio);

    const result = await repository.getByCourse('course-123', 'user-456');

    expect(httpClient.get).toHaveBeenCalledWith(
      'api/Portfolio/course/course-123',
      { userId: 'user-456' }
    );
    expect(result).toEqual(mockPortfolio);
  });

  it('getHistory debe llamar al endpoint de historial con los IDs en la URL', async () => {
    const mockHistory = [{ assetId: 'btc', type: 'buy', amount: 100 }];
    (httpClient.get as jest.Mock).mockResolvedValue(mockHistory);

    const result = await repository.getHistory('course-123', 'student-789');

    expect(httpClient.get).toHaveBeenCalledWith(
      'api/Portfolio/history/course/course-123/student/student-789'
    );
    expect(result).toEqual(mockHistory);
  });
});