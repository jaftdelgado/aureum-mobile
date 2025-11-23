import { AssetDTO } from '@infra/api/assets/assets.dto';
import { Asset } from '@domain/entities/Asset';

export const mapAssetDTOToEntity = (dto: AssetDTO): Asset => ({
  publicId: dto.publicId,
  symbol: dto.assetSymbol,
  name: dto.assetName,
  type: dto.assetType,
  basePrice: dto.basePrice,
  volatility: dto.volatility,
  drift: dto.drift,
  maxPrice: dto.maxPrice,
  minPrice: dto.minPrice,
  dividendYield: dto.dividendYield,
  liquidity: dto.liquidity,
  createdAt: new Date(dto.createdAt),
  imageUrl: dto.assetPicUrl,
  category:
    dto.categoryId && dto.categoryName
      ? {
          id: dto.categoryId,
          name: dto.categoryName,
        }
      : undefined,
});
