import React from 'react';
import { TabBar } from '@app/components/tab-bar/TabBar';
import { HomeIcon } from '@resources/svg/tab-bar/HomeIcon';
import { TeamsIcon } from '@resources/svg/tab-bar/TeamsIcon';
import { LessonsIcon } from '@resources/svg/tab-bar/LessonsIcon';
import { SettingsIcon } from '@resources/svg/tab-bar/SettingsIcon';
import type { TabParamList } from '@app/navigation/routes-types';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

type AppTabBarProps = BottomTabBarProps;

export const tabs = [
  { key: 'Home', label: 'Home', icon: HomeIcon },
  { key: 'Teams', label: 'Teams', icon: TeamsIcon },
  { key: 'Lessons', label: 'Lessons', icon: LessonsIcon },
  { key: 'Settings', label: 'Settings', icon: SettingsIcon },
] as const;

export const AppTabBar: React.FC<AppTabBarProps> = ({ state, navigation }) => {
  const activeTab = state.routes[state.index].name as keyof TabParamList;

  const handleTabPress = (key: keyof TabParamList) => {
    navigation.navigate(key);
  };

  return <TabBar tabs={tabs} activeTab={activeTab} onTabPress={handleTabPress} />;
};
