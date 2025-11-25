import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cn } from '@core/utils/cn';
import React from 'react';
import { useThemeColor } from '@core/design/useThemeColor';

type TextType =
  | 'display'
  | 'large-title'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subhead'
  | 'footnote'
  | 'caption1'
  | 'caption2';

type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
type TextColor = 'default' | 'secondary' | 'success' | 'warning' | 'error';

type Props = RNTextProps & {
  type?: TextType;
  weight?: TextWeight;
  color?: TextColor;
  align?: 'left' | 'center' | 'right';
  className?: string;
};

const typeClasses: Record<TextType, string> = {
  display: 'text-display',
  'large-title': 'text-large-title',
  title1: 'text-title1',
  title2: 'text-title2',
  title3: 'text-title3',
  headline: 'text-headline',
  body: 'text-body',
  callout: 'text-callout',
  subhead: 'text-subhead',
  footnote: 'text-footnote',
  caption1: 'text-caption1',
  caption2: 'text-caption2',
};

const weightClasses: Record<TextWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const colorMap: Record<TextColor, keyof typeof import('@core/design/colors').colors.light> = {
  default: 'primaryText',
  secondary: 'secondaryText',
  success: 'success',
  warning: 'warning',
  error: 'error',
};

export function Text({
  type = 'body',
  weight = 'regular',
  color = 'default',
  align = 'left',
  className,
  children,
  ...rest
}: Props) {
  const themeColor = useThemeColor(colorMap[color]);

  return (
    <RNText
      style={{ color: themeColor }}
      className={cn(
        typeClasses[type],
        weightClasses[weight],
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      {...rest}>
      {children}
    </RNText>
  );
}
