import React from 'react';
import { View } from 'react-native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native'; 
import { TeamsStackParamList } from '../routes-types';
import { TeamsScreen } from '../../../features/teams/screens/TeamsScreen';
import { SelectedTeamNavigator } from './SelectedTeamNavigator';
import { JoinTeamScreen } from '../../../features/teams/screens/JoinTeamScreen';
import { CreateTeamScreen } from '../../../features/teams/screens/CreateTeamScreen';
import MembersScreen from '../../../features/teams/screens/MembersScreen';

const Stack = createNativeStackNavigator<TeamsStackParamList>();

export const TeamsNavigator = () => {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return <View />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Teams" component={TeamsScreen} />

      <Stack.Screen
        name="SelectedTeamRoot"
        component={SelectedTeamNavigator}
      />
      <Stack.Screen name="Members" component={MembersScreen} />

      <Stack.Screen name="JoinTeam" component={JoinTeamScreen} />
      <Stack.Screen name="CreateTeam" component={CreateTeamScreen} />
    </Stack.Navigator>
  );
};