// src/domain/repositories/MarketConfigRepository.ts
import type { MarketConfig } from "@domain/entities/MarketConfig";

export interface MarketConfigRepository {
  getMarketConfig(teamPublicId: string): Promise<MarketConfig>;
  createMarketConfig(config: MarketConfig): Promise<MarketConfig>;
  updateMarketConfig(config: MarketConfig): Promise<MarketConfig>;
}
