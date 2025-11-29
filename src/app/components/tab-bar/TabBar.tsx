import React, { FC } from 'react';
import { View } from 'react-native';
import { cn } from '@core/utils/cn';
import { cva } from 'class-variance-authority';
import { TabParamList } from '@app/navigation/routes-types';
import { TabButton } from '@app/components/tab-bar/TabButton';

export type TabItem = {
  key: keyof TabParamList;
  label: string;
  icon: FC<any>;
};

interface TabBarProps {
  tabs: readonly TabItem[];
  activeTab: keyof TabParamList;
  onTabPress: (key: keyof TabParamList) => void;
}

const tabBarStyles = cva('flex-row justify-around items-center bg-white px-3', {
  variants: {},
  defaultVariants: {},
});

export const TabBar: FC<TabBarProps> = ({ tabs, activeTab, onTabPress }) => {
  return (
    <View className={cn(tabBarStyles())} style={{ height: 70 }}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return <TabButton key={tab.key} tab={tab} isActive={isActive} onTabPress={onTabPress} />;
      })}
    </View>
  );
};
