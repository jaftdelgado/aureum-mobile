import React from 'react';
import { View, Text, ImageStyle, StyleProp } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@core/utils/cn';
import { Image } from 'expo-image';

const avatarStyles = cva('overflow-hidden items-center justify-center bg-gray-300', {
  variants: {
    mode: {
      rounded: 'rounded-full',
      square: 'rounded-[14px]',
    },
    size: {
      sm: 'w-8 h-8',
      md: 'w-11 h-11',
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
  source?: string | null;
  style?: StyleProp<ImageStyle>;
  placeholderText?: string;
  placeholder?: string | number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  mode,
  size,
  style,
  placeholderText,
  placeholder,
  className,
}) => {
  const hasImage = !!source;
  const imageSource = typeof source === 'string' ? { uri: source } : source;

  return (
    <View className={cn(avatarStyles({ mode, size }), className)} style={style}>
      {hasImage ? (
        <Image
          source={imageSource!}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          cachePolicy="disk"
          placeholder={placeholder}
        />
      ) : (
        placeholderText && <Text className="font-bold text-white">{placeholderText}</Text>
      )}
    </View>
  );
};
