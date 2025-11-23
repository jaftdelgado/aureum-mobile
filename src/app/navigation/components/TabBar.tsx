import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { HomeIcon } from '@app/navigation/icons/HomeIcon';
import { TeamsIcon } from '@app/navigation/icons/TeamsIcon';
import { LessonsIcon } from '@app/navigation/icons/LessonsIcon';
import { SettingsIcon } from '@app/navigation/icons/SettingsIcon';

interface TabBarProps {
  activeTab?: number;
  onTabPress?: (index: number) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab = 0, onTabPress }) => {
  const tabs = [
    { icon: HomeIcon },
    { icon: TeamsIcon },
    { icon: LessonsIcon },
    { icon: SettingsIcon },
  ];

  return (
    <View className="absolute bottom-12 left-14 right-14 mx-auto flex-row items-center justify-between rounded-[22px] bg-white p-2 shadow-md">
      {tabs.map((tab, index) => {
        const isActive = activeTab === index;
        const Icon = tab.icon;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onTabPress?.(index)}
            activeOpacity={0.7}
            className="flex-none">
            <View
              className={`
                items-center justify-center
                ${isActive ? 'rounded-[16px] bg-blue-50 px-5 py-5' : 'px-5 py-5'}
              `}>
              <Icon width={20} height={20} color={isActive ? '#2563EB' : '#6B7280'} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
