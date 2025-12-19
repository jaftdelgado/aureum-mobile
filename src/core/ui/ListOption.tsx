// src/core/ui/ListOption.tsx
import React, { FC, ReactNode } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, Image } from 'react-native';
import { Icon } from '@core/ui/Icon';
import { Text } from '@core/ui/Text';
import { cn } from '@core/utils/cn';
import { ChevronRight } from '@resources/svg/general/ChevronRight';
import { useThemeColor } from '@core/design/useThemeColor';
import { IconContainer } from '@core/ui/IconContainer';

export interface ListOptionProps extends TouchableOpacityProps {
  text: string | ReactNode;
  icon?: Parameters<typeof IconContainer>[0]['icon'] | string;
  iconVariant?: Parameters<typeof IconContainer>[0]['variant'];
  iconSize?: number;
  containerSize?: number;

  className?: string;
  isLast?: boolean;
}

export const ListOption: FC<ListOptionProps> = ({
  icon,
  text,
  isLast = false,
  className,
  iconVariant = 'gray',
  iconSize = 18,
  containerSize = 32,
  ...props
}) => {
  const borderColor = useThemeColor('border');

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.6}
      className={cn('flex-row items-center justify-between rounded-lg px-4 py-3', className)}
      style={[!isLast && { borderBottomWidth: 1, borderBottomColor: borderColor }]}>
      <View className="flex-row items-center space-x-3">
        {icon ? (
          typeof icon === 'string' ? (
            <Image
              source={{ uri: icon }}
              style={{
                width: containerSize,
                height: containerSize,
                borderRadius: containerSize / 2,
              }}
              resizeMode="cover"
              defaultSource={undefined} // opcional: require('../../assets/placeholder.png')
            />
          ) : (
            // icon es componente
            <IconContainer
              icon={icon}
              variant={iconVariant}
              size={containerSize}
              iconSize={iconSize}
              className="mr-4"
            />
          )
        ) : (
          <View style={{ width: containerSize, height: containerSize }} />
        )}

        {typeof text === 'string' ? (
          <Text type="body" weight="regular" color="default">
            {text}
          </Text>
        ) : (
          text
        )}
      </View>

      <Icon component={ChevronRight} size={20} color="secondaryText" />
    </TouchableOpacity>
  );
};
