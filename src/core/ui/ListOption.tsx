import React, { FC, ReactNode, isValidElement } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, Image, Switch } from 'react-native';
import { Icon } from '@core/ui/Icon';
import { Text } from '@core/ui/Text';
import { cn } from '@core/utils/cn';
import { ChevronRight } from '@resources/svg/general/ChevronRight';
import { useThemeColor } from '@core/design/useThemeColor';
import { IconContainer } from '@core/ui/IconContainer';
import { useTheme } from '@app/providers/ThemeProvider';

export interface ListOptionProps extends TouchableOpacityProps {
  text: string | ReactNode;
  rightText?: string;
  icon?: ReactNode | Parameters<typeof IconContainer>[0]['icon'] | string;
  iconVariant?: Parameters<typeof IconContainer>[0]['variant'];
  iconSize?: number;
  containerSize?: number;
  className?: string;
  isLast?: boolean;
  showChevron?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export const ListOption: FC<ListOptionProps> = ({
  icon,
  text,
  rightText,
  isLast = false,
  className,
  iconVariant = 'gray',
  iconSize = 18,
  containerSize = 32,
  showChevron = true,
  showSwitch = false,
  switchValue,
  onSwitchChange,
  ...props
}) => {
  const { theme } = useTheme();
  const borderColor = useThemeColor('border');

  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string') {
      return (
        <Image
          source={{ uri: icon }}
          className="mr-4"
          style={{
            width: containerSize,
            height: containerSize,
            borderRadius: containerSize / 2,
          }}
          resizeMode="cover"
        />
      );
    }

    if (isValidElement(icon)) {
      return (
        <View
          style={{
            width: containerSize,
            height: containerSize,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="mr-4">
          {icon}
        </View>
      );
    }

    return (
      <IconContainer
        icon={icon as any}
        variant={iconVariant}
        size={containerSize}
        iconSize={iconSize}
        className="mr-4"
      />
    );
  };

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={showSwitch ? 1 : 0.6}
      disabled={props.disabled || showSwitch}
      className={cn(
        'flex-row items-center justify-between rounded-lg px-4 py-3',
        !icon && 'h-14',
        className
      )}

      style={[!isLast && { borderBottomWidth: 1, borderBottomColor: borderColor }]}>
      <View className="flex-1 flex-row items-center">
        {renderIcon()}

        {typeof text === 'string' ? (
          <Text type="body" weight="regular" color="default" className="flex-1">
            {text}
          </Text>
        ) : (
          <View className="flex-1">{text}</View>
        )}
      </View>

      <View className="flex-row items-center gap-2">
        {rightText && (
          <Text type="body" color="secondary">
            {rightText}
          </Text>
        )}

        {showSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: theme.border, true: theme.success }}
            thumbColor={theme.primaryText}
          />
        ) : (
          showChevron && <Icon component={ChevronRight} size={20} color="secondaryText" />
        )}
      </View>
    </TouchableOpacity>
  );
};
