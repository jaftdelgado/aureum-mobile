import type { MarketConfigRepository } from "@domain/repositories/MarketConfigRepository";
import type { MarketConfig } from "@domain/entities/MarketConfig";

export class CreateMarketConfigUseCase {
  private marketConfigRepository: MarketConfigRepository;

  constructor(marketConfigRepository: MarketConfigRepository) {
    this.marketConfigRepository = marketConfigRepository;
  }

  async execute(config: MarketConfig): Promise<MarketConfig> {
    return this.marketConfigRepository.createMarketConfig(config);
  }
}
