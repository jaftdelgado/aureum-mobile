import React from 'react';
import { TabBar } from '@app/components/tab-bar/TabBar';
import { HomeIcon } from '@resources/svg/tab-bar/HomeIcon';
import { TeamsIcon } from '@resources/svg/tab-bar/TeamsIcon';
import { LessonsIcon } from '@resources/svg/tab-bar/LessonsIcon';
import { SettingsIcon } from '@resources/svg/tab-bar/SettingsIcon';
import type { TabParamList } from '@app/navigation/routes-types';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

type AppTabBarProps = BottomTabBarProps;

export const tabs = [
  { key: 'Home', label: 'tabs.home', icon: HomeIcon },
  { key: 'Teams', label: 'tabs.teams', icon: TeamsIcon },
  { key: 'Lessons', label: 'tabs.lessons', icon: LessonsIcon },
  { key: 'Settings', label: 'tabs.settings', icon: SettingsIcon },
] as const;

export const AppTabBar: React.FC<AppTabBarProps> = ({ state, navigation }) => {
  const { t } = useTranslation('app', { keyPrefix: 'app' });

  const activeTab = state.routes[state.index].name as keyof TabParamList;

  const handleTabPress = (key: keyof TabParamList) => {
    if (key === 'Teams') {
      navigation.navigate('Teams', { 
        screen: 'Teams' 
      });
    } 
    else if (key === 'Settings') {
      navigation.navigate('Settings', { 
        screen: 'SettingsRoot' 
      });
    } 
    else {
      navigation.navigate(key);
    }
  };

  const translatedTabs = tabs.map((tab) => ({
    ...tab,
    label: t(tab.label),
  }));

  return <TabBar tabs={translatedTabs} activeTab={activeTab} onTabPress={handleTabPress} />;
};
