import React, { useRef } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Text } from '@core/ui/Text';
import { Button } from '@core/ui/Button';
import { TeamCard } from '../components/TeamCard';
import { useTeamsList } from '../hooks/useTeamsList';
import FixedHeader from '@app/components/screen-header/FixedHeader';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const TeamsScreen = () => {
  const { t } = useTranslation('teams');
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const { 
    teams, 
    loading, 
    refreshing, 
    userRole, 
    handleRefresh, 
    handleTeamPress,
    handleCreateTeam,
    handleJoinTeam
  } = useTeamsList();

  const renderHeader = () => (
    <View className="mb-6">
      <Text type="display" weight="bold" className="mb-2">
        {t('title', 'Mis Cursos')}
      </Text>
      <Text type="body" color="secondary">
        {userRole === 'professor' 
          ? t('subtitle_prof', 'Gestiona tus grupos académicos')
          : t('subtitle_student', 'Aprende y compite en tus grupos')}
      </Text>
    </View>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View className="flex-1 justify-center items-center py-20">
        <Text type="title3" color="secondary" align="center" className="mb-4">
          {t('no_teams', 'No tienes cursos activos')}
        </Text>
        <Button 
          title={userRole === 'professor' ? t('create_first', 'Crear mi primer curso') : t('join_first', 'Unirme a un curso')}
          onPress={userRole === 'professor' ? handleCreateTeam : handleJoinTeam}
          variant="outline"
        />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <FixedHeader title={t('title')} scrollY={scrollY} />
    
      <AnimatedFlatList
        data={teams}
        keyExtractor={(item: any) => item.public_id} 
        renderItem={({ item }: any) => (
          <TeamCard 
            team={item} 
            onPress={handleTeamPress} 
            role={userRole}
          />
        )}

        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } 
        )}
        scrollEventThrottle={16}
        
        contentContainerStyle={{
          paddingTop: 60 + insets.top, 
          paddingHorizontal: 16,
          paddingBottom: 100, 
          flexGrow: 1,
        }}
        
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            progressViewOffset={insets.top + 20} 
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {!loading && teams.length > 0 && (
        <View 
          className="absolute right-4 left-4"
          style={{ bottom: insets.bottom + 20 }}
        >
          <Button
            title={userRole === 'professor' ? t('create_team', 'Crear Nuevo Curso') : t('join_team', 'Unirse a Curso')}
            onPress={userRole === 'professor' ? handleCreateTeam : handleJoinTeam}
            className="shadow-lg"
          />
        </View>
      )}

      {loading && (
        <View className="absolute inset-0 justify-center items-center bg-white/50">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};