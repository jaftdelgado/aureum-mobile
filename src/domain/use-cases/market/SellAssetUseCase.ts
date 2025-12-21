import type {
  MarketRepository,
  TradeParams,
} from "@domain/repositories/MarketRepository";
import type { TradeResult } from "@domain/entities/Trade";

export class SellAssetUseCase {
  private marketRepository: MarketRepository;
  
  constructor(marketRepository: MarketRepository) {
    this.marketRepository = marketRepository;
  }
  execute(params: TradeParams): Promise<TradeResult> {
    return this.marketRepository.sellAsset(params);
  }
}
