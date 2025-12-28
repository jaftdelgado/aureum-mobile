import React from 'react';
import { View, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@core/ui/Text';
import { Button } from '@core/ui/Button';
import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';
import { TeamModules } from '@features/teams/components/TeamModules';
import { useSelectedTeam } from '../hooks/useSelectedTeam';

export default function SelectedTeamScreen() {
  const insets = useSafeAreaInsets();

  const {
    t,
    scrollY,
    teamName,
    teamDescription,
    handleMembers,
    handleAssets,
    handleSettings,
    handleMarket, 
    handleTransactions, 
    handleBack,
  } = useSelectedTeam();

  return (
    <View className="flex-1">
      <FixedHeader title={teamName} scrollY={scrollY} />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        contentContainerStyle={{
          paddingTop: 50 + insets.top,
          paddingHorizontal: 16,
          paddingBottom: 60,
        }}
        className="flex-1">
        <DisplayTitle title={teamName} scrollY={scrollY} />

        {teamDescription && (
          <View className="mb-6 mt-6 px-1">
            <Text type="body" color="secondary">
              {teamDescription}
            </Text>
          </View>
        )}

        <TeamModules
          onMembers={handleMembers}
          onAssets={handleAssets}
          onSettings={handleSettings}
          onMarket={handleMarket}
          onTransactions={handleTransactions}
        />
      </Animated.ScrollView>

      <View className="absolute left-3 right-3" style={{ bottom: insets.bottom }}>
        <Button variant="outline" title={t('common.back')} onPress={handleBack} />
      </View>
    </View>
  );
}
