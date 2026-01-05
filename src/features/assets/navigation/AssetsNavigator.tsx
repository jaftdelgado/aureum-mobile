import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssetsScreen from '../screens/AssetsScreen';
import TeamAssetsScreen from '../screens/TeamAssetsScreen';
import { AssetsStackParamList } from '../../../app/navigation/routes-types';

const Stack = createNativeStackNavigator<AssetsStackParamList>();

export function AssetsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="TeamAssets">
      <Stack.Screen name="TeamAssets" component={TeamAssetsScreen} />

      <Stack.Screen name="Assets" component={AssetsScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
