import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@core/ui/Avatar';
import { Text } from '@core/ui/Text';
import { Section } from '@core/ui/Section';
import { ListContainer } from '@core/ui/ListContainer';
import { ListOption } from '@core/ui/ListOption';
import { Button } from '@core/ui/Button';

import { useProfile } from '../hooks/useProfile';

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    t,
    user,
    profile,
    loading,
    avatarUrl,
    initials,
    handleGoBack,
    handleEditProfile
  } = useProfile();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-bg">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!profile) return null;

  return (
    <View className="flex-1 bg-bg px-4" style={{ paddingBottom: insets.bottom + 20 }}>
      
      <View style={{ height: insets.top + 20 }} />

      <Text type="display" weight="bold" color="default" className="mb-2">
        {t('profile.title')}
      </Text>

      <View className="flex-1 justify-center">
        
        <View className="items-center mb-8">
          <Avatar 
            size="xl" 
            mode="rounded" 
            placeholderText={initials}
            source={avatarUrl} 
            className="mb-4"
          />
          
          <Text type="title2" weight="bold" align="center">
            {profile.fullName}
          </Text>
          
          <Text type="body" color="secondary" align="center">
            @{profile.username}
          </Text>
          
          <View className="mt-3 bg-blue-100 px-3 py-1 rounded-full mb-4">
            <Text type="caption1" color="default" className="text-blue-700 font-medium capitalize">
              {profile.role === 'student' ? t('profile.student') : t('profile.professor')}
            </Text>
          </View>
        </View>

        <Section title={t('profile.personalInfo')}>
          <ListContainer>
            <ListOption 
              text={user?.email || ""} 
              disabled 
            />
            <ListOption 
              text={profile.bio || "Sin biografía"} 
              disabled
              isLast
            />
          </ListContainer>
        </Section>
      </View>

      <View className="mt-auto">
        <Button 
            title={t('editProfile')} 
            variant="outline"
            onPress={handleEditProfile}
            className="border-blue-200 bg-blue-50 w-auto px-6 h-10 mb-2"
            textClassName="text-blue-700"
          />
        <Button 
          title={t('back')} 
          variant="outline"
          onPress={handleGoBack}
          className="border-gray-300"
          textClassName="text-gray-700"
        />
      </View>

    </View>
  );
};