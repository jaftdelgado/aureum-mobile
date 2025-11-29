import { AssetsRepository } from '@domain/repositories/AssetsRepository';
import { Asset } from '@domain/entities/Asset';
import { client } from '@infra/api/http/client';
import { AssetDTO } from '@infra/api/assets/assets.dto';
import { mapAssetDTOToEntity } from '@infra/api/assets/assets.mappers';

export class AssetsApiRepository implements AssetsRepository {
  async getAllAssets(): Promise<Asset[]> {
    const response = await client.get<AssetDTO[]>('/api/assets');
    return response.data.map(mapAssetDTOToEntity);
  }

  async getAssetById(publicId: string): Promise<Asset> {
    const response = await client.get<AssetDTO>(`/api/assets/${publicId}`);
    return mapAssetDTOToEntity(response.data);
  }
}
