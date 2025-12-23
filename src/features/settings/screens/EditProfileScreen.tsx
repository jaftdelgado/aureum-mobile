import React from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@core/ui/Avatar';
import { Text } from '@core/ui/Text';
import { TextField } from '@core/ui/TextField';
import { Button } from '@core/ui/Button';
import { Section } from '@core/ui/Section';

import { useEditProfile } from '../hooks/useEditProfile';

export const EditProfileScreen = () => {
  const { 
    t, loading, profile,
    fullName, setFullName, bio, setBio,
    imageSource, initials,
    pickImage, handleSave, handleCancel 
  } = useEditProfile();

  const insets = useSafeAreaInsets();

  if (!profile) return null;

  const BIO_LIMIT = 160;
  const currentLength = bio.length;
  const isNearLimit = currentLength >= (BIO_LIMIT - 10);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-bg px-4" style={{ paddingBottom: insets.bottom + 10 }}>
        
        <View style={{ height: insets.top + 20 }} />

        <Text type="display" weight="bold" color="default" className="mb-2">
          {t('editProfile')}
        </Text>

        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View className="flex-1 justify-center">
            
            <View className="items-center mb-6">
              <TouchableOpacity onPress={pickImage} activeOpacity={0.8} className="items-center">
                <View className="relative">
                  <Avatar 
                    size="xl" 
                    mode="rounded" 
                    source={imageSource}
                    placeholderText={initials}
                    className="mb-1"
                  />
                  <View className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
                     <Text className="text-xs">📷</Text>
                  </View>
                </View>
                <Text color="default" type="subhead" className="text-blue-600 font-medium mt-1">
                  {t('changePhoto')}
                </Text>
              </TouchableOpacity>
            </View>

            <Section title={t('profile.personalInfo')}>
              <View className="gap-3">
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
                    className="h-32 items-start py-2" 
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

          <View>
            <Button 
              title={t('saveChanges')}
              onPress={handleSave} 
              loading={loading}
              variant="primary"
            />
            <Button 
              title={t('cancel')}
              variant="outline"
              onPress={handleCancel} 
              disabled={loading}
              className="mt-3 border-gray-300"
              textClassName="text-gray-600"
            />
          </View>

        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};