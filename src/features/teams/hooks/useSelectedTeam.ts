import { useEffect, useRef, useState } from 'react';
import { Alert, Animated } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SelectedTeamStackParamList } from '../../../app/navigation/teams/SelectedTeamNavigator';

export const useSelectedTeam = () => {
  const { t } = useTranslation('teams');
  const navigation = useNavigation<NativeStackNavigationProp<SelectedTeamStackParamList>>();
  const route = useRoute<RouteProp<SelectedTeamStackParamList, 'SelectedTeam'>>();
  const [isCopied, setIsCopied] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const team = route.params?.team;

  useEffect(() => {
    if (!team || !team.public_id) {
      Alert.alert(t('common.error'), t('team.load_error', 'No se pudo cargar la información del curso.'), [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  }, [team, navigation, t]);

  const teamName = team?.name ?? t('team.untitled');
  const teamDescription = team?.description;
  const teamId = team?.public_id;
  const accessCode = team?.access_code;

  const handleBack = () => navigation.goBack();

  const handleCopyCode = async () => {
    if (accessCode && accessCode !== "N/A") {
      await Clipboard.setStringAsync(accessCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 5000);
    }
  };

  const handleAssets = () => {
    navigation.navigate('AssetsRoot' as any, {
      screen: 'TeamAssets',
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

  const handleMarket = () => navigation.navigate('MarketRoot', { teamId });
  const handleTransactions = () => navigation.navigate('TransactionsRoot');

  return {
    t,
    scrollY,
    team,
    teamName,
    teamDescription,
    accessCode,
    isCopied,
    handleCopyCode,
    handleOverview,
    handleMembers,
    handleAssets,
    handleSettings,
    handleMarket,
    handleTransactions,
    handleBack
  };
};