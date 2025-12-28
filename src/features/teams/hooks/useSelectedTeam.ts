import { useRef } from 'react';
import { Animated } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SelectedTeamStackParamList } from '../../../app/navigation/teams/SelectedTeamNavigator'; 

export const useSelectedTeam = () => {
  const { t } = useTranslation('teams');
  const navigation = useNavigation<NativeStackNavigationProp<SelectedTeamStackParamList>>();
  const route = useRoute<RouteProp<SelectedTeamStackParamList, 'SelectedTeam'>>();

  const scrollY = useRef(new Animated.Value(0)).current;

  const team = route.params?.team;
  
  const teamName = team?.name ?? t('team.untitled');
  const teamDescription = team?.description;
  const teamId = team?.public_id;

  const handleBack = () => navigation.goBack();

  const handleAssets = () => {
    navigation.navigate('AssetsRoot' as any, { 
      screen: 'Assets', 
      params: { teamId } 
    });
  };

  const handleOverview = () => console.log('Overview for:', teamId);

  const handleMembers = () => {
    if (team) {
      navigation.navigate('MembersRoot', {
        screen: 'Members',
        params: { teamId: team.public_id, teamName: team.name }
      });
    }
  };

  const handleSettings = () => console.log('Settings for:', teamId);

  const handleMarket = () => navigation.navigate('MarketRoot');
  const handleTransactions = () => navigation.navigate('TransactionsRoot');

  return {
    t,
    scrollY,
    team,
    teamName,
    teamDescription,
    handleOverview,
    handleMembers,
    handleAssets,
    handleSettings,
    handleMarket,     
    handleTransactions,  
    handleBack
  };
};