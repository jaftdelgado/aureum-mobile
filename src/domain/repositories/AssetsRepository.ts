import { Asset } from '@domain/entities/Asset';

export interface AssetsRepository {
  getAllAssets(): Promise<Asset[]>;
  getAssetById(publicId: string): Promise<Asset>;
}
