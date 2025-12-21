// src/domain/use-cases/market-config/GetMarketConfigUseCase.ts
import type { MarketConfigRepository } from "@domain/repositories/MarketConfigRepository";
import type { MarketConfig } from "@domain/entities/MarketConfig";

export class GetMarketConfigUseCase {
  private marketConfigRepository: MarketConfigRepository;

  constructor(marketConfigRepository: MarketConfigRepository) {
    this.marketConfigRepository = marketConfigRepository;
  }

  async execute(teamPublicId: string): Promise<MarketConfig> {
    return this.marketConfigRepository.getMarketConfig(teamPublicId);
  }
}
