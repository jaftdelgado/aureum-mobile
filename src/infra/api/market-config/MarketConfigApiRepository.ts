import { httpClient } from '@infra/api/http/client';
import type { MarketConfigRepository } from '@domain/repositories/MarketConfigRepository';
import type { MarketConfig } from '@domain/entities/MarketConfig';
import type { MarketConfigDTO } from '@infra/api/market-config/marketConfig.dto';
import {
  mapMarketConfigDTOToEntity,
  mapMarketConfigEntityToDTO,
} from '@infra/api/market-config/marketConfig.mappers';

export class MarketConfigApiRepository implements MarketConfigRepository {
  async getMarketConfig(teamPublicId: string): Promise<MarketConfig> {
    const response = await httpClient.get<MarketConfigDTO>(`/api/market-config/${teamPublicId}`);
    return mapMarketConfigDTOToEntity(response);
  }

  async createMarketConfig(config: MarketConfig): Promise<MarketConfig> {
    const dto = mapMarketConfigEntityToDTO(config);
    const response = await httpClient.post<MarketConfigDTO>('/api/market-config', dto);
    return mapMarketConfigDTOToEntity(response);
  }

  async updateMarketConfig(config: MarketConfig): Promise<MarketConfig> {
    const dto = mapMarketConfigEntityToDTO(config);
    const response = await httpClient.put<MarketConfigDTO>(
      `/api/market-config/${config.teamId}`,
      dto
    );
    return mapMarketConfigDTOToEntity(response);
  }
}
