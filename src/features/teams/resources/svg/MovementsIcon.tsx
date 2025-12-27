import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export const MovementsIcon: React.FC<SvgProps> = (props) => {
  const { width = 24, height = 24, stroke = '#262626', strokeWidth = 1.6, ...rest } = props;

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...rest}>
      <G stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M16.977 19.5A9 9 0 0 0 10 3.223M16.977 19.5V16m0 3.5H20.5M7 4.516a9 9 0 0 0 7 16.261M7 4.516V8m0-3.484H3.5" />
        <Path d="M10.438 14.667V9.333m1.562 0V8m0 8v-1.333M10.438 12h3.124m0 0c.518 0 .938.448.938 1v.667c0 .552-.42 1-.937 1H9.5M13.563 12c.517 0 .937-.448.937-1v-.667c0-.552-.42-1-.937-1H9.5" />
      </G>
    </Svg>
  );
};
