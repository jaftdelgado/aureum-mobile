import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssetsScreen from '../screens/AssetsScreen';
import { AssetsStackParamList } from '../../../app/navigation/routes-types';

const Stack = createNativeStackNavigator<AssetsStackParamList>();

export function AssetsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Assets" component={AssetsScreen} />
    </Stack.Navigator>
  );
}