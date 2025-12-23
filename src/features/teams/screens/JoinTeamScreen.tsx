import React, { useState } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@core/ui/Text';
import { Button } from '@core/ui/Button';
import { TextField } from '@core/ui/TextField';
import { useAuth } from '@app/providers/AuthProvider';
import { TeamsApiRepository } from '../../../infra/api/teams/TeamsApiRepository';

export const JoinTeamScreen = () => {
  const { t } = useTranslation('teams');
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const teamsRepo = new TeamsApiRepository();

  const handleJoin = async () => {
    if (!code.trim() || !user?.id) return;
    
    setLoading(true);
    try {
      await teamsRepo.joinTeam({ userId: user.id, code: code.trim() });
      
      Alert.alert(
        t('success', '¡Éxito!'),
        t('join_success', 'Te has unido al curso correctamente.'),
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error(error);
      const serverMessage = error.message || error.response?.data?.message;

      const displayMessage = serverMessage 
        ? serverMessage 
        : t('join_error', 'Ocurrió un error al intentar unirse.');
        
      Alert.alert(t('error', 'Verifica el codigo de acceso'), displayMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white px-6" style={{ paddingTop: insets.top + 20 }}>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="flex-1 justify-center -mt-20">
            <Text type="display" align="center" weight="bold" className="mb-2 text-primary">
              Unirse a un Curso
            </Text>
            <Text type="body" align="center" color="secondary" className="mb-8 px-4">
              Pídele el código de acceso a tu profesor e ingrésalo aquí.
            </Text>

            <TextField
              placeholder="Ej. AB12-CD34"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              autoCorrect={false}
              className="text-center text-2xl tracking-widest font-bold h-16"
              maxLength={10}
            />

            <Button
              title={loading ? t('joining', 'Uniéndome...') : t('join_action', 'Unirse al Curso')}
              onPress={handleJoin}
              loading={loading}
              disabled={code.length < 3 || loading}
              className="mt-6"
            />
          </View>
        </KeyboardAvoidingView>

        <View className="flex-row justify-between items-center mb-10">
          <Button 
            title={t('cancel', 'Cancelar')} 
            variant="outline" 
            onPress={() => navigation.goBack()} 
            className="px-0"
            textClassName="text-secondary"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};