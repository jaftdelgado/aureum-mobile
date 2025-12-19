// src/app/components/DisplayTitle.tsx
import React from 'react';
import { Animated } from 'react-native';
import { Text } from '@core/ui/Text';
import { cn } from '@core/utils/cn';

type DisplayTitleProps = {
  title: string;
  scrollY: Animated.Value;
  className?: string;
};

export default function DisplayTitle({ title, scrollY, className }: DisplayTitleProps) {
  const largeTitleOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={{ opacity: largeTitleOpacity }} className={cn('px-4', className)}>
      <Text type="display" color="default" weight="bold">
        {title}
      </Text>
    </Animated.View>
  );
}
