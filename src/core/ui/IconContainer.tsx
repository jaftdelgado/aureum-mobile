import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '@core/utils/cn';
import { Icon } from './Icon';

const VARIANT_COLORS = {
  green: '#33d056',
  blue: '#1c89fe',
  purple: '#6c43c0',
  orange: '#fc8531',
  yellow: '#f9c61b',
  gray: '#9193a0',
  'dark-gray': '#40444d',
} as const;

type Variant = keyof typeof VARIANT_COLORS;

interface IconContainerProps extends ViewProps {
  icon: Parameters<typeof Icon>[0]['component'];
  variant?: Variant;
  size?: number;
  iconSize?: number;
  className?: string;
}

export const IconContainer: React.FC<IconContainerProps> = ({
  icon,
  variant = 'gray',
  size = 32,
  iconSize = 18,
  className,
  ...props
}) => {
  const backgroundColor = VARIANT_COLORS[variant];

  return (
    <View
      {...props}
      className={cn(`items-center justify-center rounded-xl`, className)}
      style={{ width: size, height: size, backgroundColor }}>
      <Icon component={icon} color="white" size={iconSize} />
    </View>
  );
};
