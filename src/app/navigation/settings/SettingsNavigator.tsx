import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../routes-types';

import SettingsScreen from '@features/settings/screens/SettingsScreen';
import { ProfileScreen } from '@features/settings/screens/ProfileScreen';
import { EditProfileScreen } from '@features/settings/screens/EditProfileScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsRoot" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};