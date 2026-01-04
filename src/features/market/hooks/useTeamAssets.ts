import { useQuery } from '@tanstack/react-query';
import { TeamAssetApiRepository } from '@infra/api/team-assets/TeamAssetApiRepository';
import { GetTeamAssetsUseCase } from '@domain/use-cases/team-assets/GetTeamAssetsUseCase';
import type { TeamAsset } from '@domain/entities/TeamAsset';

const teamAssetRepository = new TeamAssetApiRepository();
const getTeamAssetsUseCase = new GetTeamAssetsUseCase(teamAssetRepository);

export const useTeamAssets = (teamId: string) => {
    const queryKey = ['team-assets', teamId];

    const query = useQuery<TeamAsset[], Error>({
        queryKey: queryKey,
        queryFn: async () => getTeamAssetsUseCase.execute(teamId),
        enabled: !!teamId,
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });

    return {
        assets: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isRefetching: query.isRefetching,
    };
};
