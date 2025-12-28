import React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';
import { useThemeColor } from '@core/design/useThemeColor';
import { colors } from '@core/design/colors';

interface Props extends SvgProps {
  variant?: keyof typeof colors.light;
}

export const SunIcon = ({ color, variant = 'warning', ...props }: Props) => {
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
      <Circle cx="12" cy="12" r="5" />
      <Path d="M12 1v2" />
      <Path d="M12 21v2" />
      <Path d="M4.22 4.22l1.42 1.42" />
      <Path d="M18.36 18.36l1.42 1.42" />
      <Path d="M1 12h2" />
      <Path d="M21 12h2" />
      <Path d="M4.22 19.78l1.42-1.42" />
      <Path d="M18.36 5.64l1.42-1.42" />
    </Svg>
  );
};