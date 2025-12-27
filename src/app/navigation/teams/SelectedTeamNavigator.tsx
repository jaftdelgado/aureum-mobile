import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SelectedTeamScreen from '@features/teams/screens/SelectedTeamScreen';
import { AssetsNavigator } from '@features/assets/navigation/AssetsNavigator';
import { MarketNavigator } from '@features/market/navigation/MarketNavigator';
import { TransactionsNavigator } from '@features/transactions/navigation/TransactionsNavigator';

export type SelectedTeamStackParamList = {
  SelectedTeam: { teamId?: string } | undefined;
  MarketRoot: undefined;
  AssetsRoot: undefined;
  TransactionsRoot: undefined;
};

const Stack = createNativeStackNavigator<SelectedTeamStackParamList>();

export function SelectedTeamNavigator({ route }: any) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SelectedTeam" component={SelectedTeamScreen} />
      <Stack.Screen name="MarketRoot" component={MarketNavigator} />
      <Stack.Screen name="AssetsRoot" component={AssetsNavigator} />
      <Stack.Screen name="TransactionsRoot" component={TransactionsNavigator} />
    </Stack.Navigator>
  );
}
