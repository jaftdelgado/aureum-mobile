import { useState, useEffect } from 'react';
import { Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@app/providers/AuthProvider';
import { joinTeamUseCase } from '../../../app/di'; 
import { invalidateTeamsCache } from '../hooks/useTeamsList';
import { getUserFriendlyErrorMessage } from '@core/utils/errorMapper';

export const useJoinTeam = () => {
  const { t } = useTranslation('teams');
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (loading) {
        e.preventDefault();
      }
    });
    return unsubscribe;
  }, [navigation, loading]);

  const validateCode = (inputCode: string) => {
    const cleanCode = inputCode.trim();
    
    if (!cleanCode) {
      Alert.alert(t('common.attention'), t('join.code_required'));
      return false;
    }
    
    if (cleanCode.length < 8) {
      Alert.alert(t('common.attention'), t('join.code_too_short', 'El código es muy corto.'));
      return false;
    }

    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(cleanCode)) {
      Alert.alert(t('common.attention'), t('join.code_invalid_format', 'El código solo debe contener letras y números.'));
      return false;
    }

    return true;
  };

  const handleJoin = async () => {
    if (loading) return;
    
    if (!user?.id) return;
    
    if (!validateCode(code)) return;

    Keyboard.dismiss();
    setLoading(true);

    try {
      await joinTeamUseCase.execute(user.id, code.trim());
      
      await invalidateTeamsCache(user.id);
      
      Alert.alert(
        t('common.success'), 
        t('join.success_msg'),
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

    } catch (error: any) {
      console.error("Join Team Error:", error);
      
      const displayMessage = getUserFriendlyErrorMessage(error, t);
      
      Alert.alert(t('common.error'), displayMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    t,
    code, setCode,
    loading,
    handleJoin,
    goBack: () => !loading && navigation.goBack() 
  };
};