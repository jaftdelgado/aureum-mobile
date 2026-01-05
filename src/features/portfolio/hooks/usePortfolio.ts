import { useQuery } from '@tanstack/react-query';
import { portfolioRepository } from '../../../app/di'; 
import { useAuth } from '../../../app/providers/AuthProvider'; 
import { useRoute, RouteProp } from '@react-navigation/native'; 
import { SelectedTeamStackParamList } from '../../../app/navigation/teams/SelectedTeamNavigator';

export const usePortfolio = () => {
  const { user } = useAuth();
  const route = useRoute<RouteProp<SelectedTeamStackParamList, 'Portfolio'>>();
  const team = route.params?.team; 

  const portfolioQuery = useQuery({
    queryKey: ['portfolio', team?.public_id, user?.id],
    queryFn: () => portfolioRepository.getByCourse(team!.public_id, user!.id),
    enabled: !!team?.public_id && !!user?.id,
    refetchInterval: 5000, 
  });

  return {
    portfolio: portfolioQuery.data ?? [],
    isLoading: portfolioQuery.isLoading,
    isError: portfolioQuery.isError,
    refetch: portfolioQuery.refetch
  };
};