import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@core/utils/cn';

const inputWrapperStyles = cva('w-full flex-col', {
  variants: {
    size: {
      sm: 'gap-1',
      md: 'gap-1.5',
      lg: 'gap-2',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const inputStyles = cva('w-full border bg-white text-gray-900 font-body flex-row items-center', {
  variants: {
    variant: {
      default: 'border-gray-300',
      outline: 'border-gray-400',
      filled: 'bg-gray-100 border-gray-200',
    },
    size: {
      sm: 'h-12 px-4 text-body',
      md: 'h-14 px-5 text-body',
      lg: 'h-18 px-6 text-title3',
    },
    rounded: {
      none: 'rounded-none',
      md: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    error: {
      true: 'border-error',
    },
    disabled: {
      true: 'opacity-50 bg-gray-100',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    rounded: 'xl',
    error: false,
    disabled: false,
  },
});

interface TextFieldProps
  extends TextInputProps,
    VariantProps<typeof inputStyles>,
    VariantProps<typeof inputWrapperStyles> {
  label?: string;
  helperText?: string;
  errorText?: string;
  className?: string;
  inputClassName?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export const TextField = ({
  label,
  helperText,
  errorText,
  variant,
  size,
  rounded,
  disabled,
  error,
  className,
  inputClassName,
  left,
  right,
  ...props
}: TextFieldProps) => {
  const hasError = !!error || !!errorText;

  return (
    <View className={cn(inputWrapperStyles({ size }))}>
      {label && <Text className="text-body font-medium text-gray-800">{label}</Text>}

      {/* Input */}
      <View className="relative w-full">
        <View
          className={cn(
            inputStyles({
              variant,
              size,
              rounded,
              disabled,
              error: hasError,
            }),
            className
          )}>
          {left && <View className="mr-2">{left}</View>}

          <TextInput
            editable={!disabled}
            placeholderTextColor="#9ca3af"
            className={cn('flex-1 text-gray-900', inputClassName)}
            {...props}
          />

          {right && <View className="ml-2">{right}</View>}
        </View>
      </View>

      {hasError ? (
        <Text className="mt-1 text-caption1 text-error">{errorText}</Text>
      ) : helperText ? (
        <Text className="mt-1 text-caption1 text-gray-500">{helperText}</Text>
      ) : null}
    </View>
  );
};
