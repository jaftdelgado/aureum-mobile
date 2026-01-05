import React from 'react';
import { Pressable, ActivityIndicator, View, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@core/utils/cn';
import { useTheme } from '@app/providers/ThemeProvider';
import { Text } from '@core/ui/Text';
import { GlassContainer } from './GlassContainer';

const buttonStyles = cva(
  'w-full active:opacity-80 items-center justify-center flex-row overflow-hidden',
  {
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
  }
);

interface ButtonProps extends VariantProps<typeof buttonStyles> {
  title: string;
  className?: string;
  textClassName?: string;
  onPress?: () => void;
  isLoading?: boolean;
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
  isLoading = false,
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
          // El fondo y borde ahora se gestionan con GlassContainer y estilos base
          container: { borderColor: theme.border },
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

  const renderContent = () => (
    <>
      {isLoading ? (
        <ActivityIndicator color={currentStyles.spinner} />
      ) : (
        <View className="flex-row items-center justify-center gap-3">
          {leftIcon && <View>{leftIcon}</View>}
          <Text
            type="body"
            weight="medium"
            align="center"
            style={{ color: currentStyles.textColor }}
            className={textClassName}>
            {title}
          </Text>
        </View>
      )}
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={cn(buttonStyles({ variant, size, rounded }), className)}
      style={[currentStyles.container, (disabled || isLoading) && { opacity: 0.5 }, style]}>
      {variant === 'outline' ? (
        <GlassContainer intensity={30} style={StyleSheet.absoluteFill}>
          {renderContent()}
        </GlassContainer>
      ) : (
        renderContent()
      )}
    </Pressable>
  );
};
