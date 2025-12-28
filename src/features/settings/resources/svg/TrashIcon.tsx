import React from 'react';
import Svg, { Path, Polyline, SvgProps } from 'react-native-svg';
import { useThemeColor } from '@core/design/useThemeColor';
import { colors } from '@core/design/colors';

interface Props extends SvgProps {
  variant?: keyof typeof colors.light;
}

export const TrashIcon = ({ color, variant = 'error', ...props }: Props) => {
  const themeColor = useThemeColor(variant);
  const finalColor = color ?? themeColor;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={finalColor as string} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <Polyline points="3 6 5 6 21 6" />
      <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </Svg>
  );
};