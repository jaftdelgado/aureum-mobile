import { Pressable, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@core/utils/cn';

const buttonStyles = cva('w-full rounded-2xl active:opacity-80 items-center justify-center', {
  variants: {
    variant: {
      primary: 'bg-primaryBtn text-bg',
      secondary: 'bg-secondary text-white',
      outline: 'border border-gray-300 bg-transparent text-gray-900',
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
