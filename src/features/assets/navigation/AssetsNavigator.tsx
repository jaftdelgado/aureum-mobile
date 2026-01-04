import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssetsScreen from '../screens/AssetsScreen';
import TeamAssetsScreen from '../screens/TeamAssetsScreen';
import { AssetsStackParamList } from '../../../app/navigation/routes-types';

const Stack = createNativeStackNavigator<AssetsStackParamList>();

export function AssetsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="TeamAssets" // Define TeamAssets como la principal
    >
      <Stack.Screen
        name="TeamAssets"
        component={TeamAssetsScreen}
      // ⚠️ IMPORTANTE: Como TeamAssetsScreen espera un 'teamId' en los params,
      // asegúrate de pasar un valor por defecto si esta es tu vista inicial de prueba,
      // o asegúrate de que cuando navegues a este Stack, pases los params.
      // initialParams={{ teamId: 'mi-team-id-temporal' }}
      />

      {/* Mantenemos AssetsScreen por si quieres navegar a ella desde TeamAssets (ej. para agregar nuevos) */}
      <Stack.Screen name="Assets" component={AssetsScreen} />
    </Stack.Navigator>
  );
}
