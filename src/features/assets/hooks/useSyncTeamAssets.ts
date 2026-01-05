import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TeamAssetApiRepository } from '@infra/api/team-assets/TeamAssetApiRepository';

export const useSyncTeamAssets = () => {
  const queryClient = useQueryClient();
  const repository = new TeamAssetApiRepository();

  return useMutation({
    mutationFn: ({ teamId, selectedAssetIds }: { teamId: string; selectedAssetIds: string[] }) => {
      return repository.syncTeamAssets(teamId, selectedAssetIds);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['team-assets', variables.teamId] });
    },
    onError: (error) => {
      console.error('Error syncing team assets:', error);
    },
  });
};
