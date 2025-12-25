import React, { useRef } from 'react';
import { View, KeyboardAvoidingView, Platform, Animated, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@core/ui/Text';
import { Button } from '@core/ui/Button';
import { TextField } from '@core/ui/TextField';
import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';
import { useJoinTeam } from '../hooks/useJoinTeam'; 

export const JoinTeamScreen = () => {
  const insets = useSafeAreaInsets();
  const { t, code, setCode, loading, handleJoin, goBack } = useJoinTeam();
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View className="flex-1 bg-bg">
      <FixedHeader title={t('join.title')} scrollY={scrollY} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            
            <Animated.ScrollView
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }], 
                { useNativeDriver: false }
              )}
              contentContainerStyle={{
                paddingTop: 50 + insets.top,
                paddingHorizontal: 16,
                paddingBottom: 20
              }}
              keyboardShouldPersistTaps="handled"
              className="flex-1"
            >
              <DisplayTitle title={t('join.title')} scrollY={scrollY} />

              <View className="mt-10 mb-8">
                <Text type="body" color="secondary">
                  {t('join.subtitle')}
                </Text>
              </View>

              <View className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <TextField
                  placeholder={t('join.code_placeholder')}
                  value={code}
                  onChangeText={setCode}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  className="text-center text-3xl tracking-[0.2em] font-bold h-20 text-primary"
                  maxLength={10}
                />
              </View>
            </Animated.ScrollView>

            <View 
              className="px-4 pt-4 border-t border-gray-100 bg-bg"
              style={{ paddingBottom: Platform.OS === 'ios' ? insets.bottom : 20 }}
            >
              <Button
                title={loading ? t('join.joining') : t('join.action')}
                onPress={handleJoin}
                loading={loading}
                disabled={code.length < 3 || loading}
                className="mb-3"
              />

              <Button 
                title={t('common.cancel')}
                variant="outline" 
                onPress={goBack} 
              />
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};