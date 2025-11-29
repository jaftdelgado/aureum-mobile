import React from 'react';
import { Pressable } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@core/utils/cn';
import { Icon } from '@core/ui/Icon';
import type { SvgProps } from 'react-native-svg';
import { useThemeColor } from '@core/design/useThemeColor';
import { colors } from '@core/design/colors';

const iconButtonStyles = cva('items-center justify-center active:opacity-80', {
  variants: {
    size: {
      xs: 'h-8 w-8',
      sm: 'h-10 w-10',
      md: 'h-12 w-12',
      lg: 'h-14 w-14',
      xl: 'h-16 w-16',
    },
    variant: {
      primary: '',
      secondary: '',
      thirdy: 'border',
      ghost: 'bg-transparent',
    },
    rounded: {
      none: 'rounded-none',
      md: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
    rounded: 'full',
  },
});

export interface IconButtonProps extends VariantProps<typeof iconButtonStyles> {
  onPress?: () => void;
  icon: React.FC<SvgProps>;
  disabled?: boolean;
  className?: string;
}

const colorMap = {
  primary: { bg: 'primaryBtn' as const, border: 'transparent' as const, icon: 'bg' as const },
  secondary: {
    bg: 'secondaryBtn' as const,
    border: 'transparent' as const,
    icon: 'primaryText' as const,
  },
  thirdy: { bg: 'secondaryBtn' as const, border: 'border' as const, icon: 'primaryText' as const },
  ghost: {
    bg: 'transparent' as const,
    border: 'transparent' as const,
    icon: 'secondaryText' as const,
  },
};

type VariantKey = keyof typeof colorMap;
type IconColorKey = keyof typeof colors.light;

const iconSizeValues = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 20,
  xl: 18,
} as const;

export const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  icon: IconComponent,
  size = 'md',
  variant = 'primary',
  rounded,
  disabled = false,
  className,
}) => {
  const safeVariant = variant as VariantKey;
  const variantColors = colorMap[safeVariant];

  const backgroundColor = useThemeColor(variantColors.bg);
  const borderColor = useThemeColor(variantColors.border);

  const safeSize = size ?? 'md';
  const iconSize = iconSizeValues[safeSize as keyof typeof iconSizeValues];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(iconButtonStyles({ size: safeSize, variant: safeVariant, rounded }), className)}
      style={{
        backgroundColor,
        borderColor,
        borderWidth: safeVariant === 'thirdy' ? 1 : 0,
        opacity: disabled ? 0.4 : 1,
      }}>
      <Icon component={IconComponent} color={variantColors.icon as IconColorKey} size={iconSize} />
    </Pressable>
  );
};
