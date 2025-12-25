import React, { useRef } from 'react';
import { View, Animated, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'; 

import { Text } from '@core/ui/Text';
import { Button } from '@core/ui/Button';
import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';
import { MemberCard } from '../components/MemberCard';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { TeamsStackParamList } from '../../../app/navigation/routes-types';

export default function MembersScreen() {
  const { t } = useTranslation('teams'); 
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const route = useRoute<RouteProp<TeamsStackParamList, 'Members'>>();
  const { teamId, teamName } = route.params;

  const { 
    members, 
    loading, 
    isProfessor, 
    handleRemoveMember, 
    onRefresh 
  } = useTeamMembers(teamId);

  return (
    <View className="flex-1 bg-bg">
      <FixedHeader title={t('members.title')} scrollY={scrollY} />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        contentContainerStyle={{
          paddingTop: 50 + insets.top,
          paddingHorizontal: 16,
          paddingBottom: 120
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        className="flex-1"
      >
        <DisplayTitle title={t('members.title')} scrollY={scrollY} />
        

        <View className="flex-col gap-2 mt-12">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              isProfessorView={isProfessor}
              onRemove={() => handleRemoveMember(member.id, member.name)}
            />
          ))}

          {!loading && members.length === 0 && (
            <View className="py-10 items-center">
              <Text color="secondary">{t('members.empty')}</Text>
            </View>
          )}
        </View>

      </Animated.ScrollView>
      <View 
          className="absolute right-4 left-4"
          style={{ bottom: insets.bottom + 20 }}
      >
        <Button 
          variant="outline" 
          title={t('common.back')} 
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
}