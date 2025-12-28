import React, { useRef } from 'react';
import { View, ActivityIndicator, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Avatar } from '@core/ui/Avatar';
import { Text } from '@core/ui/Text';
import { Section } from '@core/ui/Section';
import { ListContainer } from '@core/ui/ListContainer';
import { Button } from '@core/ui/Button';
import { Separator } from '@core/ui/Separator'; 

import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';

import { useProfile } from '../hooks/useProfile';
import { useTheme } from '@app/providers/ThemeProvider';

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme(); 
  
  const scrollY = useRef(new Animated.Value(0)).current;

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
      <View className="flex-1 justify-center items-center bg-white dark:bg-slate-900">
        <ActivityIndicator size="large" color={isDark ? "#60A5FA" : "#0000ff"} />
      </View>
    );
  }

  if (!profile) return null;

  return (
    <View className="flex-1">

      <FixedHeader title={t('profile.title')} scrollY={scrollY} />

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
        showsVerticalScrollIndicator={false}
      >
        <DisplayTitle title={t('profile.title')} scrollY={scrollY} />

        <View className="flex-1">
          
          <View className="items-center mb-4 mt-10">
            <Avatar 
              size="xl" 
              mode="rounded" 
              placeholderText={initials}
              source={avatarUrl} 
              className="mb-4"
            />
            
            <Text type="title2" weight="bold" align="center" className="text-gray-900 dark:text-white">
              {profile.fullName}
            </Text>
            
            <Text type="body" className="text-gray-500 dark:text-gray-400" align="center">
              @{profile.username}
            </Text>
            
            <View className="mt-3 bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full mb-4">
              <Text type="caption1" className="text-blue-700 dark:text-blue-300 font-medium capitalize">
                {profile.role === 'student' ? t('profile.student') : t('profile.professor')}
              </Text>
            </View>
          </View>

          <Section title={t('profile.personalInfo')}>
            <ListContainer className="px-4 py-2 mt-2">
              
              <View className="flex-row items-center py-3">
                <View className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/20 items-center justify-center mr-4">
                  <Ionicons 
                    name="mail-outline" 
                    size={18} 
                    color={isDark ? "#60A5FA" : "#3B82F6"} 
                  />
                </View>
                <View className="flex-1 overflow-hidden"> 
                  <Text type="caption1" className="mb-0.5 uppercase tracking-wider text-[10px] text-gray-500 dark:text-gray-400">
                    {t('profile.email')}
                  </Text>
                  
                  <Text 
                    type="body" 
                    weight="medium" 
                    className="text-gray-900 dark:text-gray-100"
                    numberOfLines={1} 
                    adjustsFontSizeToFit={true} 
                    minimumFontScale={0.5}
                  >
                    {user?.email}
                  </Text>
                </View>
              </View>

              <Separator className="bg-gray-100 dark:bg-slate-700" />

              <View className="flex-row items-start py-3">
                <View className="w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-900/20 items-center justify-center mr-4 mt-0.5">
                  <Ionicons 
                    name="document-text-outline" 
                    size={18} 
                    color={isDark ? "#C084FC" : "#A855F7"} 
                  />
                </View>
                <View className="flex-1">
                  <Text type="caption1" className="mb-0.5 uppercase tracking-wider text-[10px] text-gray-500 dark:text-gray-400">
                    {t('profile.bio')}
                  </Text>
                  <Text type="body" className="leading-5 text-gray-700 dark:text-gray-300">
                    {profile.bio || t('profile.noBio')}
                  </Text>
                </View>
              </View>

            </ListContainer>
          </Section>

          <View className="mt-auto pt-8 gap-3">
            <Button 
                title={t('editProfile')} 
                variant="outline"
                onPress={() => profile && handleEditProfile(profile)}
                className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 w-auto px-6 h-10"
                textClassName="text-blue-700 dark:text-blue-300"
              />
            <Button 
              title={t('back')} 
              variant="outline"
              onPress={handleGoBack}
              className="border-gray-300 dark:border-slate-600"
              textClassName="text-gray-700 dark:text-gray-300"
            />
          </View>
        </View>

      </Animated.ScrollView>
    </View>
  );
};