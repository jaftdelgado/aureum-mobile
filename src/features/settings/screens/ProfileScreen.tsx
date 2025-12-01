import React from 'react';
import { View, Animated } from 'react-native'; 
import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';
import { Avatar } from '@core/ui/Avatar';
import { Text } from '@core/ui/Text';
import { Section } from '@core/ui/Section';
import { ListContainer } from '@core/ui/ListContainer';
import { ListOption } from '@core/ui/ListOption';
import { Button } from '@core/ui/Button';
import { useProfile } from '../hooks/useProfile';

export const ProfileScreen = () => {
  const {
    t,
    user,
    profile,
    insets,
    scrollY,
    avatarUrl,
    initials,
    handleGoBack
  } = useProfile();

  if (!profile) return null;

  return (
    <View className="flex-1 bg-bg">
      <FixedHeader title={t('profile.title')} scrollY={scrollY} />

      <Animated.ScrollView 
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        contentContainerStyle={{ 
          paddingTop: 50 + insets.top, 
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 16,
          flexGrow: 1
        }}
      >
      <View>
        <DisplayTitle title={t('profile.title')} scrollY={scrollY} />

        <View className="items-center my-6">
          <Avatar 
            size="xl" 
            mode="rounded" 
            placeholderText={initials}
            source={avatarUrl ? { uri: avatarUrl } : null} 
            className="mb-4"
          />
          
          <Text type="title2" weight="bold" align="center">
            {profile.full_name}
          </Text>
          
          <Text type="body" color="secondary" align="center">
            @{profile.username}
          </Text>
          
          <View className="mt-2 bg-blue-100 px-3 py-1 rounded-full">
            <Text type="caption1" color="default" className="text-blue-700 font-medium capitalize">
              {profile.role === 'student' ? t('profile.student') : t('profile.professor')}
            </Text>
          </View>
        </View>

        {/* Datos */}
        <Section title={t('profile.personalInfo')}>
          <ListOption 
              text={profile.bio || "Sin biografía"} 
              disabled
              isLast
            />
          <ListContainer>
            <ListOption 
              text={user?.email || ""} 
              disabled 
            />
          </ListContainer>
        </Section>
      </View>
      <View className="mt-auto mb-4 pt-8">
        <View className="mt-8 mb-4">
          <Button 
            title={t('back')} 
            variant="outline"
            onPress={handleGoBack}
            className="border-gray-300"
            textClassName="text-gray-700"
          />
        </View>
      </View>
      </Animated.ScrollView>
    </View>
  );
};