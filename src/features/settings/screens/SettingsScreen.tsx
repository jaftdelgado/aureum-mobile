import React, { useRef } from 'react';
import { View, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';

import { Button } from '@core/ui/Button';
import { useSettings } from '../hooks/usesettings';

export default function SettingsScreen() {
  const { t } = useTranslation('settings');
  const { loading, handleLogout, handleDeleteAccount } = useSettings();
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <FixedHeader title={t('title')} scrollY={scrollY} />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        contentContainerStyle={{
          paddingTop: 50 + insets.top,
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}>
        <DisplayTitle title={t('title')} scrollY={scrollY} />

        <View className="mb-6 mt-4 gap-4">
          <Button
            title={t('logout')}
            variant="outline"
            onPress={handleLogout}
            disabled={loading}
            className="border-gray-300"
            textClassName="text-gray-700 font-medium"
          />

          <Button
            title={loading ? t('deleting') : t('deleteAccount')}
            variant="outline"
            onPress={handleDeleteAccount}
            disabled={loading}
            className="border-red-200 bg-red-50"
            textClassName="text-red-600 font-bold"
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
}
