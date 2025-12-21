// src/domain/use-cases/team-assets/SyncTeamAssetsUseCase.ts
import type { TeamAssetRepository } from "@domain/repositories/TeamAssetRepository";
import type { TeamAsset } from "@domain/entities/TeamAsset";

export class SyncTeamAssetsUseCase {
  private teamAssetRepository: TeamAssetRepository;

  constructor(teamAssetRepository: TeamAssetRepository) {
    this.teamAssetRepository = teamAssetRepository;
  }

  async execute(
    teamId: string,
    selectedAssetIds: string[]
  ): Promise<TeamAsset[]> {
    return this.teamAssetRepository.syncTeamAssets(teamId, selectedAssetIds);
  }
}
