import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SelectedTeamScreen from '@features/teams/screens/SelectedTeamScreen';
import { AssetsNavigator } from '@features/assets/navigation/AssetsNavigator';
import { MarketNavigator } from '@features/market/navigation/MarketNavigator';
import { MembersNavigator } from '@features/teams/navigation/MembersNavigator';
import { TransactionsNavigator } from '@features/transactions/navigation/TransactionsNavigator';
import { Team } from '@domain/entities/Team';

export type SelectedTeamStackParamList = {
  SelectedTeam: { team: Team }; 
  MarketRoot: undefined;
  AssetsRoot: undefined;
  TransactionsRoot: undefined;
  MembersRoot: { 
    screen: string;
    params: { teamId: String; teamName: string} 
  };
};

const Stack = createNativeStackNavigator<SelectedTeamStackParamList>();

export function SelectedTeamNavigator({ route }: any) {
  const { teamId } = route.params;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="SelectedTeam" 
        component={SelectedTeamScreen} 
        initialParams={route.params} 
      />
      <Stack.Screen name="MembersRoot" component={MembersNavigator} />
      <Stack.Screen name="MarketRoot" component={MarketNavigator} />
      <Stack.Screen name="AssetsRoot" component={AssetsNavigator} />
      <Stack.Screen name="TransactionsRoot" component={TransactionsNavigator} />
    </Stack.Navigator>
  );
}
