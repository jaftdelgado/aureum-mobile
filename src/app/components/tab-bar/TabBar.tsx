import React, { FC } from 'react';
import { View } from 'react-native';
import { cn } from '@core/utils/cn';
import { cva } from 'class-variance-authority';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useTheme } from '@app/providers/ThemeProvider';
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

const tabBarStyles = cva('flex-row justify-around items-center px-3', {
  variants: {},
  defaultVariants: {},
});

export const TabBar: FC<TabBarProps> = ({ tabs, activeTab, onTabPress }) => {
  const { isDark } = useTheme();
  return (
    <BlurView
      intensity={85}
      tint={isDark ? 'dark' : 'light'}
      className="bg-white/80 dark:bg-black/50"
      style={{
        borderTopWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      }}>
      <SafeAreaView edges={['bottom']} className="bg-transparent">
        <View className={cn(tabBarStyles())} style={{ height: 58 }}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <TabButton key={tab.key} tab={tab} isActive={isActive} onTabPress={onTabPress} />
            );
          })}
        </View>
      </SafeAreaView>
    </BlurView>
  );
};
