// src/core/ui/Carousel.tsx
import React from 'react';
import { ScrollView, View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@core/utils/cn';

const carouselStyles = cva('flex-row', {
  variants: {
    gap: {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
    },
    padding: {
      none: '',
      sm: 'px-2',
      md: 'px-4',
      lg: 'px-6',
    },
  },
  defaultVariants: {
    gap: 'md',
    padding: 'md',
  },
});

interface CarouselProps extends VariantProps<typeof carouselStyles> {
  children: React.ReactNode;
  className?: string;
  snap?: boolean; // snapping opcional
}

export function Carousel({ children, gap, padding, className, snap = false }: CarouselProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 8 }}
      snapToAlignment={snap ? 'start' : undefined}
      decelerationRate={snap ? 'fast' : undefined}
      snapToInterval={undefined} // para snapping avanzado luego
    >
      <View className={cn(carouselStyles({ gap, padding }), className)}>{children}</View>
    </ScrollView>
  );
}
