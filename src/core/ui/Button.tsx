import React from 'react';
import { Pressable, ActivityIndicator, View, StyleProp, ViewStyle } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@core/utils/cn';
import { useTheme } from '@app/providers/ThemeProvider';
import { Text } from '@core/ui/Text';

const buttonStyles = cva('w-full active:opacity-80 items-center justify-center flex-row', {
  variants: {
    variant: {
      primary: '',
      secondary: '',
      outline: 'border',
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
      xl: 'rounded-[16px]',
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
  style?: StyleProp<ViewStyle>;
}

export const Button = ({
  title,
  variant = 'primary',
  size,
  rounded,
  className,
  textClassName,
  onPress,
  loading = false,
  disabled = false,
  leftIcon,
  style,
}: ButtonProps) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: { backgroundColor: theme.primaryBtn },
          textColor: theme.bg,
          spinner: theme.bg,
        };
      case 'secondary':
        return {
          container: { backgroundColor: theme.secondaryBtn },
          textColor: theme.primaryText,
          spinner: theme.primaryText,
        };
      case 'outline':
        return {
          container: { backgroundColor: 'transparent', borderColor: theme.border },
          textColor: theme.primaryText,
          spinner: theme.primaryText,
        };
      case 'link':
        return {
          container: { backgroundColor: 'transparent' },
          textColor: theme.primaryBtn,
          spinner: theme.primaryBtn,
        };
      default:
        return {
          container: { backgroundColor: theme.primaryBtn },
          textColor: theme.bg,
          spinner: theme.bg,
        };
    }
  };

  const currentStyles = getVariantStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(buttonStyles({ variant, size, rounded }), 'gap-3', className)}
      style={[currentStyles.container, (disabled || loading) && { opacity: 0.5 }, style]}>
      {loading ? (
        <ActivityIndicator color={currentStyles.spinner} />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}

          <Text
            type="body"
            weight="medium"
            align="center"
            style={{ color: currentStyles.textColor }}
            className={textClassName}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
};
