import React, { useRef } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@core/ui/Avatar';
import { Text } from '@core/ui/Text';
import { TextField } from '@core/ui/TextField';
import { Button } from '@core/ui/Button';
import { Section } from '@core/ui/Section';

import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';

import { useEditProfile } from '../hooks/useEditProfile';
import { useTheme } from '@app/providers/ThemeProvider';

export const EditProfileScreen = () => {
  const { 
    t, loading, profile,
    fullName, setFullName, bio, setBio,
    imageSource, initials,
    pickImage, handleSave, handleCancel,
    hasChanges
  } = useEditProfile();

  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const scrollY = useRef(new Animated.Value(0)).current;

  if (!profile) return null;

  const BIO_LIMIT = 160;
  const currentLength = bio.length;
  const isNearLimit = currentLength >= (BIO_LIMIT - 10);

  return (
    <View className="flex-1">
      
      <FixedHeader title={t('editProfile')} scrollY={scrollY} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          
          <Animated.ScrollView
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }], 
              { useNativeDriver: false }
            )}
            contentContainerStyle={{
              paddingTop: 50 + insets.top,
              paddingHorizontal: 16,
              paddingBottom: 40, 
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <DisplayTitle title={t('editProfile')} scrollY={scrollY} />

            <View className="flex-1">
              
              <View className="items-center mb-2 mt-6">
                <TouchableOpacity onPress={pickImage} activeOpacity={0.8} className="items-center">
                  <View className="relative">
                    <Avatar 
                      size="xl" 
                      mode="rounded" 
                      source={imageSource}
                      placeholderText={initials}
                      className="mb-1"
                    />
                    <View className="absolute bottom-0 right-0 bg-white dark:bg-slate-700 p-1.5 rounded-full shadow-sm border border-gray-100 dark:border-slate-600">
                       <Text className="text-xs">📷</Text>
                    </View>
                  </View>
                  <Text type="subhead" className="font-medium mt-1 text-blue-600 dark:text-blue-400">
                    {t('changePhoto')}
                  </Text>
                </TouchableOpacity>
              </View>

              <Section title={t('profile.personalInfo')}>
                <View className="gap-2">
                  <TextField 
                    label={t('profile.username')} 
                    value={`@${profile.username}`} 
                    editable={false} 
                    className="opacity-50"
                  />

                  <TextField 
                    label={t('profile.name')}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Tu nombre"
                    inputClassName="py-3 text-body leading-5" 
                  />

                  <View>
                    <TextField 
                      label={t('profile.bio')}
                      value={bio}
                      onChangeText={setBio}
                      placeholder="Escribe algo..."
                      multiline={true}
                      textAlignVertical="top"
                      className="h-24 items-start py-2" 
                      inputClassName="text-body leading-5 h-full" 
                      scrollEnabled={true} 
                      maxLength={BIO_LIMIT} 
                    />
                    
                    <Text 
                      type="caption1" 
                      align="right"
                      color={isNearLimit ? 'error' : 'secondary'}
                      className="mt-1"
                    >
                      {currentLength}/{BIO_LIMIT}
                    </Text>
                  </View>

                </View>
              </Section>
              
            </View>

            <View className="mt-auto pt-2">
              <Button 
                title={t('saveChanges')}
                onPress={handleSave} 
                loading={loading}
                variant="primary"
                disabled={loading || !hasChanges}
              />
              <Button 
                title={t('cancel')}
                variant="outline"
                onPress={handleCancel} 
                disabled={loading}
                className="mt-3 border-gray-300 dark:border-slate-600"
                textClassName="text-gray-600 dark:text-gray-300"
              />
            </View>

          </Animated.ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};