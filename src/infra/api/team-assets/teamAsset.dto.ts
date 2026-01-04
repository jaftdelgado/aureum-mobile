export interface TeamAssetDTO {
  teamAssetId: number;
  publicId: string;
  teamId: string;
  assetId: string;
  currentPrice: number;
  hasMovements: boolean;
  asset: {
    publicId: string;
    assetSymbol: string;
    assetName: string;
    assetType: string;
    basePrice: number;
    volatility?: number;
    drift?: number | null;
    maxPrice?: number | null;
    minPrice?: number | null;
    dividendYield?: number | null;
    liquidity?: number | null;
    logoUrl?: string | null;
    category?: {
      categoryId: number;
      categoryKey: string;
    } | null;
  };
}
