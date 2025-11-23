import { AssetsRepository } from '@domain/repositories/AssetsRepository';
import { Asset } from '@domain/entities/Asset';

export class GetAssetsUseCase {
  constructor(private assetsRepository: AssetsRepository) {}

  async execute(): Promise<Asset[]> {
    return this.assetsRepository.getAllAssets();
  }
}
