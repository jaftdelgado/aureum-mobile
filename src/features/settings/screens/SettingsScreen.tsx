import React, { useRef } from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';
import { ListContainer } from '@core/ui/ListContainer';
import { ListOption } from '@core/ui/ListOption';
import { Text } from '@core/ui/Text';
import { Avatar } from '@core/ui/Avatar';
import { useSettings } from '../hooks/usesettings';
import { SettingsStackParamList } from '../../../app/navigation/routes-types';
import { ThemeIcon } from '../resources/svg/ThemeIcon';
import { LanguageIcon } from '../resources/svg/LanguageIcon';
import { LogoutIcon } from '../resources/svg/LogoutIcon';
import { TrashIcon } from '../resources/svg/TrashIcon';

export default function SettingsScreen() {
  const { t } = useTranslation('settings');
  const {
    loading,
    handleLogout,
    handleDeleteAccount,
    handleChangeLanguage,
    user,
    avatarUrl,
    initials,
    isDark,
    toggleTheme
  } = useSettings();

  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
   const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();

  return (
    <View className="flex-1">
      <FixedHeader title={t('title')} scrollY={scrollY} />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        contentContainerStyle={{
          paddingTop: 50 + insets.top,
          paddingHorizontal: 16,
          paddingBottom: 24,
          flexGrow: 1,
        }}>
        <View>
          <DisplayTitle title={t('title')} scrollY={scrollY} />

          {user && (
            <View className="mb-3 mt-6">
              <Text type="title3" weight="semibold" className="mb-3 text-gray-900 dark:text-gray-100">
                {t('sections.account')}
              </Text>
              
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Profile')}
                className="flex-row items-center rounded-xl bg-white dark:bg-slate-800 p-4 shadow-sm"
              >
                <Avatar size="md" source={avatarUrl} placeholderText={initials} className="mr-4" />
                <View className="flex-1">
                  <Text type="body" weight="bold" className="text-gray-900 dark:text-gray-100">
                    {user.fullName}
                  </Text>
                  <Text type="caption1" className="text-gray-500 dark:text-gray-400">
                    {t('viewProfile')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="mt-auto">
          <ListContainer>
            <ListOption
              text={isDark ? (t('light_mode')) : (t('dark_mode'))}
              onPress={toggleTheme}
              icon={ThemeIcon}
              iconVariant={isDark ? "yellow" : "blue"} 
            />

            <ListOption
              text={t('changeLanguage')}
              onPress={handleChangeLanguage}
              icon={LanguageIcon}
              iconVariant="purple"
            />

            <ListOption
              text={t('logout')}
              onPress={handleLogout}
              icon={LogoutIcon}
              iconVariant="gray"
            />

            <ListOption
              text={
                <Text color="error" weight="medium">
                  {loading ? t('deleting') : t('deleteAccount')}
                </Text>
              }
              onPress={handleDeleteAccount}
              icon={TrashIcon}
              iconVariant="orange"
              isLast
            />
          </ListContainer>
        </View>
      </Animated.ScrollView>
    </View>
  );
}