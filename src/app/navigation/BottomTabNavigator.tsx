import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppTabBar } from '@app/components/AppTabBar';
import type { TabParamList } from './routes-types';

import HomeScreen from '@features/home/screens/HomeScreen';
import TeamsScreen from '@features/teams/screens/TeamsScreen';
import LessonsScreen from '@features/lessons/screens/LessonsScreen';
import SettingsScreen from '@features/settings/screens/SettingsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <AppTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Teams" component={TeamsScreen} />
      <Tab.Screen name="Lessons" component={LessonsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};
