import { httpClient } from '@infra/api/http/client';
import type { TeamAssetRepository } from '@domain/repositories/TeamAssetRepository';
import type { TeamAsset } from '@domain/entities/TeamAsset';
import type { TeamAssetDTO } from '@infra/api/team-assets/teamAsset.dto';
import { mapTeamAssetDTOToEntity } from '@infra/api/team-assets/teamAsset.mappers';

export class TeamAssetApiRepository implements TeamAssetRepository {
  async findAllByTeamId(teamId: string): Promise<TeamAsset[]> {
    const response: TeamAssetDTO[] = await httpClient.get(`/api/team-assets/team/${teamId}`);
    return response.map(mapTeamAssetDTOToEntity);
  }

  async syncTeamAssets(teamId: string, selectedAssetIds: string[]): Promise<TeamAsset[]> {
    const response: TeamAssetDTO[] = await httpClient.post(`/api/team-assets/sync`, {
      teamId,
      selectedAssetIds,
    });
    return response.map(mapTeamAssetDTOToEntity);
  }
}
