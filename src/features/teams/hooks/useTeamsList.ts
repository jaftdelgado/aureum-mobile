import { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@app/providers/AuthProvider';
import { getStudentTeamsUseCase, getProfessorTeamsUseCase } from '../../../app/di';
import { Team } from '../../../domain/entities/Team';
import { TeamsStackParamList } from '../../../app/navigation/routes-types';
import { useLastVisitedTeam } from './useLastVisitedTeam';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@teams_cache_';
const CACHE_DURATION = 10 * 60 * 1000;

export const invalidateTeamsCache = async (userId: string) => {
  try {
    await AsyncStorage.removeItem(`${CACHE_PREFIX}${userId}`);
  } catch (e) {
    console.error("Error invalidating cache", e);
  }
};

export const useTeamsList = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<TeamsStackParamList>>();
  const { saveLastTeam } = useLastVisitedTeam();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeams = useCallback(async (forceRefresh = false) => {
    if (!user) return;

    const cacheKey = `${CACHE_PREFIX}${user.id}`;

    try {
      if (!forceRefresh) {
        const cachedData = await AsyncStorage.getItem(cacheKey);
        
        if (cachedData) {
          const { teams: cachedTeams, timestamp } = JSON.parse(cachedData);
          const now = Date.now();
          
          if (now - timestamp < CACHE_DURATION) {
            setTeams(cachedTeams);
            setLoading(false);
            return; 
          }
        }
      }

      const data = user.role === 'professor' 
        ? await getProfessorTeamsUseCase.execute(user.id)
        : await getStudentTeamsUseCase.execute(user.id);
      
      setTeams(data);

      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        teams: data,
        timestamp: Date.now()
      }));

    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      
      const load = async () => {
        if (teams.length === 0) setLoading(true);
        
        if (isActive) await fetchTeams();
      };
      
      load();
      return () => { isActive = false; };
    }, [fetchTeams, teams.length]) 
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

    navigation.navigate('SelectedTeamRoot', { team });
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