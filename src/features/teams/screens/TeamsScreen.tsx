import React, { useRef } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Text } from '@core/ui/Text';
import { Button } from '@core/ui/Button';
import { TeamCard } from '../components/TeamCard';
import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';
import { useTeamsList } from '../hooks/useTeamsList';
import { Team } from '../../../domain/entities/Team';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const TeamsScreen = () => {
  const { t } = useTranslation('teams');
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const {
    teams,
    loading,
    refreshing,
    onRefresh,
    userRole,
    handleSelectTeam,
    handleCreateTeam,
    handleJoinTeam,
  } = useTeamsList();

  const renderHeader = () => (
    <View className="mb-4">
      <DisplayTitle title={t('title')} scrollY={scrollY} />

      <View className="mt-6 px-1">
        <Text type="title3" weight="semibold">
          {userRole === 'professor'
            ? t('subtitle_prof', 'Gestiona tus grupos académicos')
            : t('subtitle_student', 'Aprende y compite en tus grupos')}
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View className="flex-1 items-center justify-center px-6 py-20">
        <Text type="title3" color="secondary" align="center" className="mb-4">
          {t('no_teams', 'No tienes cursos activos')}
        </Text>
        <Button
          title={
            userRole === 'professor'
              ? t('create_first', 'Crear mi primer curso')
              : t('join_first', 'Unirme a un curso')
          }
          onPress={userRole === 'professor' ? handleCreateTeam : handleJoinTeam}
          variant="outline"
          className="w-full"
        />
      </View>
    );
  };

  return (
    <View className="flex-1">
      <FixedHeader title={t('title')} scrollY={scrollY} />

      {loading && teams.length === 0 && (
        <View className="absolute inset-0 z-50 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text type="body" color="secondary" className="mt-4">
            {t('loading_teams', 'Cargando cursos...')}
          </Text>
        </View>
      )}

      <AnimatedFlatList
        data={teams}
        keyExtractor={(item: any) => item.public_id}
        renderItem={({ item }: { item: any }) => (
          <TeamCard
            team={item as Team}
            onPress={() => handleSelectTeam(item as Team)}
            role={userRole}
          />
        )}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: 50 + insets.top,
          paddingHorizontal: 16,
          paddingBottom: 60,
          flexGrow: 1,
        }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {!loading && teams.length > 0 && (
        <View className="absolute left-4 right-4" style={{ bottom: insets.bottom }}>
          <Button
            title={userRole === 'professor' ? t('create_team') : t('join_team')}
            onPress={userRole === 'professor' ? handleCreateTeam : handleJoinTeam}
            className="shadow-xl"
          />
        </View>
      )}
    </View>
  );
};
