export interface AssetCategory {
  categoryId: number;
  name: string;
}

export interface Asset {
  publicId: string;
  assetName: string;
  assetSymbol: string;
  assetType: string;
  basePrice: number;

  volatility?: number;
  drift?: number | null;
  maxPrice?: number | null;
  minPrice?: number | null;
  dividendYield?: number | null;
  liquidity?: number | null;
  assetPicUrl?: string | null;

  category?: AssetCategory | null;

  createdAt?: Date;
  updatedAt?: Date;

  isSelected?: boolean;
}
