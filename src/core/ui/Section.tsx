import React, { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@core/utils/cn';
import { Text } from '@core/ui/Text';

type SectionProps = ViewProps &
  VariantProps<typeof sectionStyles> & {
    title: string;
    subtitle?: string;
    right?: ReactNode;
    children?: ReactNode;
    className?: string;
  };

const sectionStyles = cva('w-full px-4 py-3', {
  variants: {
    spacing: {
      sm: 'py-2',
      md: 'py-3',
      lg: 'py-4',
    },
    bordered: {
      true: 'border-b border-secondaryBorder',
      false: '',
    },
  },
  defaultVariants: {
    spacing: 'md',
    bordered: false,
  },
});

export function Section({
  title,
  subtitle,
  right,
  children,
  spacing,
  bordered,
  className,
  ...rest
}: SectionProps) {
  return (
    <View className={cn(sectionStyles({ spacing, bordered }), className)} {...rest}>
      <View className="mb-3 w-full flex-row items-center justify-between">
        <View className="flex-1">
          <Text type="title3" weight="semibold">
            {title}
          </Text>

          {subtitle && (
            <Text type="subhead" color="secondary" className="mt-0.5">
              {subtitle}
            </Text>
          )}
        </View>

        {right ? <View className="ml-3">{right}</View> : null}
      </View>

      {/* CHILDREN */}
      {children ? <View className="w-full">{children}</View> : null}
    </View>
  );
}
