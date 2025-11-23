import React from 'react';
import { Image, ImageSourcePropType, ImageStyle, View, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@core/utils/cn';

const avatarStyles = cva('overflow-hidden items-center justify-center bg-gray-300', {
  variants: {
    mode: {
      rounded: 'rounded-full',
      square: 'rounded-[14px]',
    },
    size: {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24',
    },
  },
  defaultVariants: {
    mode: 'rounded',
    size: 'md',
  },
});

export interface AvatarProps extends VariantProps<typeof avatarStyles> {
  source?: ImageSourcePropType | null;
  style?: ImageStyle;
  placeholderText?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ source, mode, size, style, placeholderText }) => {
  const hasImage = source != null;

  return hasImage ? (
    <Image
      source={source as ImageSourcePropType}
      className={cn(avatarStyles({ mode, size }))}
      style={style}
    />
  ) : (
    <View className={cn(avatarStyles({ mode, size }))} style={style}>
      {placeholderText && <Text className="font-bold text-white">{placeholderText}</Text>}
    </View>
  );
};
