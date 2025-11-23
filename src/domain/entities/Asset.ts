export interface Asset {
  publicId: string;
  symbol: string;
  name: string;
  type: 'Stock' | 'Crypto' | 'ETF';
  basePrice?: number;
  volatility?: number;
  drift?: number;
  maxPrice?: number;
  minPrice?: number;
  dividendYield?: number;
  liquidity?: number;
  createdAt: Date;
  imageUrl?: string;
  category?: {
    id: number;
    name: string;
  };
}
