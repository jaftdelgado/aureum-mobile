export interface AssetDTO {
  publicId: string;
  assetSymbol: string;
  assetName: string;
  assetType: 'Stock' | 'Crypto' | 'ETF';
  basePrice?: number;
  volatility?: number;
  drift?: number;
  maxPrice?: number;
  minPrice?: number;
  dividendYield?: number;
  liquidity?: number;
  createdAt: string;
  assetPicUrl?: string;
  categoryId?: number;
  categoryName?: string;
}
