import { Pressable, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@core/utils/cn';

const buttonStyles = cva(
  // iOS style: full width, taller, softer radius
  'w-full rounded-2xl active:opacity-80 items-center justify-center',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white',
        secondary: 'bg-secondary text-white',
        outline: 'border border-gray-300 bg-transparent text-gray-900',
      },

      size: {
        sm: 'h-12 px-4', // 44px (iOS mínimo)
        md: 'h-14 px-5', // 48px
        lg: 'h-18 px-6', // 56px estilo iOS grande
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
  }
);

interface ButtonProps extends VariantProps<typeof buttonStyles> {
  title: string;
  className?: string;
  textClassName?: string;
  onPress?: () => void;
}

export const Button = ({
  title,
  variant,
  size,
  rounded,
  className,
  textClassName,
  onPress,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={cn(buttonStyles({ variant, size, rounded }), className)}>
      <Text
        className={cn(
          'text-center text-body font-medium',
          variant === 'outline' ? 'text-gray-900' : 'text-white',
          textClassName
        )}>
        {title}
      </Text>
    </Pressable>
  );
};
