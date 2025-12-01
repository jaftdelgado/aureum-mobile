// src/app/navigation/AppStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { ProfileScreen } from '@features/settings/screens/ProfileScreen';

export type AppStackParamList = {
  MainTabs: undefined;
  Profile: undefined;
  Details: { id: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={BottomTabNavigator} 
        options={{ headerShown: false }} 
      />
      
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ headerShown: false, presentation: 'card' }} 
      />
      
    </Stack.Navigator>
  );
};

export default AppStack;
