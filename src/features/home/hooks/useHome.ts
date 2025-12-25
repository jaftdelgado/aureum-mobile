import { useRef } from 'react';
import { Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '@app/providers/AuthProvider';
import { useLastVisitedTeam } from '../../teams/hooks/useLastVisitedTeam';
import { TabParamList } from '../../../app/navigation/routes-types';
import { Team } from '../../../domain/entities/Team';

type NavigationProp = NativeStackNavigationProp<TabParamList>;

export const useHome = () => {
  const { t } = useTranslation('home'); 
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const { lastTeam } = useLastVisitedTeam();

  const scrollY = useRef(new Animated.Value(0)).current;

  const handleTeamPress = (team: Team) => {
    navigation.navigate('Teams', {
      screen: 'SelectedTeamRoot',
      params: { team },
    } as any);
  };

  const displayName = user?.username || user?.fullName || t('common.user', 'Usuario');

  return {
    t,
    user,
    lastTeam,
    scrollY,
    displayName,
    handleTeamPress,
  };
};