import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from '@core/ui/Icon';
import { Text } from '@core/ui/Text';
import { TabParamList } from '@app/navigation/routes-types';
import type { TabItem } from '@app/components/tab-bar/TabBar';

interface TabButtonProps {
  tab: TabItem;
  isActive: boolean;
  onTabPress: (key: keyof TabParamList) => void;
}

export const TabButton: FC<TabButtonProps> = ({ tab, isActive, onTabPress }) => {
  return (
    <TouchableOpacity
      key={tab.key}
      onPress={() => onTabPress(tab.key)}
      className="flex-1 items-center justify-center"
      activeOpacity={0.7}>
      <Icon component={tab.icon} color={isActive ? 'primaryText' : 'secondaryText'} size={24} />
      <Text
        type="footnote"
        weight={isActive ? 'semibold' : 'regular'}
        color={isActive ? 'default' : 'secondary'}
        className="mt-1">
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
};
