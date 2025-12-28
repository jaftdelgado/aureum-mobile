import React from 'react';
import Svg, { Path, Circle, SvgProps } from 'react-native-svg';
import { useThemeColor } from '@core/design/useThemeColor';
import { colors } from '@core/design/colors';

interface Props extends SvgProps {
  variant?: keyof typeof colors.light;
}

export const LanguageIcon = ({ color, variant = 'secondary', ...props }: Props) => {
  const themeColor = useThemeColor(variant);
  const finalColor = color ?? themeColor;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={finalColor as string} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M2 12h20" />
      <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  );
};