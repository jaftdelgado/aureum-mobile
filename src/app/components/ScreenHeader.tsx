import React from 'react';
import { View } from 'react-native';
import { cn } from '@core/utils/cn';
import { Text } from '@core/ui/Text';

export type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
};

export function ScreenHeader({ title, subtitle, right, className }: ScreenHeaderProps) {
  return (
    <View className={cn('w-full flex-row items-center justify-between px-4 py-3', className)}>
      <View className="flex-1">
        <Text type="title1" color="default" weight="semibold">
          {title}
        </Text>
        {subtitle ? (
          <Text type="subhead" color="secondary" className="mt-0.5">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View className="ml-3">{right}</View> : null}
    </View>
  );
}
