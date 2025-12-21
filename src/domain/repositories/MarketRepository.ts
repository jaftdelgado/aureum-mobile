import type { MarketSnapshot } from "@domain/entities/MarketSnapshot";
import type { TradeResult } from "@domain/entities/Trade";

export interface MarketStreamHandlers {
  onData: (snapshot: MarketSnapshot) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export interface TradeParams {
  teamPublicId: string;
  assetPublicId: string;
  userPublicId: string;
  quantity: number;
  price: number;
}

export interface MarketRepository {
  subscribeToMarket(
    courseId: string,
    handlers: MarketStreamHandlers
  ): () => void;

  buyAsset(params: TradeParams): Promise<TradeResult>;
  sellAsset(params: TradeParams): Promise<TradeResult>;
}
