import React from 'react';
import { View, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Text } from '@core/ui/Text';
import { LastVisitedTeamCard } from '../../teams/components/LastVisitedTeamCard';
import { TabParamList } from '../../../app/navigation/routes-types';
import { useHome } from '../hooks/useHome';
import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const { t, scrollY, displayName, lastTeam, handleTeamPress } = useHome();

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
        <DisplayTitle title={t('welcome', { name: displayName })} scrollY={scrollY} />

        <View className="mt-6">
          {lastTeam && (
            <View className="mb-8">
              <Text type="title3" weight="semibold" className="mb-3 text-gray-800">
                {t('continue_learning')}
              </Text>
              <LastVisitedTeamCard team={lastTeam} onPress={handleTeamPress} />
            </View>
          )}

          <View className="items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-10">
            <Text color="secondary">{t('widgets_placeholder')}</Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
