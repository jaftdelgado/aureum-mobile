import React, { useRef } from 'react';
import { View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Image, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@core/ui/Text';
import { Button } from '@core/ui/Button';
import { TextField } from '@core/ui/TextField';
import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';
import { useCreateTeam } from '../hooks/useCreateTeam'; 

export const CreateTeamScreen = () => {
  const { 
    t, 
    name, setName, 
    description, setDescription, 
    selectedImage, pickImage, 
    loading, handleCreate, goBack 
  } = useCreateTeam();
  
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const MAX_DESC_LENGTH = 160;

  return (
    <View className="flex-1">
      <FixedHeader title={t('create.title')} scrollY={scrollY} />

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
                paddingBottom: 60
              }}
              keyboardShouldPersistTaps="handled"
              className="flex-1"
            >
              <DisplayTitle title={t('create.title')} scrollY={scrollY} />

              <TouchableOpacity 
                onPress={pickImage}
                activeOpacity={0.8}
                className={`w-full h-48 rounded-2xl mb-6 justify-center items-center overflow-hidden border-2 border-dashed mt-8 ${
                  selectedImage 
                    ? 'border-primary bg-white dark:bg-slate-800' 
                    : 'border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800'
                }`}
              >
                {selectedImage ? (
                  <Image source={{ uri: selectedImage.uri }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <View className="items-center p-4">
                    <Text type="caption1" color="secondary" align="center">
                      {t('create.upload_cover')}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <View className="gap-4">
                <TextField
                  label={t('create.team_name')}
                  placeholder={t('create.name_placeholder')}
                  value={name}
                  onChangeText={setName}
                />

                <View>
                  <TextField
                    label={t('create.description')}
                    placeholder={t('create.desc_placeholder')}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                    maxLength={MAX_DESC_LENGTH} 
                    className="h-28 py-3 leading-6" 
                    textAlignVertical="top"
                  />
                  <Text 
                    type="caption2" 
                    className={`text-right mt-1 ${description.length === MAX_DESC_LENGTH ? 'text-red-500 font-bold' : 'text-gray-400'}`}
                  >
                    {description.length}/{MAX_DESC_LENGTH}
                  </Text>
                </View>
              </View>
            </Animated.ScrollView>

            <View 
              className="px-4 pt-4"
              style={{ paddingBottom: Platform.OS === 'ios' ? insets.bottom : 20 }}
            >
              <Button
                title={loading ? t('create.creating') : t('create.action')}
                onPress={handleCreate}
                loading={loading}
                disabled={loading}
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