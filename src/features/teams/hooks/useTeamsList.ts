import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@app/providers/AuthProvider';
import { getStudentTeamsUseCase, getProfessorTeamsUseCase } from '../../../app/di';
import { Team } from '../../../domain/entities/Team';
import { AppStackParamList, TeamsStackParamList } from '../../../app/navigation/routes-types';
import { useLastVisitedTeam } from './useLastVisitedTeam';

export const useTeamsList = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<TeamsStackParamList & AppStackParamList>>();
  const { saveLastTeam } = useLastVisitedTeam();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeams = useCallback(async () => {
    if (!user) return;
    try {
      const data = user.role === 'professor' 
        ? await getProfessorTeamsUseCase.execute(user.id)
        : await getStudentTeamsUseCase.execute(user.id);
      
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const load = async () => {
        if(isActive) setLoading(true);
        await fetchTeams();
        if(isActive) setLoading(false);
      };
      load();
      return () => { isActive = false; };
    }, [fetchTeams])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTeams();
    setRefreshing(false);
  };

  const handleCreateTeam = () => navigation.navigate('CreateTeam');
  const handleJoinTeam = () => navigation.navigate('JoinTeam');
  
  const handleSelectTeam = (team: Team) => {
    saveLastTeam(team);

    /*navigation.navigate('SelectedTeam', { 
      team_id: team.id, 
      teamName: team.name 
    });*/
  };

  return {
    teams,
    loading,
    refreshing,
    onRefresh,
    userRole: user?.role, 
    handleCreateTeam,
    handleJoinTeam,
    handleSelectTeam
  };
};