import type { AssetDTO, PaginatedResultDTO } from '@infra/api/assets/asset.dto';
import type { Asset } from '@domain/entities/Asset';

export const mapAssetDTOToEntity = (dto: AssetDTO, selectedAssetIds: string[] = []): Asset => ({
  publicId: dto.publicId,
  assetName: dto.assetName,
  assetSymbol: dto.assetSymbol,
  assetType: dto.assetType,
  basePrice: dto.basePrice,
  volatility: dto.volatility,
  drift: dto.drift ?? null,
  maxPrice: dto.maxPrice ?? null,
  minPrice: dto.minPrice ?? null,
  dividendYield: dto.dividendYield ?? null,
  liquidity: dto.liquidity ?? null,
  assetPicUrl: dto.logoUrl ?? null,
  category: dto.category
    ? {
        categoryId: dto.category.categoryId,
        name: dto.category.categoryKey,
      }
    : null,
  isSelected: selectedAssetIds.includes(dto.publicId),
});

export const mapPaginatedAssetsDTOToEntity = (
  dto: PaginatedResultDTO<AssetDTO>,
  selectedAssetIds: string[] = []
) => ({
  data: dto.data.map((asset) => mapAssetDTOToEntity(asset, selectedAssetIds)),
  meta: dto.meta,
});
