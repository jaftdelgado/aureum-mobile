import { GetAssetsUseCase } from '@domain/use-cases/assets/GetAssetsUseCase';
import { AssetRepository } from '@domain/repositories/AssetRepository';
import { Asset } from '@domain/entities/Asset';

describe('GetAssetsUseCase', () => {
  let getAssetsUseCase: GetAssetsUseCase;
  let mockAssetRepository: jest.Mocked<AssetRepository>;

  const mockAssets: Asset[] = [
    {
      publicId: 'asset-1',
      assetSymbol: 'AAPL',
      assetName: 'Apple Inc.',
      basePrice: 150.0,
      assetType: 'Stock',
    } as Asset,
    {
      publicId: 'asset-2',
      assetName: 'Tesla Inc.',
      basePrice: 750.0,
      assetType: 'Stock',
      isSelected: true,
    } as Asset,
  ];

  const mockResponse = {
    data: mockAssets,
    meta: {
      totalItems: 2,
      itemCount: 2,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
  };

  beforeEach(() => {
    mockAssetRepository = {
      getAssets: jest.fn(),
      getAssetById: jest.fn(),
    } as unknown as jest.Mocked<AssetRepository>;

    getAssetsUseCase = new GetAssetsUseCase(mockAssetRepository);
  });

  it('should call getAssets on the repository with correct parameters', async () => {
    const query = { search: 'tech' };
    const selectedIds = ['asset-1'];
    mockAssetRepository.getAssets.mockResolvedValue(mockResponse);

    const result = await getAssetsUseCase.execute(query, selectedIds);

    expect(mockAssetRepository.getAssets).toHaveBeenCalledWith(query, selectedIds);
    expect(result).toEqual(mockResponse);
  });

  it('should use empty array for selectedAssetIds if provided', async () => {
    const query = { page: 1 };
    mockAssetRepository.getAssets.mockResolvedValue(mockResponse);

    const result = await getAssetsUseCase.execute(query);

    expect(mockAssetRepository.getAssets).toHaveBeenCalledWith(query, []);
    expect(result).toEqual(mockResponse);
  });

  it('should propagate errors from the repository', async () => {
    const error = new Error('Repository error');
    mockAssetRepository.getAssets.mockRejectedValue(error);

    await expect(getAssetsUseCase.execute({})).rejects.toThrow('Repository error');
  });
});
