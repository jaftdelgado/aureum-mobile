import React, { ReactNode } from 'react';
import { View, Pressable, Text } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { cn } from '@core/utils/cn';

type SwipeAction = {
  label: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  width?: number;
};

interface ListItemProps {
  children: ReactNode;
  onPress?: () => void;
  swipeLeftActions?: SwipeAction[];
  swipeRightActions?: SwipeAction[];
  className?: string;
}

export const ListItem = ({
  children,
  onPress,
  swipeLeftActions,
  swipeRightActions,
  className,
}: ListItemProps) => {
  const renderActions = (actions?: SwipeAction[]) => {
    if (!actions || actions.length === 0) return undefined;

    return (
      <View style={{ height: '100%', flexDirection: 'row' }}>
        {actions.map((action, idx) => (
          <Pressable
            key={idx}
            onPress={action.onPress}
            style={{
              width: action.width ?? 80,
              backgroundColor: action.color ?? '#666',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ color: action.textColor ?? '#fff', fontWeight: '600' }}>
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <Swipeable
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={() => renderActions(swipeLeftActions)}
      renderRightActions={() => renderActions(swipeRightActions)}
      enabled={(swipeLeftActions?.length ?? 0) > 0 || (swipeRightActions?.length ?? 0) > 0}>
      <Pressable
        onPress={onPress}
        className={cn('border-b border-gray-200 bg-white px-4 py-4 active:bg-gray-50', className)}>
        {children}
      </Pressable>
    </Swipeable>
  );
};
