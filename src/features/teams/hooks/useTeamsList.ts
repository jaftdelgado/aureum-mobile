import { useState, useEffect } from 'react';
import { useAppNavigation } from '../../../app/hooks/useAppNavigation'; //
import { useAuth } from '../../../app/providers/AuthProvider'; //
import { getProfessorTeamsUseCase, getStudentTeamsUseCase } from '../../../app/di'; //
import { Team } from '../../../domain/entities/Team';

export const useTeamsList = () => {
  const navigation = useAppNavigation(); 
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeams = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = user.role === 'professor' 
        ? await getProfessorTeamsUseCase.execute(user.id)
        : await getStudentTeamsUseCase.execute(user.id);
      setTeams(data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [user]);

  const handleCreateTeam = () => {
    navigation.navigate('MainTabs', {
    screen: 'Teams',
    params: { screen: 'CreateTeam' }
  });
  };

  const handleJoinTeam = () => {
    navigation.navigate('MainTabs', {
    screen: 'Teams',
    params: { screen: 'JoinTeam' }
  });
  };

  const handleSelectTeam = (team: Team) => {
    navigation.navigate('MainTabs', {
      screen: 'Teams',
      params: { 
        screen: 'SelectedTeam', 
        params: { teamId: team.public_id, teamName: team.name } 
      }
    });
  };

  return { teams, isLoading, handleCreateTeam, handleJoinTeam, handleSelectTeam, refetch: fetchTeams };
};