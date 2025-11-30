import React, { useRef } from 'react';
import { View, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';

import { TeamModules } from '@features/teams/components/TeamModules';

import type { RouteProp } from '@react-navigation/native';
import type { SelectedTeamStackParamList } from '@app/navigation/teams/SelectedTeamNavigator';

export default function SelectedTeamScreen() {
  const { t } = useTranslation('teams');
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const route = useRoute<RouteProp<SelectedTeamStackParamList, 'SelectedTeam'>>();

  const teamId = route?.params?.teamId ?? t('team.untitled');

  return (
    <View className="flex-1">
      <FixedHeader title={teamId} scrollY={scrollY} />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        contentContainerStyle={{
          paddingTop: 50 + insets.top,
          paddingHorizontal: 16,
        }}
        className="flex-1">
        <DisplayTitle title={teamId} scrollY={scrollY} />

        <TeamModules
          onOverview={() => console.log('Overview')}
          onMembers={() => console.log('Members')}
          onAssets={() => console.log('Assets')}
          onSettings={() => console.log('Team Settings')}
        />
      </Animated.ScrollView>
    </View>
  );
}
