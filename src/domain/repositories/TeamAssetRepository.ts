// src/domain/repositories/TeamAssetRepository.ts
import type { TeamAsset } from "@domain/entities/TeamAsset";

export interface TeamAssetRepository {
  findAllByTeamId(teamId: string): Promise<TeamAsset[]>;

  syncTeamAssets(
    teamId: string,
    selectedAssetIds: string[]
  ): Promise<TeamAsset[]>;
}
