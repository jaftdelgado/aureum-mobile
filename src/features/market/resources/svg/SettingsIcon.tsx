import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export const SettingsIcon: React.FC<SvgProps> = (props) => {
  const { width = 24, height = 24, stroke = '#171717', strokeWidth = 1.5, ...rest } = props;

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...rest}>
      <G stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M11 10.27L7 3.34m4 10.39l-4 6.93M12 22v-2m0-18v2m2 8h8m-5 8.66l-1-1.73m1-15.59l-1 1.73M2 12h2m16.66 5l-1.73-1m1.73-9l-1.73 1M3.34 17l1.73-1M3.34 7l1.73 1" />
        <Circle cx={12} cy={12} r={2} />
        <Circle cx={12} cy={12} r={8} />
      </G>
    </Svg>
  );
};
