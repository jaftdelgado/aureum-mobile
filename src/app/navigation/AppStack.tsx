import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { ProfileScreen } from '@features/settings/screens/ProfileScreen';
import { EditProfileScreen } from '@features/settings/screens/EditProfileScreen';

export type AppStackParamList = {
  MainTabs: undefined;
  Profile: undefined;
  Details: { id: string };
  EditProfile: undefined;
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
      
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ 
          headerShown: false,
          presentation: 'modal' 
        }} 
      />

    </Stack.Navigator>
  );
};

export default AppStack;
