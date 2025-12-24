import React from 'react';
import { View, ScrollView } from 'react-native';
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

type NavigationProp = NativeStackNavigationProp<TabParamList>;

export default function HomeScreen() {
  const { user } = useAuth();
  const { t } = useTranslation('teams'); 
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  
  const { lastTeam } = useLastVisitedTeam();

  const handleTeamPress = (team: Team) => {
    navigation.navigate('Teams', {
      screen: 'SelectedTeamRoot',
      params: { team },
    });
  };

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        
        <Text type="title1" weight="bold" className="mb-6">
          Hola, {user?.username} 
        </Text>

        {lastTeam && (
          <View className="mb-8">
            <Text type="title3" weight="bold" className="mb-3 text-gray-800">
              Continuar aprendiendo
            </Text>
            <LastVisitedTeamCard 
              team={lastTeam} 
              onPress={handleTeamPress} 
            />
          </View>
        )}

        <View className="items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-xl">
            <Text color="secondary">Más widgets próximamente...</Text>
        </View>

      </ScrollView>
    </View>
  );
}