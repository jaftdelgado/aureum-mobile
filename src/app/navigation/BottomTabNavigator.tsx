import React from 'react';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppTabBar } from '@app/components/AppTabBar';
import type { TabParamList } from './routes-types';

import HomeScreen from '@features/home/screens/HomeScreen';
import { TeamsNavigator } from '@app/navigation/teams/TeamsNavigator';
import LessonsScreen from '@features/lessons/screens/LessonsScreen';
import { SettingsNavigator } from './settings/SettingsNavigator';

const Tab = createBottomTabNavigator<TabParamList>();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <AppTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Teams" component={TeamsNavigator} />
      <Tab.Screen name="Lessons" component={LessonsScreen} />
      <Tab.Screen name="Settings" component={SettingsNavigator}/>
    </Tab.Navigator>
  );
};
