import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Team } from '../../../domain/entities/Team';

const STORAGE_KEY = '@aureum_last_visited_team';

export const useLastVisitedTeam = () => {
  const [lastTeam, setLastTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  const loadLastTeam = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setLastTeam(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Error loading last team", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveLastTeam = async (team: Team) => {
    try {
      const jsonValue = JSON.stringify(team);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      setLastTeam(team); 
    } catch (e) {
      console.error("Error saving last team", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLastTeam();
    }, [loadLastTeam])
  );

  return {
    lastTeam,
    loading,
    saveLastTeam
  };
};