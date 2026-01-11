import { SellAssetUseCase } from '@domain/use-cases/market/SellAssetUseCase';

describe('SellAssetUseCase (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate to marketRepository.sellAsset()', async () => {
    const repo = {
      sellAsset: jest.fn().mockResolvedValue({ ok: 'sold' }),
    } as any;

    const useCase = new SellAssetUseCase(repo);

    const params = {
      teamPublicId: 'team-1',
      assetPublicId: 'asset-1',
      userPublicId: 'user-1',
      quantity: 1,
      price: 100,
    };

    const res = await useCase.execute(params as any);

    expect(repo.sellAsset).toHaveBeenCalledWith(params);
    expect(res).toEqual({ ok: 'sold' });
  });
});
