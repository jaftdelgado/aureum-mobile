import React, { FC, ReactNode, isValidElement } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, Image } from 'react-native';
import { Icon } from '@core/ui/Icon';
import { Text } from '@core/ui/Text';
import { cn } from '@core/utils/cn';
import { ChevronRight } from '@resources/svg/general/ChevronRight';
import { useThemeColor } from '@core/design/useThemeColor';
import { IconContainer } from '@core/ui/IconContainer';

export interface ListOptionProps extends TouchableOpacityProps {
  text: string | ReactNode;
  icon?: ReactNode | Parameters<typeof IconContainer>[0]['icon'] | string; 
  iconVariant?: Parameters<typeof IconContainer>[0]['variant'];
  iconSize?: number;
  containerSize?: number;
  className?: string;
  isLast?: boolean;
  showChevron?: boolean;
}

export const ListOption: FC<ListOptionProps> = ({
  icon,
  text,
  isLast = false,
  className,
  iconVariant = 'gray',
  iconSize = 18,
  containerSize = 32,
  showChevron = true,
  ...props
}) => {
  const borderColor = useThemeColor('border');

  const renderIcon = () => {
    if (!icon) return <View style={{ width: containerSize, height: containerSize }} />;

    if (typeof icon === 'string') {
      return (
        <Image
          source={{ uri: icon }}
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
          style={{ width: containerSize, height: containerSize, alignItems: 'center', justifyContent: 'center' }} 
          className="mr-4"
        >
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
      activeOpacity={0.6}
      className={cn('flex-row items-center justify-between rounded-lg px-4 py-3', className)}
      style={[!isLast && { borderBottomWidth: 1, borderBottomColor: borderColor }]}>
      <View className="flex-row items-center space-x-3">
        
        {renderIcon()}

        {typeof text === 'string' ? (
          <Text type="body" weight="regular" color="default">
            {text}
          </Text>
        ) : (
          text
        )}
      </View>

      {showChevron && (
        <Icon component={ChevronRight} size={20} color="secondaryText" />
      )}
    </TouchableOpacity>
  );
};