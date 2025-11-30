// src/features/teams/screens/TeamsScreen.tsx
import React, { useRef } from 'react';
import { View, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';

import { ListContainer } from '@core/ui/ListContainer';
import { ListOption } from '@core/ui/ListOption';

import { Carousel } from '@core/ui/Carousel';
import { LastVisitedTeamCard } from '../components/LastVisitedTeamCard';
import { Section } from '@core/ui/Section';

export default function TeamsScreen() {
  const { t } = useTranslation('teams');
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

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
        }}
        className="flex-1">
        <DisplayTitle title={t('title')} scrollY={scrollY} />

        <Section title={t('lastVisited')} subtitle={t('lastVisited_sub')}>
          <Carousel gap="md" padding="none">
            <LastVisitedTeamCard image="https://picsum.photos/600/400" name="Robotics Club" />
            <LastVisitedTeamCard image="https://picsum.photos/600/401" name="Music Band" />
            <LastVisitedTeamCard image="https://picsum.photos/600/402" name="Art Studio" />
          </Carousel>
        </Section>

        <ListContainer>
          <ListOption text={t('list.create')} onPress={() => console.log('Create team')} />
          <ListOption text={t('list.invites')} onPress={() => console.log('Invitations')} />
          <ListOption text={t('list.myTeams')} onPress={() => console.log('My teams')} />
          <ListOption text={t('list.archived')} onPress={() => console.log('Archived')} />
        </ListContainer>
      </Animated.ScrollView>
    </View>
  );
}
