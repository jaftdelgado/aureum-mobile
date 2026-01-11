import { SubscribeToMarketUseCase } from '@domain/use-cases/market/SubscribeToMarketUseCase';

describe('SubscribeToMarketUseCase (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate to marketRepository.subscribeToMarket()', () => {
    const unsubscribe = jest.fn();

    const repo = {
      subscribeToMarket: jest.fn(() => unsubscribe),
    } as any;

    const useCase = new SubscribeToMarketUseCase(repo);

    const handlers = {
      onData: jest.fn(),
      onError: jest.fn(),
      onComplete: jest.fn(),
    };

    const res = useCase.execute('team-1', handlers);

    expect(repo.subscribeToMarket).toHaveBeenCalledWith('team-1', handlers);
    expect(res).toBe(unsubscribe);
  });
});
