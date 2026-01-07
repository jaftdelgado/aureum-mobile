import type { MarketConfigDTO } from '@infra/api/market-config/marketConfig.dto';
import type { MarketConfig } from '@domain/entities/MarketConfig';

export const mapMarketConfigDTOToEntity = (dto: MarketConfigDTO): MarketConfig => ({
  publicId: dto.public_id,
  teamId: dto.team_id,
  initialCash: dto.initial_cash,
  currency: dto.currency,
  marketVolatility: dto.market_volatility,
  marketLiquidity: dto.market_liquidity,
  thickSpeed: dto.thick_speed,
  transactionFee: dto.transaction_fee,
  eventFrequency: dto.event_frequency,
  dividendImpact: dto.dividend_impact,
  crashImpact: dto.crash_impact,
  allowShortSelling: dto.allow_short_selling,
  createdAt: dto.created_at ? new Date(dto.created_at) : new Date(),
  updatedAt: dto.updated_at ? new Date(dto.updated_at) : new Date(),
});

export const mapMarketConfigEntityToDTO = (entity: MarketConfig): MarketConfigDTO => ({
  public_id: entity.publicId,
  team_id: entity.teamId,
  initial_cash: entity.initialCash,
  currency: entity.currency,
  market_volatility: entity.marketVolatility,
  market_liquidity: entity.marketLiquidity,
  thick_speed: entity.thickSpeed,
  transaction_fee: entity.transactionFee,
  event_frequency: entity.eventFrequency,
  dividend_impact: entity.dividendImpact,
  crash_impact: entity.crashImpact,
  allow_short_selling: entity.allowShortSelling,
  created_at: entity.createdAt?.toISOString(),
  updated_at: entity.updatedAt?.toISOString(),
});
