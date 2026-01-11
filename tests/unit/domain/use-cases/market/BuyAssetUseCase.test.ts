import { BuyAssetUseCase } from '@domain/use-cases/market/BuyAssetUseCase';

describe('BuyAssetUseCase (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate to marketRepository.buyAsset()', async () => {
    const repo = {
      buyAsset: jest.fn().mockResolvedValue({ ok: true }),
    } as any;

    const useCase = new BuyAssetUseCase(repo);

    const params = {
      teamPublicId: 'team-1',
      assetPublicId: 'asset-1',
      userPublicId: 'user-1',
      quantity: 1,
      price: 100,
    };

    const res = await useCase.execute(params as any);

    expect(repo.buyAsset).toHaveBeenCalledWith(params);
    expect(res).toEqual({ ok: true });
  });
});
