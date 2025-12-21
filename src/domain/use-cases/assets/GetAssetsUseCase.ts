import type { AssetRepository } from "@domain/repositories/AssetRepository";
import type { Asset } from "@domain/entities/Asset";

export class GetAssetsUseCase {
  private assetRepository: AssetRepository;

  constructor(assetRepository: AssetRepository) {
    this.assetRepository = assetRepository;
  }

  async execute(
    query: Record<string, unknown>,
    selectedAssetIds: string[] = []
  ): Promise<{
    data: Asset[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    return this.assetRepository.getAssets(query, selectedAssetIds);
  }
}
