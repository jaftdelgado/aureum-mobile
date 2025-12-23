import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectedTeamScreen from '../../../features/teams/screens/SelectedTeamScreen';
import { AssetsNavigator } from '../../../features/assets/navigation/AssetsNavigator';

import { SelectedTeamStackParamList } from '../routes-types';

const Stack = createNativeStackNavigator<SelectedTeamStackParamList>();

export function SelectedTeamNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SelectedTeam" component={SelectedTeamScreen} />
      <Stack.Screen name="AssetsRoot" component={AssetsNavigator} />
    </Stack.Navigator>
  );
}