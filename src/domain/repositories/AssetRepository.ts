import type { Asset } from "@domain/entities/Asset";

export interface AssetRepository {
  getAssets(
    query: Record<string, unknown>,
    selectedAssetIds?: string[]
  ): Promise<{
    data: Asset[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }>;

  getAssetById(id: string, selectedAssetIds?: string[]): Promise<Asset>;
}
