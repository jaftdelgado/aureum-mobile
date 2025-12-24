import React from 'react';
import { Svg, Path, Circle } from 'react-native-svg';
import { SvgProps } from 'react-native-svg';

export const OverviewIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 16v-4" />
    <Path d="M12 8h.01" />
  </Svg>
);