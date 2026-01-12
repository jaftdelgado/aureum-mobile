import {
  mapAssetDTOToEntity,
  mapPaginatedAssetsDTOToEntity,
} from '@infra/api/assets/asset.mappers';
import type { AssetDTO, PaginatedResultDTO } from '@infra/api/assets/asset.dto';

describe('AssetMapper', () => {
  const mockAssetDTO: AssetDTO = {
    publicId: 'asset-1',
    assetName: 'Apple Inc.',
    assetSymbol: 'AAPL',
    assetType: 'Stock',
    basePrice: 150.0,
    volatility: 0.5,
    drift: 0.1,
    maxPrice: 200,
    minPrice: 100,
    dividendYield: 0.05,
    liquidity: 1000000,
    logoUrl: 'http://example.com/logo.png',
    category: {
      categoryId: 1,
      categoryKey: 'Technology',
    },
  };

  describe('mapAssetDTOToEntity', () => {
    it('should correctly map all fields from DTO to Entity', () => {
      const result = mapAssetDTOToEntity(mockAssetDTO);

      expect(result).toEqual({
        publicId: 'asset-1',
        assetName: 'Apple Inc.',
        assetSymbol: 'AAPL',
        assetType: 'Stock',
        basePrice: 150.0,
        volatility: 0.5,
        drift: 0.1,
        maxPrice: 200,
        minPrice: 100,
        dividendYield: 0.05,
        liquidity: 1000000,
        assetPicUrl: 'http://example.com/logo.png',
        category: {
          categoryId: 1,
          name: 'Technology',
        },
        isSelected: false,
      });
    });

    it('should handle nullable fields correctly (convert undefined to null)', () => {
      const dtoWithNulls: AssetDTO = {
        ...mockAssetDTO,
        drift: undefined,
        maxPrice: undefined,
        minPrice: undefined,
        dividendYield: undefined,
        liquidity: undefined,
        logoUrl: undefined,
      };

      const result = mapAssetDTOToEntity(dtoWithNulls);

      expect(result.drift).toBeNull();
      expect(result.maxPrice).toBeNull();
      expect(result.minPrice).toBeNull();
      expect(result.dividendYield).toBeNull();
      expect(result.liquidity).toBeNull();
      expect(result.assetPicUrl).toBeNull();
    });

    it('should handle missing category', () => {
      const dtoWithoutCategory: AssetDTO = {
        ...mockAssetDTO,
        category: undefined,
      };

      const result = mapAssetDTOToEntity(dtoWithoutCategory);

      expect(result.category).toBeNull();
    });

    it('should mark as selected if ID is in selectedAssetIds array', () => {
      const result = mapAssetDTOToEntity(mockAssetDTO, ['other-id', 'asset-1']);

      expect(result.isSelected).toBe(true);
    });

    it('should mark as not selected if ID is not in selectedAssetIds array', () => {
      const result = mapAssetDTOToEntity(mockAssetDTO, ['other-id']);

      expect(result.isSelected).toBe(false);
    });
  });

  describe('mapPaginatedAssetsDTOToEntity', () => {
    const mockPaginatedDTO: PaginatedResultDTO<AssetDTO> = {
      data: [
        { ...mockAssetDTO, publicId: 'a1' },
        { ...mockAssetDTO, publicId: 'a2' },
      ],
      meta: {
        totalItems: 2,
        itemCount: 2,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
    };

    it('should map paginated results and propagate selectedAssetIds', () => {
      const selectedIds = ['a1'];
      const result = mapPaginatedAssetsDTOToEntity(mockPaginatedDTO, selectedIds);

      expect(result.meta).toEqual(mockPaginatedDTO.meta);

      expect(result.data).toHaveLength(2);
      expect(result.data[0].publicId).toBe('a1');
      expect(result.data[0].isSelected).toBe(true);
      expect(result.data[1].publicId).toBe('a2');
      expect(result.data[1].isSelected).toBe(false);
    });

    it('should work with default empty selectedAssetIds', () => {
      const result = mapPaginatedAssetsDTOToEntity(mockPaginatedDTO);

      expect(result.data[0].isSelected).toBe(false);
      expect(result.data[1].isSelected).toBe(false);
    });
  });
});
