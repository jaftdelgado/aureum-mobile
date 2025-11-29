import React from 'react';
import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';
import { useThemeColor } from '@core/design/useThemeColor';
import { colors } from '@core/design/colors';

type IconColor = keyof typeof colors.light;

interface IconProps {
  color?: IconColor;
  component: FC<SvgProps>;
  size?: number;
}

export const Icon: FC<IconProps> = ({ color = 'primaryText', component: Component, size = 24 }) => {
  const themeColor = useThemeColor(color);

  return <Component width={size} height={size} stroke={themeColor} fill="none" strokeWidth={1.6} />;
};
