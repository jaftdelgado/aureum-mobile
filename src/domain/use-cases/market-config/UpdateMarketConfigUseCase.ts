import type { MarketConfigRepository } from "@domain/repositories/MarketConfigRepository";
import type { MarketConfig } from "@domain/entities/MarketConfig";

export class UpdateMarketConfigUseCase {
  private marketConfigRepository: MarketConfigRepository;

  constructor(marketConfigRepository: MarketConfigRepository) {
    this.marketConfigRepository = marketConfigRepository;
  }

  async execute(config: MarketConfig): Promise<MarketConfig> {
    return this.marketConfigRepository.updateMarketConfig(config);
  }
}
