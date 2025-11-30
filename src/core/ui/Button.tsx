import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@core/utils/cn';
import React from 'react';

const buttonStyles = cva('w-full rounded-2xl active:opacity-80 items-center justify-center flex-row', {
  variants: {
    variant: {
      primary: 'bg-primaryBtn text-bg',
      secondary: 'bg-secondary text-white',
      outline: 'border border-gray-300 bg-transparent text-gray-900',
      link: 'bg-transparent',
    },

    size: {
      sm: 'h-12 px-4',
      md: 'h-14 px-5',
      lg: 'h-18 px-6',
    },

    rounded: {
      none: 'rounded-none',
      md: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
    rounded: 'xl',
  },
});

interface ButtonProps extends VariantProps<typeof buttonStyles> {
  title: string;
  className?: string;
  textClassName?: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button = ({
  title,
  variant,
  size,
  rounded,
  className,
  textClassName,
  onPress,
  loading = false,
  disabled = false,
  leftIcon,
}: ButtonProps) => {
  const isOutlineOrLink = variant === 'outline' || variant === 'link';
  const spinnerColor = isOutlineOrLink ? '#000' : '#FFF';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        buttonStyles({ variant, size, rounded }),
        (disabled || loading) && 'opacity-50',
        'gap-3',
        className
      )}>
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          
          <Text
            className={cn(
              'text-center font-medium text-body',
              isOutlineOrLink ? 'text-gray-900' : 'text-white',
              variant === 'link' && 'text-blue-600',
              textClassName
            )}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
};
