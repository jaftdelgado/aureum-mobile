import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@app/providers/AuthProvider';
import { joinTeamUseCase } from '../../../app/di'; 
import { invalidateTeamsCache } from '../hooks/useTeamsList';

export const useJoinTeam = () => {
  const { t } = useTranslation('teams');
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!code.trim() || !user?.id){
      Alert.alert(t('common.attention'), t('join.code_required'));
      return;
    }

    setLoading(true);
    try {
      await joinTeamUseCase.execute(user.id, code.trim());
      if (user?.id) {
        await invalidateTeamsCache(user.id); 
      }
      Alert.alert(
        t('common.success'),
        t('join.success_msg'),
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error(error);
      const displayMessage = error.message || t('join.error_msg');
      Alert.alert(t('join.error_title'), displayMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    t,
    code, setCode,
    loading,
    handleJoin,
    goBack: () => navigation.goBack()
  };
};