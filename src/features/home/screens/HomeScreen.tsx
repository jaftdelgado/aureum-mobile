import React, { useRef } from 'react';
import { View, Animated } from 'react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Text } from '@core/ui/Text';
import { useAuth } from '@app/providers/AuthProvider';
import { useLastVisitedTeam } from '../../teams/hooks/useLastVisitedTeam';
import { LastVisitedTeamCard } from '../../teams/components/LastVisitedTeamCard';
import { TabParamList } from '../../../app/navigation/routes-types';
import { Team } from '../../../domain/entities/Team';

import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';

type NavigationProp = NativeStackNavigationProp<TabParamList>;

export default function HomeScreen() {
  const { user } = useAuth();
  const { t } = useTranslation('teams'); 
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { lastTeam } = useLastVisitedTeam();

  const scrollY = useRef(new Animated.Value(0)).current;

  const handleTeamPress = (team: Team) => {
    navigation.navigate('Teams', {
      screen: 'SelectedTeamRoot',
      params: { team },
    });
  };

  const displayName = user?.fullName || user?.username || 'User';

  return (
    <View className="flex-1 bg-bg">
      <FixedHeader title={t('title')} scrollY={scrollY} />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }], 
          { useNativeDriver: false } 
        )}
        contentContainerStyle={{
          paddingTop: 50 + insets.top,
          paddingHorizontal: 16,
          paddingBottom: 24,
          flexGrow: 1,
        }}
      >
        <DisplayTitle title={t('welcome', { name: displayName })} scrollY={scrollY} />

        <View className="mt-6">
        {lastTeam && (
            <View className="mb-8">
              <Text type="title3" weight="semibold" className="mb-3 text-gray-800">
                {t('continue_learning')}
              </Text>
              <LastVisitedTeamCard 
                team={lastTeam} 
                onPress={handleTeamPress} 
              />
            </View>
          )}

          <View className="items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-xl">
              <Text color="secondary">{t('widgets_placeholder')}</Text>
          </View>
        </View>

      </Animated.ScrollView>
    </View>
  );
}