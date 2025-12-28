import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MembersScreen from '@features/teams/screens/MembersScreen';
import { Team } from '@domain/entities/Team';

export type MembersStackParamList = {
  Members: { team: Team };
};

const Stack = createNativeStackNavigator<MembersStackParamList>();

export function MembersNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Members" component={MembersScreen} />
    </Stack.Navigator>
  );
}