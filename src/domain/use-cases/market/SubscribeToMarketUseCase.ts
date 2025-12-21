import type {
  MarketRepository,
  MarketStreamHandlers,
} from "@domain/repositories/MarketRepository";

export class SubscribeToMarketUseCase {
  private marketRepository: MarketRepository;

  constructor(marketRepository: MarketRepository) {
    this.marketRepository = marketRepository;
  }

  execute(courseId: string, handlers: MarketStreamHandlers): () => void {
    return this.marketRepository.subscribeToMarket(courseId, handlers);
  }
}
