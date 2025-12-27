import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@core/utils/cn';
import { useTheme } from '@app/providers/ThemeProvider';
import { colors } from '@core/design/colors';

type TextColor = 'default' | 'secondary' | 'success' | 'warning' | 'error';

type Props = RNTextProps &
  VariantProps<typeof textStyles> & {
    color?: TextColor;
    className?: string;
  };

const colorMap: Record<TextColor, keyof typeof colors.light> = {
  default: 'primaryText',
  secondary: 'secondaryText',
  success: 'success',
  warning: 'warning',
  error: 'error',
};

const textStyles = cva('', {
  variants: {
    type: {
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
    },
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    type: 'body',
    weight: 'regular',
    align: 'left',
  },
});

export function Text({
  type,
  weight,
  align,
  color = 'default',
  className,
  children,
  style, // Extraemos style por si pasas estilos manuales
  ...rest
}: Props) {
  // 1. Extraemos el objeto theme actual del Provider
  const { theme } = useTheme();

  // 2. Obtenemos el valor hexadecimal directamente del objeto theme
  const themeColor = theme[colorMap[color]];

  return (
    <RNText
      // Aplicamos el color y permitimos que 'style' externo sobreescriba si es necesario
      style={[{ color: themeColor }, style]}
      className={cn(textStyles({ type, weight, align }), className)}
      {...rest}>
      {children}
    </RNText>
  );
}
