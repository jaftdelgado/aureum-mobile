import { httpClient } from '@infra/api/http/client';
import type { AssetRepository } from '@domain/repositories/AssetRepository';
import type { AssetDTO, PaginatedResultDTO, GetAssetsQueryDTO } from '@infra/api/assets/asset.dto';
import {
  mapPaginatedAssetsDTOToEntity,
  mapAssetDTOToEntity,
} from '@infra/api/assets/asset.mappers';

import type { Asset } from '@domain/entities/Asset';

export class AssetApiRepository implements AssetRepository {
  async getAssets(
    query: GetAssetsQueryDTO,
    selectedAssetIds: string[] = []
  ): Promise<{ data: Asset[]; meta: PaginatedResultDTO<AssetDTO>['meta'] }> {
    const params: Record<string, string | string[]> = Object.fromEntries(
      Object.entries(query)
        .filter(([_, v]) => v != null)
        .map(([k, v]) => [k, Array.isArray(v) ? v.map(String) : String(v)])
    );

    if (selectedAssetIds.length) params.selectedAssetIds = selectedAssetIds;

    const response = await httpClient.get<PaginatedResultDTO<AssetDTO>>('/api/assets', params);

    return mapPaginatedAssetsDTOToEntity(response, selectedAssetIds);
  }

  async getAssetById(id: string, selectedAssetIds: string[] = []): Promise<Asset> {
    const response = await httpClient.get<AssetDTO>(`/api/assets/${id}`);

    return mapAssetDTOToEntity(response, selectedAssetIds);
  }
}
