import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@app/providers/AuthProvider'
import { TeamsApiRepository } from '../../../infra/api/teams/TeamsApiRepository';
import { Team } from '../../../domain/entities/Team';
import { TeamsStackParamList } from '@app/navigation/teams/TeamsNavigator';

export const useTeamsList = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<TeamsStackParamList>>();
  const teamsRepo = new TeamsApiRepository();

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeams = useCallback(async () => {
    if (!user?.id || !user?.role) return;

    try {
      let data: Team[] = [];
      
      if (user.role === 'professor') {
        data = await teamsRepo.getProfessorTeams(user.id);
      } else {
        data = await teamsRepo.getStudentTeams(user.id);
      }
      
      setTeams(data);
    } catch (error) {
      console.error("Error cargando equipos", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, user?.role]);

  useFocusEffect(
    useCallback(() => {
      fetchTeams();
    }, [fetchTeams])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTeams();
  };

  const handleTeamPress = (team: Team) => {
    // @ts-ignore
    navigation.navigate('SelectedTeam', { 
      screen: 'TeamOverview',
      params: { teamId: team.publicId, teamName: team.name }
    });
  };

  const handleCreateTeam = () => {
    // @ts-ignore
    navigation.navigate('CreateTeam');
  };

  const handleJoinTeam = () => {
    // @ts-ignore
    navigation.navigate('JoinTeam');
  };

  return {
    teams,
    loading,
    refreshing,
    userRole: user?.role,
    handleRefresh,
    handleTeamPress,
    handleCreateTeam,
    handleJoinTeam
  };
};