import React from 'react';
import { View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@core/ui/Text';
import { Button } from '@core/ui/Button';
import { TextField } from '@core/ui/TextField';
import { useJoinTeam } from '../hooks/useJoinTeam'; 

export const JoinTeamScreen = () => {
  const insets = useSafeAreaInsets();
  const { t, code, setCode, loading, handleJoin, goBack } = useJoinTeam();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white px-6" style={{ paddingTop: insets.top + 20 }}>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="flex-1 justify-center -mt-20">
            <Text type="display" align="center" weight="bold" className="mb-2 text-primary">
              {t('join.title')}
            </Text>
            <Text type="body" align="center" color="secondary" className="mb-8 px-4">
              {t('join.subtitle')}
            </Text>

            <TextField
              placeholder={t('join.code_placeholder')}
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              autoCorrect={false}
              className="text-center text-2xl tracking-widest font-bold h-16"
              maxLength={10}
            />

            <Button
              title={loading ? t('join.joining') : t('join.action')}
              onPress={handleJoin}
              loading={loading}
              disabled={code.length < 3 || loading}
              className="mt-6"
            />
          </View>
        </KeyboardAvoidingView>

        <View className="flex-row justify-between items-center mb-10">
          <Button 
            title={t('common.cancel')}
            variant="outline" 
            onPress={goBack} 
            className="px-0"
            textClassName="text-secondary"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};