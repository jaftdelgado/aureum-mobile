import type { TeamAssetDTO } from '@infra/api/team-assets/teamAsset.dto';
import type { TeamAsset } from '@domain/entities/TeamAsset';

export const mapTeamAssetDTOToEntity = (dto: TeamAssetDTO): TeamAsset => ({
  teamAssetId: dto.teamAssetId,
  publicId: dto.publicId,
  teamId: dto.teamId,
  assetId: dto.assetId,
  currentPrice: Number(dto.currentPrice),
  hasMovements: dto.hasMovements,

  asset: {
    publicId: dto.asset.publicId,
    assetSymbol: dto.asset.assetSymbol,
    assetName: dto.asset.assetName,
    assetType: dto.asset.assetType,
    basePrice: Number(dto.asset.basePrice),

    volatility: dto.asset.volatility,
    drift: dto.asset.drift ?? undefined,
    maxPrice: dto.asset.maxPrice ?? undefined,
    minPrice: dto.asset.minPrice ?? undefined,
    dividendYield: dto.asset.dividendYield ?? undefined,
    liquidity: dto.asset.liquidity ?? undefined,
    assetPicUrl: dto.asset.logoUrl ?? undefined,

    category: dto.asset.category
      ? {
        categoryId: dto.asset.category.categoryId,
        name: dto.asset.category.categoryKey,
      }
      : null,
  },
});