import * as React from 'react';
import { Pressable } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@core/utils/cn';
import { IconWrapper } from '@core/ui/Icon';

const iconButtonStyles = cva('items-center justify-center active:opacity-80', {
  variants: {
    size: {
      sm: 'h-12 w-12',
      md: 'h-14 w-14',
      lg: 'h-16 w-16',
      xl: 'h-16 w-16',
    },
    variant: {
      primary: 'bg-primaryBtn',
      secondary: 'bg-gray-200',
      outline: 'border border-gray-300 bg-transparent',
      ghost: 'bg-transparent',
    },
    rounded: {
      none: 'rounded-none',
      md: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-[20px]',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
    rounded: 'xl',
  },
});

export interface IconButtonProps extends VariantProps<typeof iconButtonStyles> {
  onPress?: () => void;
  icon: React.FC<{ width?: number; height?: number; className?: string }>;
  iconSize?: number;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  icon: Icon,
  iconSize,
  size,
  variant,
  rounded,
  className,
}) => {
  const resolvedSize = iconSize ?? { sm: 20, md: 24, lg: 28, xl: 20 }[size ?? 'md'];

  // Clase Tailwind que determina el color del icono
  const iconClassName = variant === 'primary' ? 'bg' : 'warning';

  return (
    <Pressable
      onPress={onPress}
      className={cn(iconButtonStyles({ size, variant, rounded }), className)}>
      <IconWrapper className={iconClassName}>
        <Icon width={resolvedSize} height={resolvedSize} />
      </IconWrapper>
    </Pressable>
  );
};
