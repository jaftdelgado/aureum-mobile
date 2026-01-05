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
    query: GetAssetsQueryDTO & { selectedAssetIds?: string[] },
    selectedAssetIdsArg: string[] = []
  ): Promise<{ data: Asset[]; meta: PaginatedResultDTO<AssetDTO>['meta'] }> {
    const idsToSend =
      query.selectedAssetIds && query.selectedAssetIds.length > 0
        ? query.selectedAssetIds
        : selectedAssetIdsArg;

    const { selectedAssetIds: _, ...restQuery } = query;

    const searchParams = new URLSearchParams();

    Object.entries(restQuery).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    if (idsToSend && idsToSend.length > 0) {
      idsToSend.forEach((id) => {
        searchParams.append('selectedAssetIds', id);
      });
    }

    const queryString = searchParams.toString();
    const finalUrl = `/api/assets?${queryString}`;

    const response = await httpClient.get<PaginatedResultDTO<AssetDTO>>(finalUrl);

    return mapPaginatedAssetsDTOToEntity(response, idsToSend);
  }

  async getAssetById(id: string, selectedAssetIds: string[] = []): Promise<Asset> {
    const response = await httpClient.get<AssetDTO>(`/api/assets/${id}`);
    return mapAssetDTOToEntity(response, selectedAssetIds);
  }
}
