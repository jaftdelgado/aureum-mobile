import React, { ReactNode } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { cn } from '@core/utils/cn';
import { useTheme } from '@app/providers/ThemeProvider';
import { Text } from '@core/ui/Text';
import { Separator } from '@core/ui/Separator';

type SwipeAction = {
  label: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  width?: number;
};

interface ListItemProps {
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  children?: ReactNode;
  onPress?: () => void;
  swipeLeftActions?: SwipeAction[];
  swipeRightActions?: SwipeAction[];
  className?: string;
  showSeparator?: boolean;
  isLast?: boolean;
}

export const ListItem = ({
  title,
  subtitle,
  leftElement,
  rightElement,
  children,
  onPress,
  swipeLeftActions,
  swipeRightActions,
  className,
  showSeparator = true,
  isLast = false,
}: ListItemProps) => {
  const { theme, isDark } = useTheme();

  const renderActions = (actions?: SwipeAction[]) => {
    if (!actions || actions.length === 0) return undefined;
    return (
      <View style={styles.actionsContainer}>
        {actions.map((action, idx) => (
          <Pressable
            key={idx}
            onPress={action.onPress}
            style={{
              width: action.width ?? 80,
              backgroundColor: action.color ?? (isDark ? theme.secondaryBtn : theme.secondary),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text weight="semibold" style={{ color: action.textColor ?? theme.white }}>
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  const shouldShowSeparator = showSeparator && !isLast;

  return (
    <Swipeable
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={() => renderActions(swipeLeftActions)}
      renderRightActions={() => renderActions(swipeRightActions)}
      enabled={(swipeLeftActions?.length ?? 0) > 0 || (swipeRightActions?.length ?? 0) > 0}
      containerStyle={{ backgroundColor: theme.bg }}>
      <View>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            { backgroundColor: pressed ? (isDark ? '#1f2937' : '#f3f4f6') : theme.bg },
          ]}
          className={cn('flex-row items-center px-4 py-4', className)}>
          {leftElement && <View className="mr-3">{leftElement}</View>}

          <View className="relative h-full flex-1 flex-row items-center">
            <View className="flex-1 justify-center">
              {title && (
                <View>
                  {typeof title === 'string' ? (
                    <Text type="body" weight="medium">
                      {title}
                    </Text>
                  ) : (
                    title
                  )}
                </View>
              )}
              {subtitle && (
                <View>
                  {typeof subtitle === 'string' ? (
                    <Text type="subhead" color="secondary">
                      {subtitle}
                    </Text>
                  ) : (
                    subtitle
                  )}
                </View>
              )}
              {children}
            </View>

            {rightElement && <View className="ml-3">{rightElement}</View>}

            {shouldShowSeparator && leftElement && (
              <Separator className="absolute -bottom-4 left-0 right-[-16px]" />
            )}
          </View>
        </Pressable>

        {shouldShowSeparator && !leftElement && <Separator className="w-full" />}
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    height: '100%',
    flexDirection: 'row',
  },
});
