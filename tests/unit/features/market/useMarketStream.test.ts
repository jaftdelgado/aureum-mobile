import { renderHook } from '@testing-library/react-native';
import { useMarketStream } from '@features/market/hooks/useMarketStream';

const mockSubscribeExecute = jest.fn();
const mockUnsubscribe = jest.fn();

jest.mock('@infra/api/market/MarketApiRepository', () => ({
  MarketApiRepository: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@domain/use-cases/market/SubscribeToMarketUseCase', () => ({
  SubscribeToMarketUseCase: jest.fn().mockImplementation(() => ({
    execute: (...args: any[]) => mockSubscribeExecute(...args),
  })),
}));

describe('useMarketStream Hook (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSubscribeExecute.mockReset();
    mockUnsubscribe.mockReset();
  });

  it('should not subscribe if teamPublicId is empty', () => {
    renderHook(() => useMarketStream(''));
    expect(mockSubscribeExecute).not.toHaveBeenCalled();
  });

  it('should subscribe and update snapshot via handlers', async () => {
    mockSubscribeExecute.mockImplementation((_teamPublicId: string, handlers: any) => {
      handlers.onData({ timestamp: new Date(1), assets: [] });
      return mockUnsubscribe;
    });

    const { result } = renderHook(() => useMarketStream('team-1'));

    expect(mockSubscribeExecute).toHaveBeenCalledWith(
      'team-1',
      expect.objectContaining({ onData: expect.any(Function), onError: expect.any(Function) })
    );

    expect(result.current.snapshot).toEqual({ timestamp: new Date(1), assets: [] });
    expect(result.current.error).toBeNull();
  });

  it('should set error when handlers.onError is called', () => {
    const err = new Error('stream fail');

    mockSubscribeExecute.mockImplementation((_teamPublicId: string, handlers: any) => {
      handlers.onError(err);
      return mockUnsubscribe;
    });

    const { result } = renderHook(() => useMarketStream('team-1'));
    expect(result.current.error).toBe(err);
  });
});
