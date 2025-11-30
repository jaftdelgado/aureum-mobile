import React from 'react';
import { Image, ImageProps, View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@core/utils/cn';

const imageViewStyles = cva('overflow-hidden rounded-2xl bg-gray-200', {
  variants: {
    ratio: {
      square: 'aspect-square',
      fourThree: 'aspect-[4/3]',
      sixteenNine: 'aspect-[16/9]',
    },
    size: {
      sm: 'w-20',
      md: 'w-32',
      lg: 'w-48',
      full: 'w-full',
    },
  },
  defaultVariants: {
    ratio: 'square',
    size: 'full',
  },
});

interface ImageViewProps extends ImageProps, VariantProps<typeof imageViewStyles> {
  containerClass?: string;
}

export function ImageView({ ratio, size, containerClass, className, ...props }: ImageViewProps) {
  return (
    <View className={cn(imageViewStyles({ ratio, size }), containerClass)}>
      <Image
        {...props}
        className={cn('h-full w-full', className)}
        resizeMode={props.resizeMode ?? 'cover'}
      />
    </View>
  );
}
