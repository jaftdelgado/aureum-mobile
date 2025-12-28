import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { useThemeColor } from '@core/design/useThemeColor';
import { colors } from '@core/design/colors';

interface Props extends SvgProps {
  variant?: keyof typeof colors.light;
}

export const ThemeIcon = ({ color, variant = 'primary', ...props }: Props) => {
  const themeColor = useThemeColor(variant);
  const finalColor = color ?? themeColor;

  return (
    <Svg 
      width={24} 
      height={24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={finalColor as string} 
      strokeWidth={2} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props} 
    >
      <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </Svg>
  );
};