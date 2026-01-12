import { AssetApiRepository } from '@infra/api/assets/AssetApiRepository';
import { httpClient } from '@infra/api/http/client';
import {
  mapPaginatedAssetsDTOToEntity,
  mapAssetDTOToEntity,
} from '@infra/api/assets/asset.mappers';
import type { AssetDTO, PaginatedResultDTO } from '@infra/api/assets/asset.dto';
import type { Asset } from '@domain/entities/Asset';

jest.mock('@infra/api/http/client', () => ({
  httpClient: {
    get: jest.fn(),
  },
}));

jest.mock('@infra/api/assets/asset.mappers', () => ({
  mapPaginatedAssetsDTOToEntity: jest.fn(),
  mapAssetDTOToEntity: jest.fn(),
}));

describe('AssetApiRepository', () => {
  let repository: AssetApiRepository;
  const mockHttpClient = httpClient as jest.Mocked<typeof httpClient>;

  beforeEach(() => {
    repository = new AssetApiRepository();
    jest.clearAllMocks();
  });

  describe('getAssets', () => {
    const mockPaginatedResponse: PaginatedResultDTO<AssetDTO> = {
      data: [],
      meta: {
        totalItems: 0,
        itemCount: 0,
        itemsPerPage: 10,
        totalPages: 0,
        currentPage: 1,
      },
    };

    const mockMappedResult = {
      data: [],
      meta: mockPaginatedResponse.meta,
    };

    beforeEach(() => {
      mockHttpClient.get.mockResolvedValue(mockPaginatedResponse);
      (mapPaginatedAssetsDTOToEntity as jest.Mock).mockReturnValue(mockMappedResult);
    });

    it('should construct URL with basic query parameters', async () => {
      const query = { page: 1, limit: 10, search: 'Tesla' };

      await repository.getAssets(query);

      expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining('/api/assets?'));
      expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining('page=1'));
      expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining('limit=10'));
      expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining('search=Tesla'));
    });

    it('should ignore undefined or null query parameters', async () => {
      const query = { page: 1, search: undefined, orderBy: null } as any;

      await repository.getAssets(query);

      expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining('page=1'));
      expect(mockHttpClient.get).not.toHaveBeenCalledWith(expect.stringContaining('search'));
      expect(mockHttpClient.get).not.toHaveBeenCalledWith(expect.stringContaining('orderBy'));
    });

    it('should prioritize selectedAssetIds from query object and append them to URL', async () => {
      const query = { page: 1, selectedAssetIds: ['1', '2'] };
      const argIds = ['3', '4'];

      await repository.getAssets(query, argIds);

      const expectedUrlPart = 'selectedAssetIds=1&selectedAssetIds=2';
      expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining(expectedUrlPart));

      expect(mapPaginatedAssetsDTOToEntity).toHaveBeenCalledWith(mockPaginatedResponse, ['1', '2']);
    });

    it('should use selectedAssetIdsArg if query.selectedAssetIds is missing', async () => {
      const query = { page: 1 };
      const argIds = ['3', '4'];

      await repository.getAssets(query, argIds);

      const expectedUrlPart = 'selectedAssetIds=3&selectedAssetIds=4';
      expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining(expectedUrlPart));

      expect(mapPaginatedAssetsDTOToEntity).toHaveBeenCalledWith(mockPaginatedResponse, ['3', '4']);
    });

    it('should handle empty selectedAssetIds gracefully', async () => {
      const query = { page: 1 };

      await repository.getAssets(query, []);

      expect(mockHttpClient.get).not.toHaveBeenCalledWith(
        expect.stringContaining('selectedAssetIds=')
      );
    });
  });

  describe('getAssetById', () => {
    const mockAssetDTO: AssetDTO = {
      publicId: 'asset-1',
      assetName: 'Test',
      assetSymbol: 'TST',
      assetType: 'Stock',
      basePrice: 100,
      volatility: 0.1,
    };

    const mockAssetEntity = {
      publicId: 'asset-1',
    } as Asset;

    beforeEach(() => {
      mockHttpClient.get.mockResolvedValue(mockAssetDTO);
      (mapAssetDTOToEntity as jest.Mock).mockReturnValue(mockAssetEntity);
    });

    it('should fetch asset by ID and return mapped entity', async () => {
      const id = 'asset-123';
      const selectedIds = ['asset-123'];

      const result = await repository.getAssetById(id, selectedIds);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/assets/${id}`);
      expect(mapAssetDTOToEntity).toHaveBeenCalledWith(mockAssetDTO, selectedIds);
      expect(result).toEqual(mockAssetEntity);
    });

    it('should use empty array for selectedIds if not provided', async () => {
      const id = 'asset-123';

      await repository.getAssetById(id);

      expect(mapAssetDTOToEntity).toHaveBeenCalledWith(mockAssetDTO, []);
    });
  });
});
