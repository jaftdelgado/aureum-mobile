// src/domain/use-cases/team-assets/GetTeamAssets.ts
import type { TeamAssetRepository } from "@domain/repositories/TeamAssetRepository";
import type { TeamAsset } from "@domain/entities/TeamAsset";

export class GetTeamAssetsUseCase {
  private teamAssetRepository: TeamAssetRepository;

  constructor(teamAssetRepository: TeamAssetRepository) {
    this.teamAssetRepository = teamAssetRepository;
  }

  async execute(teamId: string): Promise<TeamAsset[]> {
    return this.teamAssetRepository.findAllByTeamId(teamId);
  }
}
